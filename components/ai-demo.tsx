"use client";

import { useState } from "react";
import { Sparkles, RotateCcw } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

/* Pre-written demo output — a frontend illustration, not a live AI call. */
const DEMO_INPUT = {
  business: "Premium Kathmandu Coffee Shop",
  goal: "Get more local customers",
};

const DEMO_OUTPUT = [
  { label: "Headline", value: "Your new favorite coffee spot is closer than you think." },
  { label: "SEO title", value: "Best Specialty Coffee in Kathmandu" },
  { label: "Social caption", value: "Slow mornings. Better coffee. Find your new favorite cup." },
  { label: "Ad concept", value: "15-second cinematic coffee shop video." },
] as const;

type Phase = "idle" | "generating" | "done";

export function AiDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const reduced = useReducedMotion();

  function generate() {
    if (phase !== "idle") return;
    if (reduced) {
      setPhase("done");
      return;
    }
    setPhase("generating");
    window.setTimeout(() => setPhase("done"), 1400);
  }

  return (
    <section className="border-t border-line py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Interactive demo"
          title="See what AI can create."
          subtitle="A quick, scripted taste of how a plain brief turns into creative direction. The real thing goes a lot deeper. This is just the idea."
          align="center"
        />

        <Reveal className="hairline mx-auto max-w-3xl overflow-hidden rounded-card border border-line bg-surface">
          {/* Brief */}
          <div className="border-b border-line p-6 sm:p-8">
            <p className="eyebrow mb-5">Campaign brief</p>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-surface p-4">
                <dt className="mb-1 text-xs text-dim">Business</dt>
                <dd className="text-sm font-semibold">{DEMO_INPUT.business}</dd>
              </div>
              <div className="rounded-2xl border border-line bg-surface p-4">
                <dt className="mb-1 text-xs text-dim">Goal</dt>
                <dd className="text-sm font-semibold">{DEMO_INPUT.goal}</dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={generate}
                disabled={phase !== "idle"}
                className="inline-flex min-h-12 items-center gap-2 rounded-pill bg-fg px-6 py-3 text-sm font-semibold text-ink transition-all duration-300 enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_10px_24px_-10px_rgba(18,19,20,0.32)] disabled:opacity-60"
              >
                <Sparkles className="size-4" aria-hidden />
                {phase === "generating" ? "Generating…" : "Generate Campaign"}
              </button>
              {phase === "done" && (
                <button
                  type="button"
                  onClick={() => setPhase("idle")}
                  className="inline-flex items-center gap-1.5 text-sm text-mut transition-colors hover:text-fg"
                >
                  <RotateCcw className="size-3.5" aria-hidden /> Reset
                </button>
              )}
            </div>
          </div>

          {/* Output */}
          <div className="min-h-40 p-6 sm:p-8" aria-live="polite">
            <AnimatePresence mode="wait">
              {phase === "idle" && (
                <motion.p
                  key="idle"
                  exit={{ opacity: 0 }}
                  className="grid h-full min-h-24 place-items-center text-sm text-dim"
                >
                  Hit generate to see what comes out.
                </motion.p>
              )}

              {phase === "generating" && (
                <motion.div
                  key="gen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                  aria-hidden
                >
                  {[80, 60, 72, 44].map((w, i) => (
                    <div
                      key={i}
                      className="h-4 animate-pulse-soft rounded bg-raise"
                      style={{ width: `${w}%`, animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </motion.div>
              )}

              {phase === "done" && (
                <motion.dl key="done" className="grid gap-3 sm:grid-cols-2">
                  {DEMO_OUTPUT.map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={reduced ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.12, duration: 0.45 }}
                      className="rounded-2xl border border-ion/30 bg-ion-soft p-4"
                    >
                      <dt className="eyebrow mb-1.5 text-ion">{item.label}</dt>
                      <dd className="text-sm leading-relaxed">{item.value}</dd>
                    </motion.div>
                  ))}
                </motion.dl>
              )}
            </AnimatePresence>
          </div>

          <p className="border-t border-line px-6 py-3 font-mono text-[10px] tracking-widest text-dim uppercase">
            Frontend demonstration with scripted output, not a live AI call
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
