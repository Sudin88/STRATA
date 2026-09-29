import { PageHero } from "@/components/page-hero";
import { Services } from "@/components/services";
import { GrowthEngine } from "@/components/growth-engine";
import { AiDemo } from "@/components/ai-demo";
import { Cta } from "@/components/cta";
import { pageMetadata } from "@/lib/seo";
import { pageGraph, serviceCatalogSchema } from "@/lib/schema";
import { JsonLd } from "@/components/json-ld";

const title = "AI Marketing Services: SEO, Websites, Video & Ads";
const description =
  "Seven connected services: AI SEO and content, website design and development, AI ad videos, motion graphics, social media and paid advertising, with AI marketing automation coming soon.";

export const metadata = pageMetadata({
  title,
  description,
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: "/services",
          name: title,
          description,
          breadcrumb: "Services",
          extra: [serviceCatalogSchema()],
        })}
      />
      <PageHero
        breadcrumb="Services"
        eyebrow="Services"
        title="Seven services, one connected growth system."
        description="Most agencies sell you channels one at a time. We connect them, so your site, content, creative and campaigns work together instead of pulling in different directions."
      />
      <Services showHeading={false} />
      <GrowthEngine />
      <AiDemo />
      <Cta />
    </>
  );
}
