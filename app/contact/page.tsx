import { PageHero } from "@/components/page-hero";
import { Contact } from "@/components/contact";
import { Faq } from "@/components/faq";
import { FAQS } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { pageGraph, faqPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/json-ld";

const description =
  "Tell us what you're building. Send a project inquiry and we'll show you where AI can create your biggest marketing advantage.";

export const metadata = pageMetadata({
  title: "Contact — Start a Project",
  description,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: "/contact",
          name: "Contact — Start a Project",
          description,
          breadcrumb: "Contact",
          type: "ContactPage",
          // Match the 5 FAQs actually rendered below (Faq limit={5}).
          extra: [faqPageSchema(FAQS.slice(0, 5))],
        })}
      />
      <PageHero
        breadcrumb="Contact"
        eyebrow="Contact"
        title="Tell us what you're building."
        description="Share a few details and we'll come back with where AI can create your biggest advantage — plus a clear scope and timeline. No obligation."
      />
      <Contact />
      <Faq limit={5} />
    </>
  );
}
