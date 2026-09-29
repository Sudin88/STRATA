"use client";

import { useState } from "react";
import { Send, Star } from "lucide-react";
import {
  EMPTY_FEEDBACK,
  FEEDBACK_FIELD_ORDER,
  validateFeedback,
  type FeedbackErrors,
  type FeedbackState,
} from "@/lib/feedback";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { submitForm } from "@/lib/submit";
import { useSpamGuard, HoneypotField } from "@/components/ui/spam-guard";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Field, inputClass } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "success" | "error" | "rate_limited";

const RATINGS = [1, 2, 3, 4, 5] as const;

function StarRating({
  value,
  onChange,
  invalid,
  describedBy,
}: {
  value: number;
  onChange: (rating: number) => void;
  invalid?: boolean;
  describedBy?: string;
}) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  /*
   * WAI-ARIA radiogroup keyboard pattern: arrow keys move AND select, Home/End
   * jump to the ends, and a roving tabindex keeps the whole group a single tab
   * stop (only the checked star — or the first, when none is chosen — is
   * tabbable). Without this the group was mouse-only for selection.
   */
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    let next = 0;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = value >= 5 ? 1 : value + 1;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        next = value <= 1 ? 5 : value - 1;
        break;
      case "Home":
        next = 1;
        break;
      case "End":
        next = 5;
        break;
      default:
        return;
    }
    e.preventDefault();
    onChange(next);
    setHover(0);
    e.currentTarget
      .querySelector<HTMLButtonElement>(`[data-star="${next}"]`)
      ?.focus();
  }

  return (
    /*
     * Roving-tabindex radiogroup (WAI-ARIA APG): the single tab stop lives on
     * the child radios below, so the container is intentionally NOT focusable —
     * making it focusable would add a spurious second tab stop. Arrow-key
     * handling sits here and receives events bubbling up from the focused radio.
     */
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
    <div
      role="radiogroup"
      aria-label="Star rating"
      aria-invalid={invalid}
      aria-describedby={describedBy}
      className="flex items-center gap-1.5"
      onMouseLeave={() => setHover(0)}
      onKeyDown={handleKeyDown}
    >
      {RATINGS.map((star) => {
        // Roving tabindex: the selected star owns the tab stop; with nothing
        // selected yet, the first star does so the group is still reachable.
        const tabbable = value ? value === star : star === 1;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            data-star={star}
            tabIndex={tabbable ? 0 : -1}
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onFocus={() => setHover(star)}
            onBlur={() => setHover(0)}
            className="rounded-md p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ion/60"
          >
            <Star
              aria-hidden
              className={cn(
                "size-7 transition-colors",
                star <= active ? "fill-ion text-ion" : "fill-transparent text-line-strong"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

export function FeedbackForm() {
  const [form, setForm] = useState<FeedbackState>(EMPTY_FEEDBACK);
  const [errors, setErrors] = useState<FeedbackErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const { trap, setTrap, isLikelyBot, elapsedMs } = useSpamGuard();

  function set<K extends keyof FeedbackState>(key: K, value: FeedbackState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key as keyof FeedbackErrors])
      setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validateFeedback(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const first = FEEDBACK_FIELD_ORDER.find((key) => nextErrors[key]);
      if (first) document.getElementById(`fb-${first}`)?.focus();
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "Feedback form: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to store submissions."
        );
      }
      setStatus("error");
      return;
    }

    // Silently drop suspected bots: report success but never call the server.
    if (isLikelyBot()) {
      setStatus("success");
      setForm(EMPTY_FEEDBACK);
      return;
    }

    setStatus("sending");
    // Goes through the edge function, which rate-limits and (when an email is
    // given) verifies it. `approved` is forced false server-side, so nothing a
    // visitor submits is published until we approve it in the dashboard.
    const result = await submitForm({
      kind: "feedback",
      trap,
      elapsedMs: elapsedMs(),
      payload: {
        name: form.name.trim(),
        company: form.company.trim() || null,
        email: form.email.trim() || null,
        rating: form.rating,
        feedback: form.feedback.trim(),
        consent: form.consent,
      },
    });

    if (result.ok) {
      setStatus("success");
      setForm(EMPTY_FEEDBACK);
      return;
    }

    if (result.reason === "invalid_email") {
      setStatus("idle");
      setErrors({ email: "We couldn't verify that email — please check for typos." });
      document.getElementById("fb-email")?.focus();
      return;
    }
    setStatus(result.reason === "rate_limited" ? "rate_limited" : "error");
  }

  return (
    <section className="border-t border-line bg-raise/60 py-24 sm:py-32">
      <Container>
        <div className="mx-auto max-w-2xl">
          <SectionHeading
            eyebrow="Feedback"
            title="Tell us how we're doing."
            subtitle="Worked with us, or just landed here and formed an opinion? Tell us below. With your okay, we might feature your words as one of our first published reviews."
            className="mb-10"
          />

          <Reveal delay={0.1}>
            <form
              onSubmit={onSubmit}
              noValidate
              className="hairline rounded-card border border-line bg-surface p-6 sm:p-9"
            >
              <HoneypotField value={trap} onChange={setTrap} />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name *" htmlFor="fb-name" error={errors.name}>
                  <input
                    id="fb-name"
                    name="name"
                    required
                    className={inputClass}
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Your full name"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "fb-name-error" : undefined}
                  />
                </Field>
                <Field label="Company / role" htmlFor="fb-company">
                  <input
                    id="fb-company"
                    name="company"
                    className={inputClass}
                    value={form.company}
                    onChange={(e) => set("company", e.target.value)}
                    placeholder="Where you're from"
                    autoComplete="organization"
                  />
                </Field>
              </div>

              <div className="mt-5">
                <Field label="Email" htmlFor="fb-email" error={errors.email}>
                  <input
                    id="fb-email"
                    name="email"
                    type="email"
                    className={inputClass}
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@company.com (optional, so we can reply)"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "fb-email-error" : undefined}
                  />
                </Field>
              </div>

              <div className="mt-5">
                <Field label="Rating *" htmlFor="fb-rating" error={errors.rating}>
                  <div id="fb-rating" tabIndex={-1}>
                    <StarRating
                      value={form.rating}
                      onChange={(rating) => set("rating", rating)}
                      invalid={!!errors.rating}
                      describedBy={errors.rating ? "fb-rating-error" : undefined}
                    />
                  </div>
                </Field>
              </div>

              <div className="mt-5">
                <Field label="Your feedback *" htmlFor="fb-feedback" error={errors.feedback}>
                  <textarea
                    id="fb-feedback"
                    name="feedback"
                    required
                    rows={5}
                    className={cn(inputClass, "resize-y")}
                    value={form.feedback}
                    onChange={(e) => set("feedback", e.target.value)}
                    placeholder="What stood out, good or bad? The more specific, the more useful."
                    aria-invalid={!!errors.feedback}
                    aria-describedby={errors.feedback ? "fb-feedback-error" : undefined}
                  />
                </Field>
              </div>

              <label className="mt-5 flex items-start gap-3 text-sm text-mut">
                <input
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={(e) => set("consent", e.target.checked)}
                  className="mt-0.5 size-4 rounded border-line accent-ion"
                />
                <span>
                  You may publish my feedback (with my name and company) as a
                  testimonial on this site.
                </span>
              </label>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex min-h-12 items-center gap-2 rounded-pill bg-fg px-7 py-3 text-sm font-semibold text-ink transition-all duration-300 enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_10px_24px_-10px_rgba(18,19,20,0.32)] disabled:opacity-60"
                >
                  <Send className="size-4" aria-hidden />
                  {status === "sending" ? "Sending…" : "Send Feedback"}
                </button>
                <p aria-live="polite" className="text-sm">
                  {status === "success" && (
                    <span className="text-ion">
                      Thank you. We really appreciate you taking the time.
                    </span>
                  )}
                  {status === "rate_limited" && (
                    <span className="text-warn">
                      You&apos;ve sent a few already. Please try again in a little while.
                    </span>
                  )}
                  {status === "error" && (
                    <span className="text-warn">
                      Something went wrong. Please try again.
                    </span>
                  )}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

