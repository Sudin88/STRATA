import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const PILLARS = ["AI", "Design", "Development", "Marketing", "Data"] as const;

export function About() {
  return (
    <section
      id="about"
      className="noise glow relative scroll-mt-24 overflow-hidden border-t border-line py-28 sm:py-40"
    >
      <div aria-hidden className="grid-bg absolute inset-0 opacity-50" />
      <Container className="relative">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="eyebrow mb-6">About Strata</p>
          <h2 className="text-display text-balance">
            Most agencies do one thing. We connect all of it.
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-mut sm:text-lg">
            Most agencies sell you one slice — SEO here, a website there, ads
            somewhere else. We do all five under one roof, so your strategy,
            creative, tech and data finally pull in the same direction instead
            of getting lost in handoffs between vendors.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-14 flex flex-wrap items-center justify-center gap-x-3 gap-y-4">
          {PILLARS.map((pillar, i) => (
            <span key={pillar} className="flex items-center gap-3">
              <span className="glass hairline rounded-pill px-5 py-2.5 text-sm font-semibold">
                {pillar}
              </span>
              {i < PILLARS.length - 1 && (
                <span aria-hidden className="text-dim">
                  +
                </span>
              )}
            </span>
          ))}
        </Reveal>

        <Reveal delay={0.25}>
          <p className="mt-12 text-center font-mono text-sm text-ion">
            AI is the engine. People do the steering.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
