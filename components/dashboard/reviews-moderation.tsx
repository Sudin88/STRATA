"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star, Check, EyeOff, ShieldCheck, ShieldAlert } from "lucide-react";
import { setReviewApproved } from "@/app/dashboard/actions";
import type { DashboardReview } from "@/lib/dashboard/reviews";
import { cn } from "@/lib/utils";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          aria-hidden
          className={cn(
            "size-4",
            star <= rating
              ? "fill-ion text-ion"
              : "fill-transparent text-line-strong",
          )}
        />
      ))}
    </div>
  );
}

/*
 * Moderation queue for the public reviews wall. Pending (unapproved) reviews
 * surface first; Approve/Hide flip the `approved` column via the
 * setReviewApproved Server Action (RLS-gated) and refresh. Honest empty state,
 * mirroring the public wall — no invented testimonials.
 */
export function ReviewsModeration({ reviews }: { reviews: DashboardReview[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function toggle(id: string, approved: boolean) {
    setPendingId(id);
    startTransition(async () => {
      try {
        await setReviewApproved(id, approved);
        router.refresh();
      } finally {
        setPendingId(null);
      }
    });
  }

  if (reviews.length === 0) {
    return (
      <div className="hairline rounded-card border border-line bg-surface p-10 text-center">
        <p className="text-sm text-mut">
          No reviews yet. When clients submit the feedback form, their reviews
          land here for you to approve before they appear on the public wall.
        </p>
      </div>
    );
  }

  // Pending first, then already-approved. getAllReviews is newest-first, so
  // date order is preserved within each group.
  const ordered = [
    ...reviews.filter((r) => !r.approved),
    ...reviews.filter((r) => r.approved),
  ];

  return (
    <ul className="space-y-3">
      {ordered.map((review) => {
        const busy = pendingId === review.id;
        return (
          <li
            key={review.id}
            className="hairline rounded-card border border-line bg-surface p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <Stars rating={review.rating} />
                  <StatusPill approved={review.approved} />
                </div>
                <p className="mt-2 text-sm font-semibold text-fg">
                  {review.name}
                  {review.company && (
                    <span className="font-normal text-dim">
                      {" "}
                      · {review.company}
                    </span>
                  )}
                </p>
              </div>
              <time
                dateTime={review.created_at}
                className="shrink-0 font-mono text-xs text-dim"
              >
                {dateFmt.format(new Date(review.created_at))}
              </time>
            </div>

            <blockquote className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-fg/90">
              {review.feedback}
            </blockquote>

            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-4">
              <ConsentFlag consent={review.consent} />
              {review.email && (
                <a
                  href={`mailto:${review.email}`}
                  className="text-xs text-ion hover:underline"
                >
                  {review.email}
                </a>
              )}
              <div className="ml-auto flex gap-2">
                {review.approved ? (
                  <button
                    type="button"
                    onClick={() => toggle(review.id, false)}
                    disabled={busy}
                    className="inline-flex min-h-9 items-center gap-2 rounded-pill border border-line px-3.5 py-1.5 text-sm font-medium text-mut transition-colors hover:border-line-strong hover:text-fg disabled:opacity-50"
                  >
                    <EyeOff className="size-4" aria-hidden />
                    Hide
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggle(review.id, true)}
                    disabled={busy || !review.consent}
                    title={
                      review.consent
                        ? undefined
                        : "This reviewer didn't consent to publishing."
                    }
                    className="inline-flex min-h-9 items-center gap-2 rounded-pill bg-ion px-3.5 py-1.5 text-sm font-medium text-surface transition-colors hover:bg-ion-deep disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Check className="size-4" aria-hidden />
                    Approve
                  </button>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function StatusPill({ approved }: { approved: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-2.5 py-0.5 text-xs font-medium",
        approved ? "bg-ion-soft text-ion" : "bg-raise text-mut",
      )}
    >
      {approved ? "Published" : "Pending"}
    </span>
  );
}

function ConsentFlag({ consent }: { consent: boolean }) {
  const Icon = consent ? ShieldCheck : ShieldAlert;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs",
        consent ? "text-mut" : "text-warn",
      )}
    >
      <Icon className="size-4" aria-hidden />
      {consent ? "Consented to publish" : "No consent to publish"}
    </span>
  );
}
