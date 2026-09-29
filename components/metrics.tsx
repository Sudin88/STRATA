import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

/*
 * Operating standards and capabilities — how we work, not client results.
 * We're a new agency, so there are no engagement metrics to show yet; these
 * describe the way every project is run. Labeled honestly below the row.
 */
const METRICS = [
  { label: "Disciplines", value: 6, suffix: "", detail: "services under one roof" },
  { label: "Creative", value: 40, suffix: "+", detail: "ad variants per campaign" },
  { label: "Performance", value: 95, suffix: "+", detail: "target Lighthouse score" },
  { label: "Automation", value: 24, suffix: "/7", detail: "systems always on" },
  { label: "Optimization", value: 2, suffix: "wk", detail: "test-and-learn cycles" },
] as const;

export function Metrics() {
  return (
    <section className="border-y border-line bg-raise/60 py-16 sm:py-20">
      <Container>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {METRICS.map((metric, i) => (
            <Reveal key={metric.label} delay={i * 0.08} className="text-center">
              <p className="eyebrow mb-3">{metric.label}</p>
              <p className="font-mono text-4xl font-medium text-fg sm:text-5xl">
                <AnimatedCounter value={metric.value} suffix={metric.suffix} />
              </p>
              <p className="mt-2 text-xs text-dim">{metric.detail}</p>
            </Reveal>
          ))}
        </div>
        <p className="mt-10 text-center font-mono text-[10px] tracking-widest text-dim uppercase">
          How we work, not client results. We report your real numbers once we start working together
        </p>
      </Container>
    </section>
  );
}
