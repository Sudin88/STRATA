import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

/*
 * Ends the dashboard session on demand. The client-side DashboardExitGuard POSTs
 * here when the user leaves a /dashboard route for the marketing site, so a
 * single login doesn't leave a session lingering — returning to /dashboard then
 * requires a fresh sign-in. A Route Handler (unlike a Server Component) may write
 * cookies, so signOut()'s cookie clearing takes effect here. Idempotent: signing
 * out an already-anonymous request is a harmless no-op.
 */
export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Drop the "in dashboard" location flag that proxy.ts set.
  const store = await cookies();
  store.delete("dash_active");

  return new NextResponse(null, { status: 204 });
}
