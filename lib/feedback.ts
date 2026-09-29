/**
 * Feedback-form shape and validation — kept out of the component so the rules
 * are unit-testable, mirroring lib/contact.ts. Feedback is stored in Supabase
 * (see lib/supabase.ts) with approved=false and published only after we flip
 * approved=true in the dashboard, so nothing a visitor submits appears on the
 * site until we approve it.
 */

export interface FeedbackState {
  name: string;
  email: string;
  company: string;
  /** 1–5; 0 means the visitor hasn't chosen a rating yet. */
  rating: number;
  feedback: string;
  /** Opt-in to publish the quote as a testimonial. */
  consent: boolean;
}

export const EMPTY_FEEDBACK: FeedbackState = {
  name: "",
  email: "",
  company: "",
  rating: 0,
  feedback: "",
  consent: false,
};

export type FeedbackErrors = Partial<
  Record<"name" | "email" | "rating" | "feedback", string>
>;

/** Submit order, so a failed submit focuses the first offending field. */
export const FEEDBACK_FIELD_ORDER: readonly (keyof FeedbackErrors)[] = [
  "name",
  "email",
  "rating",
  "feedback",
];

export function validateFeedback(form: FeedbackState): FeedbackErrors {
  const errors: FeedbackErrors = {};
  if (!form.name.trim()) errors.name = "Enter your name.";
  /* Email is optional here — only validate the format when one is given. */
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email address.";
  if (!Number.isInteger(form.rating) || form.rating < 1 || form.rating > 5)
    errors.rating = "Select a star rating.";
  if (form.feedback.trim().length < 10)
    errors.feedback = "Tell us a little more, at least a sentence.";
  return errors;
}
