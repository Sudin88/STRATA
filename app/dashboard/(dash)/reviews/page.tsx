import { Container } from "@/components/ui/container";
import { PageHeading } from "@/components/dashboard/page-heading";
import { ReviewsModeration } from "@/components/dashboard/reviews-moderation";
import { getAllReviews } from "@/lib/dashboard/reviews";

/*
 * Reviews moderation. The "Admins can read all reviews" RLS policy widens
 * visibility to unapproved rows for admins only; approving flips `approved` so
 * the review appears on the public wall. Reading the session forces dynamic.
 */
export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await getAllReviews();
  const pending = reviews.filter((r) => !r.approved).length;

  return (
    <>
      <PageHeading
        title="Reviews"
        description={
          reviews.length === 0
            ? "No reviews yet."
            : `${reviews.length} total${
                pending > 0 ? `, ${pending} awaiting moderation` : ""
              }.`
        }
      />
      <Container className="py-6">
        <ReviewsModeration reviews={reviews} />
      </Container>
    </>
  );
}
