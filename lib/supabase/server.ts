import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/*
 * Server-side Supabase client bound to the request's cookies. Used by Server
 * Components, the dashboard Data Access Layer, and Server Actions to read the
 * signed-in session and query with the *user's* role (RLS-enforced) — never the
 * service-role key.
 *
 * `cookies()` is async in Next.js 16, so this factory is async and must be
 * awaited. Session refresh (writing rotated cookies) happens in `proxy.ts`;
 * here `setAll` is wrapped in try/catch because cookies cannot be written
 * during Server Component render.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component, where the cookie store is
            // read-only. Safe to ignore: `proxy.ts` refreshes the session on
            // every dashboard request, so rotated cookies are still persisted.
          }
        },
      },
    }
  );
}
