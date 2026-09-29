import { PageHero } from "@/components/page-hero";
import { About } from "@/components/about";
import { IntelligenceLayer } from "@/components/intelligence-layer";
import { Cta } from "@/components/cta";
import { pageMetadata } from "@/lib/seo";
import { pageGraph } from "@/lib/schema";
import { JsonLd } from "@/components/json-ld";

const title = "About: Built for the AI Era";
const description =
  "A small senior team building AI-powered marketing systems for ambitious businesses: strategy, creative, development and growth under one roof.";

export const metadata = pageMetadata({
  title,
  description,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: "/about",
          name: title,
          description,
          breadcrumb: "About",
          type: "AboutPage",
        })}
      />
      <PageHero
        breadcrumb="About"
        eyebrow="About"
        title="Built for the AI era, run by people."
        description="AI does the heavy lifting on research, drafting and reporting. Strategy, taste and accountability stay human. That combination is the whole point."
      />
      <About />
      <IntelligenceLayer />
      <Cta />
    </>
  );
}
