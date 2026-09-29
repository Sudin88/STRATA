import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

/*
 * submit — the single server-side entry point for BOTH public forms
 * (contact → inquiries, feedback → reviews). The browser no longer writes to
 * Supabase directly; it calls this function, which is the only place inserts
 * can happen. That lets us enforce, server-side (i.e. un-bypassable):
 *
 *   1. Honeypot + timing re-check   — the client already drops obvious bots,
 *                                     but a script POSTing straight here can't.
 *   2. Per-IP rate limiting         — a burst window and an hourly window,
 *                                     plus a global backstop, via the
 *                                     submission_events table (IP stored only
 *                                     as a salted hash — no PII).
 *   3. Real email verification      — syntax → disposable-domain blocklist →
 *                                     live MX/A DNS lookup. Answers the actual
 *                                     "can this address receive mail?" question,
 *                                     not just "does it look like an email?".
 *
 * Inserts use the service-role key (server-only, injected by the platform), so
 * once anon INSERT is revoked on the tables, THIS is the only writer. Deployed
 * with verify_jwt = false because it is a public form endpoint called with the
 * publishable key (which is not a JWT); the protections above are what gate it.
 */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
// Optional: set `IP_HASH_SALT` (Edge Function secret) so IP hashes aren't
// guessable. Falls back to a constant if unset — still non-reversible, just
// less resistant to a precomputed-rainbow attack on the (huge) IPv4 space.
const IP_SALT = Deno.env.get("IP_HASH_SALT") ?? "strata-submit-v1";

// --- Rate-limit budgets (per IP, and one global backstop) ---------------
const BURST_MAX = 3; // per IP …
const BURST_WINDOW_MS = 60_000; // … within 60s
const HOURLY_MAX = 10; // per IP within 1 hour (both forms combined)
const HOURLY_WINDOW_MS = 60 * 60_000;
const GLOBAL_HOURLY_MAX = 500; // whole-site backstop within 1 hour

const MIN_FILL_MS = 1500; // mirrors components/ui/spam-guard.tsx

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

// A short, high-signal list of throwaway/disposable domains. Not exhaustive by
// design — the MX check below catches the long tail of dead domains; this just
// rejects the obvious burner services outright.
const DISPOSABLE = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.info", "grr.la",
  "sharklasers.com", "10minutemail.com", "10minutemail.net", "tempmail.com",
  "temp-mail.org", "tempmailo.com", "throwawaymail.com", "getnada.com",
  "nada.email", "trashmail.com", "trashmail.de", "yopmail.com", "yopmail.fr",
  "dispostable.com", "maildrop.cc", "mailnesia.com", "mailcatch.com",
  "fakeinbox.com", "spamgourmet.com", "mytemp.email", "moakt.com",
  "emailondeck.com", "mohmal.com", "burnermail.io", "tempr.email",
  "discard.email", "maileater.com", "spam4.me", "tempinbox.com",
  "20minutemail.com", "33mail.com", "anonaddy.me", "mailsac.com",
  "inboxbear.com", "byom.de", "einrot.com", "gettempmail.com",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** SHA-256 of `salt:ip`, hex — a stable, non-reversible per-IP key. */
async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(`${IP_SALT}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** First hop of x-forwarded-for is the real client on Supabase's edge. */
function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") ?? "unknown";
}

/**
 * Deliverability check: is this address syntactically valid, not a known
 * disposable domain, and does its domain actually publish an MX (or, per RFC
 * 5321 §5.1, a fallback A/AAAA) record? Returns true only when mail could
 * plausibly be delivered — the "true or false" the form owner asked for.
 */
async function emailIsReal(email: string): Promise<boolean> {
  if (!EMAIL_RE.test(email) || email.length > 254) return false;
  const domain = email.slice(email.lastIndexOf("@") + 1).toLowerCase();
  if (DISPOSABLE.has(domain)) return false;
  try {
    const mx = await Deno.resolveDns(domain, "MX");
    if (mx.length > 0) return true;
  } catch {
    // fall through to A/AAAA — some valid domains receive mail without MX
  }
  for (const kind of ["A", "AAAA"] as const) {
    try {
      const rec = await Deno.resolveDns(domain, kind);
      if (rec.length > 0) return true;
    } catch {
      // try next record type
    }
  }
  return false;
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/** Returns null when within budget, or a 429 Response when the caller is over. */
async function checkRateLimit(ipHash: string): Promise<Response | null> {
  const now = Date.now();
  const sinceHour = new Date(now - HOURLY_WINDOW_MS).toISOString();

  // One query for this IP's recent events; count the burst window in memory.
  const { data: mine } = await admin
    .from("submission_events")
    .select("created_at")
    .eq("ip_hash", ipHash)
    .gte("created_at", sinceHour);

  const rows = mine ?? [];
  if (rows.length >= HOURLY_MAX) return json({ error: "rate_limited" }, 429);
  const burstFrom = now - BURST_WINDOW_MS;
  const burst = rows.filter((r) => Date.parse(r.created_at) >= burstFrom).length;
  if (burst >= BURST_MAX) return json({ error: "rate_limited" }, 429);

  // Global backstop: protects the DB from a distributed flood.
  const { count } = await admin
    .from("submission_events")
    .select("*", { count: "exact", head: true })
    .gte("created_at", sinceHour);
  if ((count ?? 0) >= GLOBAL_HOURLY_MAX) return json({ error: "rate_limited" }, 429);

  return null;
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method" }, 405);

  let body: {
    kind?: string;
    trap?: string;
    elapsedMs?: number;
    payload?: Record<string, unknown>;
  };
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad_request" }, 400);
  }

  const kind = body.kind;
  const payload = body.payload ?? {};
  if (kind !== "inquiry" && kind !== "feedback")
    return json({ error: "bad_request" }, 400);

  // Silent bot drop — mirror the client: honeypot filled, or submitted faster
  // than a human could. Report success so a bot learns nothing; write nothing.
  if (str(body.trap) !== "") return json({ ok: true });
  if (typeof body.elapsedMs === "number" && body.elapsedMs < MIN_FILL_MS)
    return json({ ok: true });

  const ipHash = await hashIp(clientIp(req));
  const limited = await checkRateLimit(ipHash);
  if (limited) return limited;

  // Count every real attempt (bot filters already passed) toward the limit, so
  // repeated invalid-email/invalid-field tries are throttled too — not just
  // successful inserts. Prune stale rows opportunistically while we're here.
  await admin.from("submission_events").insert({ ip_hash: ipHash, kind });
  admin
    .from("submission_events")
    .delete()
    .lt("created_at", new Date(Date.now() - 25 * 60 * 60_000).toISOString())
    .then(() => {}, () => {});

  let row: Record<string, unknown>;
  let table: "inquiries" | "reviews";

  if (kind === "inquiry") {
    const name = str(payload.name);
    const email = str(payload.email);
    const service = str(payload.service);
    const details = str(payload.details);
    if (!name || !service || details.length < 10)
      return json({ error: "invalid_fields" }, 422);
    if (!(await emailIsReal(email)))
      return json({ error: "invalid_email" }, 422);
    table = "inquiries";
    row = {
      name,
      company: str(payload.company) || null,
      email,
      website: str(payload.website) || null,
      service,
      budget: str(payload.budget) || null,
      details,
    };
  } else {
    const name = str(payload.name);
    const email = str(payload.email);
    const rating = Number(payload.rating);
    const feedback = str(payload.feedback);
    if (!name || !Number.isInteger(rating) || rating < 1 || rating > 5 || feedback.length < 10)
      return json({ error: "invalid_fields" }, 422);
    // Email is optional on feedback — only verify when one was supplied.
    if (email && !(await emailIsReal(email)))
      return json({ error: "invalid_email" }, 422);
    table = "reviews";
    row = {
      name,
      company: str(payload.company) || null,
      email: email || null,
      rating,
      feedback,
      consent: payload.consent === true,
      approved: false, // never published until we approve it in the dashboard
    };
  }

  const { error } = await admin.from(table).insert(row);
  if (error) {
    console.error("submit: insert failed", table, error.message);
    return json({ error: "server_error" }, 500);
  }

  return json({ ok: true });
});


