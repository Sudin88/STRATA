import { PageHero } from "@/components/page-hero";
import { Work } from "@/components/work";
import { Metrics } from "@/components/metrics";
import { Cta } from "@/components/cta";
import { pageMetadata } from "@/lib/seo";
import { pageGraph } from "@/lib/schema";
import { JsonLd } from "@/components/json-ld";

const title = "Work";
const description =
  "We're a new agency taking on our first clients, with no published case studies yet. Real work will appear here with client approval. See how our engagements are structured.";

export const metadata = pageMetadata({
  title,
  description,
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: "/work",
          name: title,
          description,
          breadcrumb: "Work",
        })}
      />
      <PageHero
        breadcrumb="Work"
        eyebrow="Work"
        title="How our engagements are structured."
        description="We'd rather show you honesty than invented case studies. There's no published work here yet. This is where real projects will live, once our first clients approve them for publication."
      />
      <Work showHeading={false} />
      <Metrics />
      <Cta />
    </>
  );
}
