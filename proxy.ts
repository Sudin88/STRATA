import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/*
 * Optional network cloak. When DASHBOARD_IP_ALLOWLIST is set (comma-separated),
 * any /dashboard request from an IP outside it gets a bare 404 — the route reads
 * as nonexistent, not merely locked. Leave the env var UNSET to disable the gate
 * (fail-open): that's the default locally and until you opt in on Vercel, so
 * shipping this code changes nothing on its own.
 *
 * Entries may be single IPs (v4 or v6) or CIDR ranges (`1.2.3.0/24`,
 * `2400:1a00:4ba4:89d::/64`). A range matters for residential IPv6: the host
 * half rotates via privacy extensions, so allowlist the stable /64 prefix, not
 * the full address. Dual-stack clients often reach us over v6 — list both your
 * v4 and your v6 /64.
 *
 * On Vercel the true client IP is the leftmost x-forwarded-for hop (set by their
 * edge, so a client can't forge it), with x-real-ip as a fallback.
 */
export function clientIp(request: NextRequest): string | null {
  const xff = request.headers.get("x-forwarded-for");
  const first = xff?.split(",")[0]?.trim();
  if (first) return first;
  return request.headers.get("x-real-ip");
}

export function dashboardIpAllowed(request: NextRequest): boolean {
  const raw = process.env.DASHBOARD_IP_ALLOWLIST?.trim();
  if (!raw) return true; // gate disabled — no allowlist configured

  const allow = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (allow.length === 0) return true;

  const ipStr = clientIp(request);
  if (!ipStr) return false; // allowlist set but IP unknown → deny (prod safety)
  const ip = parseIp(ipStr);
  if (!ip) return false;
  return allow.some((entry) => ipMatches(entry, ip));
}

type ParsedIp = { version: 4 | 6; bytes: number[] };

function parseIp(ip: string): ParsedIp | null {
  return ip.includes(":") ? parseIpv6(ip) : parseIpv4(ip);
}

function parseIpv4(ip: string): ParsedIp | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  const bytes: number[] = [];
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const n = Number(part);
    if (n > 255) return null;
    bytes.push(n);
  }
  return { version: 4, bytes };
}

// Compares an allowlist entry (single IP or CIDR) against a parsed client IP,
// matching only the leading `prefix` bits (the whole address when no /len).
function ipMatches(entry: string, ip: ParsedIp): boolean {
  const slash = entry.indexOf("/");
  const parsed = parseIp(slash === -1 ? entry : entry.slice(0, slash));
  if (!parsed || parsed.version !== ip.version) return false;

  const totalBits = ip.version === 4 ? 32 : 128;
  let prefix = totalBits;
  if (slash !== -1) {
    const p = Number(entry.slice(slash + 1));
    if (!Number.isInteger(p) || p < 0 || p > totalBits) return false;
    prefix = p;
  }
  const fullBytes = prefix >> 3;
  for (let i = 0; i < fullBytes; i++) {
    if (parsed.bytes[i] !== ip.bytes[i]) return false;
  }
  const remBits = prefix & 7;
  if (remBits) {
    const mask = (0xff << (8 - remBits)) & 0xff;
    if ((parsed.bytes[fullBytes] & mask) !== (ip.bytes[fullBytes] & mask))
      return false;
  }
  return true;
}

function parseIpv6(ip: string): ParsedIp | null {
  const zone = ip.indexOf("%"); // strip any zone id (e.g. fe80::1%eth0)
  if (zone !== -1) ip = ip.slice(0, zone);

  const halves = ip.split("::");
  if (halves.length > 2) return null;

  // Parses colon-separated hextets; a trailing embedded IPv4 becomes 2 hextets.
  const parseGroups = (s: string): number[] | null => {
    if (s === "") return [];
    const groups: number[] = [];
    for (const g of s.split(":")) {
      if (g.includes(".")) {
        const v4 = parseIpv4(g);
        if (!v4) return null;
        groups.push(
          (v4.bytes[0] << 8) | v4.bytes[1],
          (v4.bytes[2] << 8) | v4.bytes[3],
        );
        continue;
      }
      if (!/^[0-9a-fA-F]{1,4}$/.test(g)) return null;
      groups.push(parseInt(g, 16));
    }
    return groups;
  };

  let groups: number[];
  if (halves.length === 2) {
    const left = parseGroups(halves[0]);
    const right = parseGroups(halves[1]);
    if (!left || !right) return null;
    const missing = 8 - left.length - right.length;
    if (missing < 1) return null; // "::" must stand for at least one group
    groups = [...left, ...Array<number>(missing).fill(0), ...right];
  } else {
    const all = parseGroups(ip);
    if (!all) return null;
    groups = all;
  }
  if (groups.length !== 8) return null;

  const bytes: number[] = [];
  for (const g of groups) bytes.push((g >> 8) & 0xff, g & 0xff);
  return { version: 6, bytes };
}

/*
 * Next.js 16 renamed `middleware` → `proxy` (the export must be named `proxy`).
 * Runs on the Node.js runtime; do not add a `runtime` export.
 *
 * This is an OPTIMISTIC gate only — it refreshes the Supabase session and
 * redirects based on presence of a user. The real authorization boundary is
 * row-level security on `inquiries` (scoped to the admin_emails allowlist) plus
 * the server-side check in the dashboard page. Per the Next.js auth guide,
 * proxy must not be the only line of defense.
 */
export async function proxy(request: NextRequest) {
  // Network cloak first: a non-allowlisted IP never reaches auth or Supabase.
  if (!dashboardIpAllowed(request)) {
    return new NextResponse("This page could not be found.", { status: 404 });
  }

  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/dashboard/login";

  // Carry the (possibly refreshed) auth cookies onto any redirect we return.
  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  };

  if (!user && !isLoginRoute) {
    // No session: bounce to login and clear any stale "in dashboard" flag.
    response.cookies.set("dash_active", "", { path: "/", maxAge: 0 });
    return redirectTo("/dashboard/login");
  }
  if (user && isLoginRoute) return redirectTo("/dashboard");

  // Authenticated on a dashboard route: mark the session "in dashboard" so the
  // client-side DashboardExitGuard can end it the moment the user navigates back
  // to the marketing site. Not httpOnly — it's only a location flag that browser
  // JS must be able to read (it carries no session material).
  if (user) {
    response.cookies.set("dash_active", "1", {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}

export const config = {
  // Only guard the dashboard; marketing routes stay untouched (and static).
  matcher: ["/dashboard/:path*"],
};
