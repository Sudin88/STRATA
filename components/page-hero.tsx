import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ParticleField } from "@/components/ui/particle-field";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  /** Breadcrumb label for the current page; the trail always starts at Home. */
  breadcrumb: string;
}

/**
 * Compact hero for interior pages. Shares the particle treatment with the
 * home hero at a lower density so it reads as a quieter variation.
 */
export function PageHero({ eyebrow, title, description, breadcrumb }: PageHeroProps) {
  return (
    <section className="glow relative overflow-hidden border-b border-line pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div aria-hidden className="grid-bg absolute inset-0 opacity-50" />
      <div aria-hidden className="field-fade absolute inset-0">
        <ParticleField density={20000} maxParticles={52} linkDistance={118} />
      </div>

      <Container className="relative">
        <nav aria-label="Breadcrumb" className="mb-7">
          <ol className="flex items-center gap-1.5 font-mono text-[11px] tracking-widest text-dim uppercase">
            <li>
              <Link href="/" className="transition-colors hover:text-fg">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3" />
            </li>
            <li aria-current="page" className="text-mut">
              {breadcrumb}
            </li>
          </ol>
        </nav>

        <p className="eyebrow mb-4 text-ion">{eyebrow}</p>
        <h1 className="text-heading max-w-3xl text-balance">{title}</h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-mut sm:text-lg">
          {description}
        </p>
      </Container>
    </section>
  );
}
