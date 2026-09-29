"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

const TRADITIONAL = ["Slow", "Manual", "Expensive", "Disconnected", "Hard to scale"];
const AI_POWERED = ["Faster", "Data-driven", "Automated", "Personalized", "Scalable"];

/** Animated packet stream between the two panels. */
function FlowBridge() {
  const reduced = useReducedMotion();
  return (
    <div
      aria-hidden
      className="relative mx-auto flex h-16 w-full max-w-45 items-center justify-center lg:h-auto lg:w-40"
    >
      <div className="h-px w-full bg-linear-to-r from-line-strong via-ion to-line-strong max-lg:rotate-90 max-lg:w-16 lg:h-px" />
      {!reduced &&
        [0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute size-1.5 rounded-full bg-ion max-lg:hidden"
            initial={{ left: "0%", opacity: 0 }}
            animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.2, delay: i * 0.7, repeat: Infinity, ease: "linear" }}
          />
        ))}
      <span className="glass hairline absolute grid size-10 place-items-center rounded-full text-ion max-lg:rotate-90">
        <MoveRight className="size-4" />
      </span>
    </div>
  );
}

export function WhyAI() {
  return (
    <section id="solutions" className="scroll-mt-24 border-t border-line bg-raise/60 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Why AI"
          title="Marketing has changed."
          subtitle="The playbook from five years ago is now the slowest, priciest way to grow. AI changes the math on every channel."
          align="center"
        />

        <div className="mx-auto grid max-w-4xl items-stretch gap-2 lg:grid-cols-[1fr_auto_1fr] lg:gap-0">
          <Reveal>
            <div className="hairline h-full rounded-card border border-line bg-surface p-7 sm:p-9">
              <p className="eyebrow mb-6">Manual</p>
              <h3 className="mb-6 text-xl font-bold text-mut">Traditional marketing</h3>
              <ul className="space-y-3.5">
                {TRADITIONAL.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-mut">
                    <span className="h-px w-4 bg-dim" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <FlowBridge />

          <Reveal delay={0.15}>
            <div className="hairline relative h-full overflow-hidden rounded-card border border-ion/40 bg-surface p-7 sm:p-9">
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-ion" />
              <p className="eyebrow mb-6 text-ion">Intelligent</p>
              <h3 className="mb-6 text-xl font-bold">AI-powered marketing</h3>
              <ul className="space-y-3.5">
                {AI_POWERED.map((item, i) => (
                  <motion.li
                    key={item}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: 14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.45 }}
                  >
                    <span className="size-1.5 rounded-full bg-ion" aria-hidden />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
