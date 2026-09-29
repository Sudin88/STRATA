import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { getAdminUser } from "@/lib/dashboard/auth";
import { countPendingReviews } from "@/lib/dashboard/reviews";

/*
 * Shell for every authenticated dashboard page. This is the single auth gate:
 * getAdminUser() re-validates the session server-side (proxy.ts already
 * redirected anonymous hits; RLS scopes the data). It's cache()d, so pages that
 * call it again pay nothing. The login page lives outside this route group, so
 * it stays bare and can't loop through the gate.
 */
export default async function AuthedDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getAdminUser();
  const pendingReviews = await countPendingReviews();

  return (
    <div className="lg:pl-64">
      <DashboardSidebar
        email={user.email ?? ""}
        pendingReviews={pendingReviews}
      />
      <main className="min-h-dvh">{children}</main>
    </div>
  );
}
