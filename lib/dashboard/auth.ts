import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/*
 * Dashboard Data Access Layer — the server-side authorization check that sits
 * closest to the data (the Next.js auth guide's recommended pattern; proxy.ts
 * alone is not a security boundary). Wrapped in React `cache()` so multiple
 * calls within one request (layout + page) hit Supabase once.
 *
 * getUser() validates the token with Supabase rather than trusting the cookie.
 * Which emails are actually allowed to SEE leads is enforced by row-level
 * security on `inquiries` (the admin_emails allowlist) — a signed-in
 * non-admin simply gets zero rows.
 */
export const getAdminUser = cache(async (): Promise<User> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/dashboard/login");
  return user;
});
