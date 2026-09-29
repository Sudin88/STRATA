"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { FAQS } from "@/lib/data";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { useCollapse } from "@/hooks/use-collapse";
import { cn } from "@/lib/utils";

/**
 * Accordion row. The panel animates a measured max-height, so it is never
 * left mounted-but-hidden over the content beneath it.
 */
function FaqItem({
  q,
  a,
  open,
  onToggle,
  id,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
  id: string;
}) {
  const { contentRef, height } = useCollapse();

  return (
    <div
      className={cn(
        "rounded-2xl border transition-colors duration-300",
        open ? "border-ion/40 bg-surface" : "border-line"
      )}
    >
      <h3>
        <button
          type="button"
          id={`${id}-trigger`}
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={id}
          className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-[15px] font-semibold sm:px-6 sm:text-base"
        >
          {q}
          <Plus
            aria-hidden
            className={cn(
              "size-5 shrink-0 text-dim transition-transform duration-300",
              open && "rotate-45 text-ion"
            )}
          />
        </button>
      </h3>
      <div
        id={id}
        role="region"
        aria-labelledby={`${id}-trigger`}
        style={{ maxHeight: open ? height : 0 }}
        className={cn(
          "overflow-hidden transition-[max-height,opacity] duration-350 ease-out",
          open ? "opacity-100" : "opacity-0"
        )}
      >
        <p
          ref={contentRef}
          className="px-5 pb-6 text-sm leading-relaxed text-mut sm:px-6"
        >
          {a}
        </p>
      </div>
    </div>
  );
}

export function Faq({ limit }: { limit?: number }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = limit ? FAQS.slice(0, limit) : FAQS;

  return (
    <section id="faq" className="scroll-mt-24 border-t border-line py-24 sm:py-32">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <SectionHeading
            eyebrow="FAQ"
            title="Answers before you ask."
            subtitle="Everything most clients want to know before a first call. Anything else — just ask."
            className="mb-0"
          />
          <Reveal className="space-y-3">
            {faqs.map((faq, i) => (
              <FaqItem
                key={faq.q}
                q={faq.q}
                a={faq.a}
                id={`faq-panel-${i}`}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
