"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { NetworkVisual } from "@/components/3d/network-visual";

const PRINCIPLES = [
  {
    title: "One system, not five vendors",
    body: "Search, content, creative and campaigns all run off the same strategy and the same data, so every channel makes the next one cheaper and easier.",
  },
  {
    title: "AI on the volume, humans on the judgment",
    body: "AI takes the volume work: research, drafts, variations, reporting. The judgment calls (positioning, taste, knowing when to pull the plug on something) stay with people.",
  },
  {
    title: "Measured, not asserted",
    body: "We agree on the numbers that matter before we start, then report against them every month, including the experiments that flopped. No cherry-picking.",
  },
] as const;

/**
 * The connected-system narrative, anchored by the interactive 3D
 * constellation (static SVG on narrow screens and without WebGL).
 */
export function IntelligenceLayer() {
  const reduced = useReducedMotion();

  return (
    <section className="noise relative overflow-hidden border-t border-line py-24 sm:py-32">
      <div aria-hidden className="glow pointer-events-none absolute inset-0" />

      <Container className="relative">
        <SectionHeading
          eyebrow="How we think"
          title="Marketing works better when it all talks to each other."
          subtitle="Run channels in separate silos and they stall out. Wire them together (with AI handling the grunt work) and each cycle makes the next one smarter."
        />

        <div className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,0.9fr)] lg:gap-16">
          <ul className="min-w-0 space-y-8">
            {PRINCIPLES.map((p, i) => (
              <motion.li
                key={p.title}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="border-l border-line pl-6"
              >
                <div className="mb-2 flex items-center gap-3">
                  <span className="eyebrow text-ion">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-lg font-bold tracking-tight">{p.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-mut">{p.body}</p>
              </motion.li>
            ))}
          </ul>

          <div className="relative mx-auto w-full max-w-125 min-w-0">
            <NetworkVisual />
          </div>
        </div>
      </Container>
    </section>
  );
}
