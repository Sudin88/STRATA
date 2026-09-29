import { createClient } from "@supabase/supabase-js";

/*
 * Browser Supabase client for the feedback feature.
 *
 * Both values are PUBLIC by design — the URL is your project's REST endpoint
 * and the publishable key only ever acts as the `anon` Postgres role, which is
 * locked down by Row Level Security (see the create_reviews_table migration).
 * They are safe to inline into the client bundle, so they ship as
 * NEXT_PUBLIC_ vars. Never put the service-role key or a personal access
 * token here — those bypass RLS.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True only when both env vars are present, so callers can degrade gracefully. */
export const isSupabaseConfigured = Boolean(url && anonKey);

/*
 * A single shared client. We don't persist a session (no auth in this app), so
 * there's no token to store — this is purely an anonymous REST client.
 */
export const supabase =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

/** Row shape the public reviews wall reads (email is intentionally absent). */
export interface PublicReview {
  id: string;
  created_at: string;
  name: string;
  company: string | null;
  rating: number;
  feedback: string;
}
