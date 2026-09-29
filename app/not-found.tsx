import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ParticleField } from "@/components/ui/particle-field";
import { NAV_LINKS } from "@/lib/data";

export const metadata = {
  title: "Page not found | Strata",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="glow relative flex min-h-[80svh] items-center overflow-hidden pt-32 pb-20">
      <div aria-hidden className="grid-bg absolute inset-0 opacity-50" />
      <div aria-hidden className="field-fade absolute inset-0">
        <ParticleField density={22000} maxParticles={44} />
      </div>

      <Container className="relative text-center">
        <p className="eyebrow mb-5 text-ion">Error 404</p>
        <h1 className="text-heading text-balance">This page doesn&apos;t exist.</h1>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-mut">
          The link may be out of date. Here&apos;s the way back, or jump straight
          to any section of the site.
        </p>
        <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <Button href="/" className="w-full sm:w-auto">
            Back to home
          </Button>
          <Button href="/contact" variant="ghost" className="w-full sm:w-auto">
            Contact us
          </Button>
        </div>

        <ul className="mx-auto mt-12 flex max-w-lg flex-wrap items-center justify-center gap-x-3 gap-y-2">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="eyebrow rounded-pill border border-line px-3 py-1.5 text-mut transition-colors hover:border-ion/50 hover:text-fg"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
