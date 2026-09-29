/*
 * Pure lead types + constants, with no server imports, so client components
 * (e.g. the status control) can pull the status vocabulary without dragging
 * `next/headers` and the server Supabase client into the browser bundle.
 */

/** Pipeline stage for a lead. Mirrors the `status` check constraint. */
export type LeadStatus = "new" | "contacted" | "won" | "lost";

export const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "won", "lost"];

/** A contact-form lead. Mirrors the `public.inquiries` table. */
export type Inquiry = {
  id: string;
  created_at: string;
  name: string;
  company: string | null;
  email: string;
  website: string | null;
  service: string;
  budget: string | null;
  details: string;
  status: LeadStatus;
};
