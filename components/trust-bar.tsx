import { Container } from "@/components/ui/container";

/**
 * Sectors we build for — not a client list. We're a new agency, so instead of
 * borrowed logos this marquee shows the kinds of businesses our systems are
 * built for. The list is duplicated so the CSS keyframe (translateX -50%)
 * loops seamlessly.
 */
const SECTORS = [
  "SaaS",
  "E-commerce",
  "Local Business",
  "Hospitality",
  "Real Estate",
  "Healthcare",
  "Fintech",
  "Education",
  "Startups",
] as const;

export function TrustBar() {
  return (
    <section aria-label="Sectors we build for" className="border-y border-line py-10">
      <Container>
        <p className="eyebrow mb-8 text-center">
          Built for businesses like these
        </p>
      </Container>
      <div
        className="relative overflow-hidden"
        style={{
          maskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee gap-14 pr-14 motion-reduce:animate-none">
          {[...SECTORS, ...SECTORS].map((sector, i) => (
            <span
              key={`${sector}-${i}`}
              aria-hidden={i >= SECTORS.length}
              className="font-mono text-sm font-medium tracking-[0.25em] whitespace-nowrap text-dim uppercase"
            >
              {sector}
            </span>
          ))}
        </div>
      </div>
      <Container>
        <p className="mt-6 text-center text-xs text-dim">
          These are the sectors we build for. Yours could be the first name up here.
        </p>
      </Container>
    </section>
  );
}
