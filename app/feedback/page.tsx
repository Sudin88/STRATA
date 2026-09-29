import { PageHero } from "@/components/page-hero";
import { ReviewsWall } from "@/components/reviews-wall";
import { FeedbackForm } from "@/components/feedback-form";
import { Cta } from "@/components/cta";
import { pageMetadata } from "@/lib/seo";
import { pageGraph } from "@/lib/schema";
import { JsonLd } from "@/components/json-ld";

const title = "Feedback — Share Your Experience";
const description =
  "We're a new agency building our reputation the honest way. Share your feedback or first impression — the reviews published here will be real, from real clients.";

export const metadata = pageMetadata({
  title,
  description,
  path: "/feedback",
});

export default function FeedbackPage() {
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: "/feedback",
          name: title,
          description,
          breadcrumb: "Feedback",
        })}
      />
      <PageHero
        breadcrumb="Feedback"
        eyebrow="Feedback"
        title="Help shape a new agency."
        description="We're just getting started, so we'd rather show you honesty than a wall of invented testimonials. There are no reviews here yet — be one of the first to tell us, and the world, how we did."
      />
      <FeedbackForm />
      <ReviewsWall />
      <Cta />
    </>
  );
}
