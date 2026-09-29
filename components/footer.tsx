"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE, NAV_LINKS, SERVICES } from "@/lib/data";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";

/** Service links deep-link to the matching card on the services page. */
const SERVICE_LINKS = SERVICES.map((s) => ({
  label: s.title,
  href: `/services#${s.id}`,
}));

const RESOURCE_LINKS = [
  { label: "Our Process", href: "/process" },
  { label: "Share Feedback", href: "/feedback" },
  { label: "Plans & Pricing", href: "/pricing" },
  { label: "FAQ", href: "/pricing#faq" },
] as const;

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="eyebrow mb-5">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="link-sweep text-sm text-mut transition-colors hover:text-fg"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  // The dashboard is a bare authenticated surface — no marketing chrome.
  if (pathname.startsWith("/dashboard")) return null;

  return (
    <footer className="border-t border-line bg-ink">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-mut">{SITE.tagline}</p>
            <Link
              href="/contact"
              className="mt-7 inline-flex min-h-11 items-center rounded-pill border border-line-strong px-5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-ion/60 hover:bg-ion-soft"
            >
              Start a Project
            </Link>
          </div>

          <FooterColumn title="Company" links={NAV_LINKS} />
          <FooterColumn title="Services" links={SERVICE_LINKS} />
          <FooterColumn title="Resources" links={RESOURCE_LINKS} />

          <div>
            <h3 className="eyebrow mb-5">Contact</h3>
            <ul className="space-y-3 text-sm text-mut">
              <li>
                <a href={`mailto:${SITE.email}`} className="link-sweep hover:text-fg">
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="link-sweep hover:text-fg"
                >
                  {SITE.phone}
                </a>
              </li>
              <li>{SITE.location}</li>
            </ul>

            <h3 className="eyebrow mt-8 mb-5">Social</h3>
            <ul className="space-y-3 text-sm">
              {SITE.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-sweep text-mut transition-colors hover:text-fg"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-dim">
            © {year} {SITE.name}. A new agency finding its feet.
          </p>
          <nav aria-label="Legal" className="flex items-center gap-5 text-xs text-dim">
            <Link href="/privacy" className="link-sweep transition-colors hover:text-fg">
              Privacy
            </Link>
            <Link href="/terms" className="link-sweep transition-colors hover:text-fg">
              Terms
            </Link>
            <span>Built with Next.js.</span>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
