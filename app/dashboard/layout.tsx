import type { Metadata } from "next";

/*
 * The dashboard is the site's only dynamic, authenticated surface. Reading the
 * session cookie already forces dynamic rendering; the explicit export
 * documents that and keeps the 10 marketing routes statically prerendered.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  // Internal tool — keep it out of search indexes.
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-dvh bg-ink text-fg">{children}</div>;
}
