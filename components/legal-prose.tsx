import { Container } from "@/components/ui/container";

/**
 * Shared reading layout for legal pages (privacy, terms). Keeps the two pages
 * visually identical and constrains line length for readability. Content is
 * passed as children so each page owns its own copy.
 */
export function LegalProse({
  lastUpdated,
  children,
}: {
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow mb-10 text-dim">Last updated · {lastUpdated}</p>
          <div className="space-y-10">{children}</div>
        </div>
      </Container>
    </section>
  );
}

/** One titled block of legal copy. */
export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-bold sm:text-2xl">{heading}</h2>
      <div className="mt-4 space-y-4 leading-relaxed text-mut [&_a]:text-ion [&_a]:underline [&_a]:underline-offset-2 [&_li]:ml-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
