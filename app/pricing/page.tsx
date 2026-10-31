import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Pricing } from "@/components/pricing";
import { Faq } from "@/components/faq";
import { Cta } from "@/components/cta";
import { FAQS } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { pageGraph, faqPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/json-ld";
import { Container } from "@/components/ui/container";

const description =
  "Three engagement tiers (Starter, Growth and Scale) priced per scope. Tell us what you're building and we'll send a clear proposal.";

export const metadata = pageMetadata({
  title: "Marketing Agency Pricing: Starter, Growth & Scale Plans",
  description,
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: "/pricing",
          name: "Plans & Pricing",
          description,
          breadcrumb: "Pricing",
          // The pricing page renders every FAQ (<Faq /> with no limit).
          extra: [faqPageSchema(FAQS)],
        })}
      />
      <PageHero
        breadcrumb="Pricing"
        eyebrow="Plans"
        title="Scoped to your goals, not a price list."
        description="Every engagement is quoted after we understand what you're building, so you pay for the work that moves your numbers, nothing else. Below is how the tiers differ."
      />
      <Pricing />
      <Container>
        <p className="mx-auto max-w-[720px] pb-4 text-center text-sm leading-relaxed text-mut">
          Deciding the kind of agency you want first? We&apos;ve taken a
          position in plain terms:{" "}
          <Link
            href="/compare/ai-marketing-agency-vs-traditional-agency"
            className="text-fg underline decoration-ion underline-offset-4 transition-colors hover:text-ion"
          >
            AI marketing agency vs traditional — what actually differs
          </Link>
          , and where each model is the right buy.
        </p>
      </Container>
      <Faq />
      <Cta />
    </>
  );
}
