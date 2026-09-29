"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Service } from "@/lib/data";
import { ServiceIcon } from "@/components/service-icon";
import { useCollapse } from "@/hooks/use-collapse";
import { cn } from "@/lib/utils";

/**
 * Desktop: hover expands the card, glows the border and reveals features.
 * Mobile / keyboard: the card is an accordion toggled by the header button.
 * The panel animates a measured max-height so it never lingers in the DOM
 * as an invisible-but-interactive layer.
 */
export function ServiceCard({ service }: { service: Service }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();
  const { contentRef, height } = useCollapse();
  const expanded = open || hovered;
  const panelId = `service-panel-${service.id}`;

  return (
    <motion.article
      id={service.id}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={reduced ? undefined : { y: expanded ? -6 : 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "hairline group relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-card border bg-surface p-6 transition-colors duration-500 sm:p-8",
        expanded ? "border-ion/50" : "border-line"
      )}
    >
      {/* A thin accent rule slides in along the top edge on expansion. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left bg-ion transition-transform duration-500 ease-out",
          expanded ? "scale-x-100" : "scale-x-0"
        )}
      />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="relative flex w-full items-start justify-between gap-4 text-left"
      >
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span
              className={cn(
                "grid size-11 place-items-center rounded-xl border transition-all duration-500",
                expanded ? "rotate-6 border-ion/50 bg-ion-soft text-ion" : "border-line text-mut"
              )}
            >
              <ServiceIcon name={service.id} className="size-5" />
            </span>
            <span className="eyebrow">{service.index}</span>
          </div>
          <h3 className="text-lg font-bold tracking-tight sm:text-2xl">{service.title}</h3>
        </div>
        <ChevronDown
          aria-hidden
          className={cn(
            "mt-1 size-5 shrink-0 text-dim transition-transform duration-300 lg:hidden",
            open && "rotate-180"
          )}
        />
      </button>

      <p className="relative mt-3 text-sm leading-relaxed text-mut">{service.description}</p>

      <div
        id={panelId}
        style={{ maxHeight: expanded ? height : 0 }}
        className={cn(
          "relative overflow-hidden transition-[max-height,opacity] duration-400 ease-out",
          expanded ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Spacing lives as padding on the measured wrapper, not as a margin on
            the list: a top margin would collapse out of scrollHeight and leave
            the panel a row short (clipped features). */}
        <div ref={contentRef} className="pt-5">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
            {service.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-[13px] text-mut">
                <span className="size-1 shrink-0 rounded-full bg-ion" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Link
        href="/contact"
        className="relative mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-fg transition-colors hover:text-ion"
      >
        {service.cta}
        <ArrowUpRight
          aria-hidden
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>
    </motion.article>
  );
}
