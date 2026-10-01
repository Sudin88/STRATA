import { Container } from "@/components/ui/container";

/**
 * Reading layout for blog articles. Mirrors LegalProse's approach — a single
 * constrained column with styling applied via descendant selectors — so post
 * bodies can be written as plain semantic HTML (h2, h3, p, ul, table…) with no
 * per-element class noise. Keeps every article visually consistent.
 */
export function ArticleProse({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div
          className={[
            "mx-auto max-w-[720px] text-base leading-relaxed text-mut sm:text-[17px]",
            // Headings
            "[&_h2]:mt-14 [&_h2]:mb-5 [&_h2]:scroll-mt-28 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-fg sm:[&_h2]:text-3xl",
            "[&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-fg sm:[&_h3]:text-xl",
            // Body copy
            "[&_p]:mt-5 [&_p]:first:mt-0",
            "[&_strong]:font-semibold [&_strong]:text-fg",
            "[&_a]:text-ion [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-fg",
            // Lists
            "[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5",
            "[&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5",
            "[&_li]:ml-1 [&_li_strong]:text-fg",
            // Tables
            "[&_table]:mt-7 [&_table]:w-full [&_table]:border-collapse [&_table]:text-left [&_table]:text-sm",
            "[&_th]:border [&_th]:border-line [&_th]:px-4 [&_th]:py-3 [&_th]:font-semibold [&_th]:text-fg",
            "[&_td]:border [&_td]:border-line [&_td]:px-4 [&_td]:py-3 [&_td]:align-top",
            // Rules
            "[&_hr]:my-12 [&_hr]:border-line",
          ].join(" ")}
        >
          {children}
        </div>
      </Container>
    </section>
  );
}
