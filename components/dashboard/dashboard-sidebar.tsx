"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Inbox, Star, LogOut } from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import { signOutAction } from "@/app/dashboard/actions";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number;
};

/*
 * The authenticated shell's navigation. Rendered by the (dash) layout, which
 * has already checked the session, so it assumes a signed-in admin. Sign out
 * posts to the signOutAction Server Action (which self-authenticates).
 *
 * Responsive: a fixed left rail from lg up, a top bar with a scrollable nav row
 * below that.
 */
export function DashboardSidebar({
  email,
  pendingReviews,
}: {
  email: string;
  pendingReviews: number;
}) {
  const pathname = usePathname();

  const items: NavItem[] = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/leads", label: "Leads", icon: Inbox },
    {
      href: "/dashboard/reviews",
      label: "Reviews",
      icon: Star,
      badge: pendingReviews > 0 ? pendingReviews : undefined,
    },
  ];

  return (
    <>
      {/* Desktop: fixed left rail */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-line bg-surface lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-line px-6">
          <LogoMark className="size-6" />
          <span className="text-sm font-semibold tracking-wide text-fg">
            Dashboard
          </span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {items.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={pathname === item.href}
            />
          ))}
        </nav>

        <div className="border-t border-line p-4">
          {email && (
            <p className="mb-3 truncate px-3 text-xs text-dim" title={email}>
              {email}
            </p>
          )}
          <SignOutButton />
        </div>
      </aside>

      {/* Mobile: top bar */}
      <div className="border-b border-line bg-surface lg:hidden">
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <LogoMark className="size-6" />
            <span className="text-sm font-semibold tracking-wide text-fg">
              Dashboard
            </span>
          </div>
          <SignOutButton compact />
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-line px-3 py-2">
          {items.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={pathname === item.href}
            />
          ))}
        </nav>
      </div>
    </>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-10 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
        active
          ? "bg-ion-soft text-ion"
          : "text-mut hover:bg-raise hover:text-fg",
      )}
    >
      <Icon aria-hidden className="size-4 shrink-0" />
      {item.label}
      {item.badge !== undefined && (
        <span className="ml-auto inline-flex min-w-5 items-center justify-center rounded-pill bg-ion px-1.5 py-0.5 text-xs font-semibold text-surface">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

function SignOutButton({ compact = false }: { compact?: boolean }) {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className={cn(
          "inline-flex min-h-10 items-center gap-2 rounded-pill border border-line text-sm font-medium text-mut transition-colors hover:border-line-strong hover:text-fg",
          compact ? "px-4 py-2" : "w-full justify-center px-4 py-2",
        )}
      >
        <LogOut className="size-4" aria-hidden />
        Sign out
      </button>
    </form>
  );
}
