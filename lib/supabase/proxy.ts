import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/*
 * Builds a Supabase server client bound to an incoming request/response pair so
 * a rotated session can be written back as cookies. This is the standard
 * `@supabase/ssr` proxy pattern; it's separated from `lib/supabase/server.ts`
 * because that one reads cookies via `next/headers` (Server Component context),
 * while this reads/writes them on the NextRequest/NextResponse (proxy context).
 *
 * Returns both the mutable response (carrying refreshed auth cookies) and the
 * validated user, so `proxy.ts` can make its redirect decision.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Must run before the response is generated so a refreshed token is written
  // back. getUser() validates the token with Supabase (getSession() does not).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
