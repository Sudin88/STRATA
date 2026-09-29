import { PageHero } from "@/components/page-hero";
import { Pricing } from "@/components/pricing";
import { Faq } from "@/components/faq";
import { Cta } from "@/components/cta";
import { FAQS } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { pageGraph, faqPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/json-ld";

const description =
  "Three engagement tiers — Starter, Growth and Scale — priced per scope. Tell us what you're building and we'll send a clear proposal.";

export const metadata = pageMetadata({
  title: "Plans & Pricing",
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
        description="Every engagement is quoted after we understand what you're building, so you pay for the work that moves your numbers — nothing else. Below is how the tiers differ."
      />
      <Pricing />
      <Faq />
      <Cta />
    </>
  );
}
