"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

const NODES = [
  "Strategy",
  "Content",
  "Website",
  "Advertising",
  "Data",
  "Optimization",
  "Growth",
] as const;

/**
 * The agency's operating system rendered as a connected pipeline.
 * Desktop: horizontal rail with a traveling data pulse.
 * Mobile: vertical rail, same node chain stacked.
 */
export function GrowthEngine() {
  const reduced = useReducedMotion();

  return (
    <section className="noise relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="glow pointer-events-none absolute inset-0" />
      <Container className="relative">
        <SectionHeading
          eyebrow="The system"
          title="One engine, every part feeding the next."
          subtitle="Each service feeds the next. What we learn from your campaigns sharpens your content; better content lifts your SEO; and the whole thing gets smarter every time around."
          align="center"
        />

        <Reveal className="hairline relative mx-auto max-w-5xl rounded-card border border-line bg-surface p-6 sm:p-10">
          {/* Rail — horizontal ≥lg, vertical below */}
          <div className="relative flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
            <div
              aria-hidden
              className="absolute top-0 left-[27px] h-full w-px bg-line-strong lg:top-7 lg:left-0 lg:h-px lg:w-full"
            />
            {/* Traveling pulse on the desktop rail. Pinned to the circle centre
                (size-14 → 28px = top-7), not the node midpoint — the node also
                contains the label below the circle, so top-1/2 would drop the
                pulse and rail down onto the labels. */}
            {!reduced && (
              <motion.span
                aria-hidden
                className="absolute top-7 hidden size-2 -translate-y-1/2 rounded-full bg-ion lg:block"
                initial={{ left: "0%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            {NODES.map((node, i) => (
              <motion.div
                key={node}
                className="relative flex items-center gap-4 lg:flex-col lg:gap-3"
                initial={reduced ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <span
                  className={
                    "glass hairline relative z-10 grid size-14 shrink-0 place-items-center rounded-full font-mono text-xs " +
                    (i === NODES.length - 1
                      ? "border-ion/60 bg-ion-soft text-ion"
                      : "text-mut")
                  }
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={
                    "text-sm font-semibold lg:text-[13px] " +
                    (i === NODES.length - 1 ? "text-ion" : "text-fg")
                  }
                >
                  {node}
                </span>
              </motion.div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-mut">
            It works both ways — real performance data keeps re-tuning the
            strategy, the creative and where the money goes.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
