import { AetherFlowHero } from "@/components/ui/aether-flow-hero";

/** Capability keywords surfaced in the hero rail. */
const KEYWORDS = ["SEO", "AI ADS", "LEADS", "CONVERSIONS", "GROWTH"] as const;

/**
 * Honest capability/commitment facts — NOT client results. As a new agency we
 * have no audited outcome numbers to show, so this rail states what we offer and
 * commit to, never performance we haven't earned. Keep it that way until real,
 * consented client results exist.
 */
const METRICS = [
  { value: "6", label: "Growth services" },
  { value: "1-day", label: "Reply time" },
  { value: "24/7", label: "AI automation" },
  { value: "AI-native", label: "By design" },
] as const;

export function Hero() {
  return (
    <AetherFlowHero
      badge="New agency · senior team"
      title="Marketing that actually moves your"
      highlight="numbers."
      description="Websites, content, ads, and the systems that tie them together — built with AI so you get more done for less, and run by people who sweat the details."
      primaryCta={{ label: "Start Growing", href: "/contact" }}
      secondaryCta={{ label: "Explore Services", href: "/services" }}
      keywords={KEYWORDS}
      metrics={METRICS}
    />
  );
}
