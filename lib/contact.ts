/**
 * Contact-form shape, options and validation — kept out of the component so
 * the rules are unit-testable and reused wherever the form is embedded.
 */

export const SERVICE_OPTIONS = [
  "SEO",
  "Website Development",
  "AI Ad Videos",
  "Social Media",
  "Paid Advertising",
  "AI Automation",
  "Other",
] as const;

export const BUDGET_OPTIONS = [
  "Under $2,000",
  "$2,000 – $5,000",
  "$5,000 – $15,000",
  "$15,000+",
  "Not sure yet",
] as const;

export interface FormState {
  name: string;
  company: string;
  email: string;
  website: string;
  service: string;
  budget: string;
  details: string;
}

export const EMPTY: FormState = {
  name: "",
  company: "",
  email: "",
  website: "",
  service: "",
  budget: "",
  details: "",
};

export type FormErrors = Partial<Record<keyof FormState, string>>;

/** Submit order, so a failed submit focuses the first offending field. */
export const FIELD_ORDER: readonly (keyof FormState)[] = [
  "name",
  "email",
  "service",
  "details",
];

export function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email address.";
  if (!form.service) errors.service = "Choose the service you're interested in.";
  if (form.details.trim().length < 10)
    errors.details = "Tell us a little more — at least a sentence.";
  return errors;
}
