"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { PROCESS_STEPS } from "@/lib/data";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Scroll-driven timeline: the spine fills as the user scrolls through the
 * section, and each step lights up as it enters the viewport.
 */
export function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.6"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section id="process" className="scroll-mt-24 border-t border-line bg-raise/60 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Process"
          title="From idea to growth."
          subtitle="Five steps, in this order — and the last one loops back to the start, because good marketing never really finishes."
        />

        <ol ref={ref} className="relative mx-auto max-w-3xl">
          {/* Spine + animated fill */}
          <div aria-hidden className="absolute top-2 bottom-2 left-[27px] w-px bg-line-strong" />
          <motion.div
            aria-hidden
            className="absolute top-2 left-[27px] w-px origin-top bg-ion"
            style={{ scaleY: reduced ? 1 : progress, height: "calc(100% - 16px)" }}
          />

          {PROCESS_STEPS.map((step, i) => (
            <motion.li
              key={step.index}
              className="relative flex gap-6 pb-12 pl-0 last:pb-0 sm:gap-8"
              initial={reduced ? false : { opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="glass hairline relative z-10 grid size-14 shrink-0 place-items-center rounded-full font-mono text-sm text-ion">
                {step.index}
              </span>
              <div className="pt-2">
                <h3 className="text-xl font-bold sm:text-2xl">{step.title}</h3>
                <p className="mt-2 max-w-md leading-relaxed text-mut">{step.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
