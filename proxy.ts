import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

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
