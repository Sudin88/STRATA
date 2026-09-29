import { createBrowserClient } from "@supabase/ssr";

/*
 * Browser-side Supabase client for the dashboard login flow (signInWithPassword
 * / signOut). Unlike the site-wide anonymous client in `lib/supabase.ts` (which
 * disables session persistence), this one persists the session in cookies via
 * `@supabase/ssr` so the server (proxy + Server Components) can read it.
 *
 * Uses the same public NEXT_PUBLIC_ env vars — the anon/publishable key is safe
 * in the browser; row-level security is what actually gates the data.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
