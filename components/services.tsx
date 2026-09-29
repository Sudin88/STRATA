import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/data";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ServiceCard } from "@/components/service-card";

interface ServicesProps {
  /** Render only the first N services (home page preview). */
  limit?: number;
  /** Hidden when the surrounding page already carries the heading. */
  showHeading?: boolean;
  viewAll?: { label: string; href: string };
}

export function Services({ limit, showHeading = true, viewAll }: ServicesProps) {
  const services = limit ? SERVICES.slice(0, limit) : SERVICES;

  return (
    <section id="services" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        {showHeading ? (
          <SectionHeading
            eyebrow="Services"
            title="Everything you need to grow."
            subtitle="Strategy, creative, tech and AI, joined up into one system instead of scattered across vendors."
          />
        ) : (
          /* The page hero above owns the visible heading, but the cards are h3 —
             without a level 2 between them the outline skips a level. */
          <h2 className="sr-only">All seven services</h2>
        )}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={Math.min(i * 0.08, 0.32)} className="h-full">
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>

        {viewAll && (
          <Reveal className="mt-12 flex justify-center">
            <Link
              href={viewAll.href}
              className="group inline-flex min-h-12 items-center gap-2 rounded-pill border border-line-strong px-6 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-ion/60 hover:bg-ion-soft"
            >
              {viewAll.label}
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
