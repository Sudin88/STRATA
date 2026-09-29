"use client";

import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { supabase, isSupabaseConfigured, type PublicReview } from "@/lib/supabase";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type LoadState = "loading" | "ready" | "error";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          aria-hidden
          className={cn(
            "size-4",
            star <= rating ? "fill-ion text-ion" : "fill-transparent text-line-strong"
          )}
        />
      ))}
    </div>
  );
}

/* Honest empty state — no invented testimonials while we have no real ones. */
function Empty() {
  return (
    <div className="hairline rounded-card border border-line bg-surface p-10 text-center sm:p-14">
      <p className="eyebrow mb-4">No reviews published yet</p>
      <h3 className="mx-auto max-w-xl text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
        This is where real reviews will live.
      </h3>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-mut">
        We&apos;re a new agency, so we&apos;d rather leave this honest than fill
        it with words nobody said. Every review here will come from a real
        client who agreed to share it — the form below is where the first ones
        start.
      </p>
    </div>
  );
}

/**
 * Publicly-readable reviews wall. Fetches once on mount from Supabase; RLS and
 * column grants mean only approved + consented rows come back, and never the
 * submitter's email. Falls back to the honest empty state when there are none
 * (or when Supabase isn't configured / a fetch fails), so the page never shows
 * fabricated social proof.
 */
export function ReviewsWall() {
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  // isSupabaseConfigured is constant at module load, so seed the state from it
  // rather than calling setState in the effect (react-hooks/set-state-in-effect).
  const [state, setState] = useState<LoadState>(
    isSupabaseConfigured ? "loading" : "error"
  );

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    let active = true;
    supabase
      .from("reviews")
      .select("id, created_at, name, company, rating, feedback")
      .order("created_at", { ascending: false })
      .limit(24)
      .then(
        ({ data, error }) => {
          if (!active) return;
          if (error) {
            setState("error");
            return;
          }
          setReviews((data as PublicReview[]) ?? []);
          setState("ready");
        },
        () => {
          // A network-level rejection (offline, DNS, CORS) never lands in the
          // handler above; the Supabase builder is a thenable whose .then()
          // return has no .catch(), so we take rejections via this second
          // argument. Without it the skeleton would spin forever — fall back to
          // the honest empty state instead.
          if (active) setState("error");
        }
      );
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="border-t border-line py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Reviews"
          title="What people are saying."
          subtitle="Real words from real clients — published only with their permission. As our first engagements wrap up, their reviews appear here."
        />

        <div className="mt-12">
          {state === "loading" ? (
            <div
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              aria-hidden
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="hairline h-52 animate-pulse rounded-card border border-line bg-surface"
                />
              ))}
            </div>
          ) : state === "ready" && reviews.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review, i) => (
                <Reveal key={review.id} delay={(i % 3) * 0.1}>
                  <figure className="hairline flex h-full flex-col rounded-card border border-line bg-surface p-6 sm:p-7">
                    <div className="mb-4 flex items-center justify-between">
                      <Stars rating={review.rating} />
                      <Quote aria-hidden className="size-5 text-line-strong" />
                    </div>
                    <blockquote className="flex-1 text-sm leading-relaxed text-fg">
                      {review.feedback}
                    </blockquote>
                    <figcaption className="mt-5 border-t border-line pt-4 text-sm">
                      <span className="font-semibold text-fg">{review.name}</span>
                      {review.company && (
                        <span className="text-mut"> · {review.company}</span>
                      )}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <Empty />
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}
