"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/*
 * Ends the dashboard session when the user leaves the dashboard for the public
 * site. proxy.ts sets a readable `dash_active` flag while the user is on any
 * /dashboard route; when the current path is no longer a dashboard route but the
 * flag is still present, we POST to the sign-out route so returning to /dashboard
 * needs a fresh login.
 *
 * Rendered on every page but a no-op for visitors who were never in the dashboard
 * (no flag) and while inside the dashboard (path guard) — so it never touches a
 * normal marketing visit, and a reload of a dashboard page keeps the session
 * (still a /dashboard path).
 */
export function DashboardExitGuard() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/dashboard")) return;

    const inDashboard = document.cookie
      .split("; ")
      .some((c) => c.startsWith("dash_active="));
    if (!inDashboard) return;

    // keepalive lets the request finish even if it races a navigation.
    void fetch("/api/session/logout", {
      method: "POST",
      credentials: "same-origin",
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
