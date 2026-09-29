import { PageHero } from "@/components/page-hero";
import { Process } from "@/components/process";
import { WhyAI } from "@/components/why-ai";
import { Cta } from "@/components/cta";
import { pageMetadata } from "@/lib/seo";
import { pageGraph } from "@/lib/schema";
import { JsonLd } from "@/components/json-ld";

const title = "Our Process: Discover, Strategize, Create, Launch, Optimize";
const description =
  "A five-step process for building AI-powered growth systems: discover, strategize, create, launch and continuously optimize with data.";

export const metadata = pageMetadata({
  title,
  description,
  path: "/process",
});

export default function ProcessPage() {
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: "/process",
          name: title,
          description,
          breadcrumb: "Process",
        })}
      />
      <PageHero
        breadcrumb="Process"
        eyebrow="Process"
        title="A clear path from first call to steady growth."
        description="No black boxes. You always know which step we're on, what's being built, and what the data says about whether it's working."
      />
      <Process />
      <WhyAI />
      <Cta />
    </>
  );
}
