import { Check } from "lucide-react";
import Link from "next/link";
import { PRICING } from "@/lib/data";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 border-t border-line bg-raise/60 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Plans"
          title="Pick where you want to start."
          subtitle="We scope every engagement around your goals, so think of these as starting points, not ceilings."
          align="center"
        />

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
          {PRICING.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.1}>
              <article
                className={cn(
                  "relative flex h-full flex-col rounded-card border p-7 transition-all duration-500 hover:-translate-y-1.5 sm:p-8",
                  tier.highlighted
                    ? "hairline-lift border-ion bg-surface"
                    : "hairline border-line bg-surface hover:border-line-strong"
                )}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-pill bg-ion px-4 py-1 text-[11px] font-bold tracking-wider text-ink uppercase">
                    Recommended
                  </span>
                )}

                <h3 className="text-2xl font-extrabold">{tier.name}</h3>
                <p className="mt-1 text-sm text-mut">{tier.audience}</p>
                <p className="mt-6 font-mono text-lg text-fg">{tier.price}</p>
                <p className="mt-1 text-xs text-dim">Scoped after a strategy call</p>

                <ul className="mt-7 flex-1 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-mut">
                      <Check className="mt-0.5 size-4 shrink-0 text-ion" aria-hidden />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={cn(
                    "mt-8 inline-flex min-h-12 items-center justify-center rounded-pill px-6 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5",
                    tier.highlighted
                      ? "bg-fg text-ink hover:shadow-[0_10px_24px_-10px_rgba(18,19,20,0.32)]"
                      : "border border-line-strong hover:border-ion/60 hover:bg-ion-soft"
                  )}
                >
                  {tier.cta}
                </Link>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-dim">
            What shapes your quote: how many channels you want live, how much is
            one-time build versus ongoing work, and how fast you want to move.
            Tell us on a quick call and we&apos;ll send a clear, itemized proposal.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
