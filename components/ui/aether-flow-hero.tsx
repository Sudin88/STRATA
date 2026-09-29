"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Zap } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ParticleField } from "@/components/ui/particle-field";

interface Metric {
  value: string;
  label: string;
}

interface AetherFlowHeroProps {
  badge?: string;
  /** Headline text. `highlight` is appended in the flat accent colour. */
  title: string;
  highlight?: string;
  description: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Capability keywords rendered as a rail under the CTAs. */
  keywords?: readonly string[];
  /**
   * A short rail of honest capability/commitment facts (services offered,
   * reply-time commitment, etc.) — never client results we haven't earned.
   */
  metrics?: readonly Metric[];
}

/**
 * Full-bleed hero over an interactive particle constellation.
 * Content is fully prop-driven so the same treatment can front any page.
 */
export function AetherFlowHero({
  badge,
  title,
  highlight,
  description,
  primaryCta,
  secondaryCta,
  keywords,
  metrics,
}: AetherFlowHeroProps) {
  const reduced = useReducedMotion();

  const fadeUp = (i: number) => ({
    initial: reduced ? false : ({ opacity: 0, y: 22 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { delay: reduced ? 0 : i * 0.11 + 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="glow relative flex min-h-[92svh] items-center overflow-hidden pt-32 pb-16 sm:pt-36 sm:pb-20">
      {/* Layer 1: engineering grid, Layer 2: live particle web */}
      <div aria-hidden className="grid-bg absolute inset-0 opacity-70" />
      <div aria-hidden className="field-fade absolute inset-0">
        <ParticleField />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-ink"
      />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          {badge && (
            <motion.div
              {...fadeUp(0)}
              className="glass mb-7 inline-flex items-center gap-2 rounded-pill px-4 py-1.5"
            >
              <Zap aria-hidden className="size-3.5 shrink-0 text-ion" />
              <span className="text-xs font-medium tracking-wide text-fg sm:text-sm">
                {badge}
              </span>
            </motion.div>
          )}

          <motion.h1
            {...fadeUp(1)}
            className="text-display text-balance text-fg"
          >
            {title}
            {highlight && <> <span className="text-ion">{highlight}</span></>}
          </motion.h1>

          <motion.p
            {...fadeUp(2)}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-mut sm:text-lg"
          >
            {description}
          </motion.p>

          {(primaryCta || secondaryCta) && (
            <motion.div
              {...fadeUp(3)}
              className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4"
            >
              {primaryCta && (
                <Button href={primaryCta.href} className="w-full sm:w-auto">
                  {primaryCta.label}
                </Button>
              )}
              {secondaryCta && (
                <Button href={secondaryCta.href} variant="ghost" className="w-full sm:w-auto">
                  {secondaryCta.label}
                </Button>
              )}
            </motion.div>
          )}

          {keywords && keywords.length > 0 && (
            <motion.ul
              {...fadeUp(4)}
              className="mt-11 flex flex-wrap items-center justify-center gap-x-3 gap-y-2"
            >
              {keywords.map((word) => (
                <li
                  key={word}
                  className="eyebrow rounded-pill border border-line bg-surface px-3 py-1.5 text-mut"
                >
                  {word}
                </li>
              ))}
            </motion.ul>
          )}
        </div>

        {metrics && metrics.length > 0 && (
          <motion.div {...fadeUp(5)} className="mx-auto mt-14 max-w-3xl">
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {metrics.map((m) => (
                /* `flex-col-reverse` puts the value on top visually while
                   keeping dt before dd in the DOM — an sr-only dt plus a
                   visible label span would announce the label twice. */
                <div
                  key={m.label}
                  className="hairline flex flex-col-reverse rounded-2xl border border-line bg-surface px-4 py-4 text-center"
                >
                  <dt className="mt-1 text-xs text-mut">{m.label}</dt>
                  <dd className="font-mono text-xl font-medium text-fg sm:text-2xl">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
