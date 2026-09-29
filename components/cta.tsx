import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SITE } from "@/lib/data";

/**
 * Closing CTA. The one inverted block on the site — a near-black panel on
 * paper. Drama comes from the contrast reversal, not from a glow or a
 * particle field, which is what the rest of the page deliberately avoids.
 */
export function Cta() {
  return (
    <section className="border-t border-line bg-ink px-5 py-16 sm:px-8 sm:py-24">
      <Container className="px-0 sm:px-0">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] bg-fg px-6 py-20 text-center sm:px-12 sm:py-28">
            {/* `invert` flips the grid's ink lines to light ones; alpha survives
                the filter, so the 4.5% rule reads the same, just reversed. */}
            <div aria-hidden className="grid-bg absolute inset-0 invert" />

            <div className="relative mx-auto max-w-2xl">
              <p className="eyebrow mb-6 text-ink/55">Ready when you are</p>
              <h2 className="text-display text-balance text-ink">
                Ready to build your growth engine?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
                Tell us what you&apos;re working on. We&apos;ll show you exactly
                where AI can give you the biggest edge. No fluff, no obligation.
              </p>

              <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
                <Button href="/contact" variant="inverse">
                  Start a Project
                </Button>
                <Button href="/contact" variant="inverse-ghost">
                  Book a Strategy Call
                </Button>
              </div>

              <p className="mt-8 font-mono text-xs tracking-wider text-ink/60">
                {SITE.email}
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
