"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/data";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  /*
   * Close the drawer whenever the route changes — including history
   * navigation, which no click handler would catch. Adjusting state during
   * render rather than in an effect avoids a frame of stale open drawer.
   */
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock background scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape closes the drawer
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || open
          ? "border-b border-line bg-ink/85 py-3 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent py-4 sm:py-5"
      )}
    >
      <nav
        className="relative z-50 mx-auto flex w-full max-w-[1200px] items-center justify-between px-5 sm:px-8"
        aria-label="Main navigation"
      >
        <Logo onClick={() => setOpen(false)} />

        <ul className="hidden items-center gap-7 lg:flex xl:gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "link-sweep text-sm font-medium transition-colors",
                  isActive(link.href) ? "text-fg" : "text-mut hover:text-fg"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-pill bg-fg px-5 py-2.5 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_rgba(18,19,20,0.32)]"
          >
            Start a Project
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-xl border border-line lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </nav>

      {/*
        Always mounted and driven by CSS transitions. `visibility` steps to
        hidden only after the fade completes, so the closed drawer can never
        leave an invisible layer over the page or a trap in the tab order.
      */}
      <div
        id="mobile-menu"
        inert={!open}
        className={cn(
          "fixed inset-x-0 top-0 z-40 h-dvh overflow-y-auto overscroll-contain bg-ink/95 pt-20 backdrop-blur-xl transition-[opacity,transform,visibility] duration-300 ease-out sm:pt-24 lg:hidden",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-3 opacity-0 pointer-events-none"
        )}
      >
        <ul className="flex flex-col px-5 sm:px-8">
          {NAV_LINKS.map((link, i) => (
            <li
              key={link.href}
              className={cn(
                "transition-[opacity,transform] duration-300 ease-out",
                open ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
              )}
              style={{ transitionDelay: open ? `${60 + i * 45}ms` : "0ms" }}
            >
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between border-b border-line py-5 text-2xl font-bold transition-colors sm:text-3xl",
                  isActive(link.href) ? "text-ion" : "text-fg"
                )}
              >
                {link.label}
                <ArrowRight aria-hidden className="size-4 text-dim" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="px-5 py-8 sm:px-8">
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="flex min-h-13 w-full items-center justify-center gap-2 rounded-pill bg-fg text-base font-semibold text-ink"
          >
            Start a Project <ArrowRight aria-hidden className="size-4" />
          </Link>
          <div className="mt-8 space-y-2 text-sm text-mut">
            <a href={`mailto:${SITE.email}`} className="block hover:text-fg">
              {SITE.email}
            </a>
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="block hover:text-fg">
              {SITE.phone}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
