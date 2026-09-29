"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/dashboard/auth";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/dashboard/inquiries";

/*
 * Sign out and return to the login screen. A Server Action runs as a POST to
 * this route and can write cookies (unlike a Server Component), so signOut()'s
 * cookie clearing takes effect here.
 */
export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/dashboard/login");
}

/*
 * Move a lead along the pipeline. The column-scoped grant + admin RLS policy
 * are the real boundary (a non-admin update matches zero rows); the getAdminUser
 * guard and the status allowlist are defense-in-depth against a bad/forged call.
 */
export async function updateLeadStatus(id: string, status: LeadStatus) {
  await getAdminUser();
  if (!LEAD_STATUSES.includes(status)) {
    throw new Error(`Invalid lead status: ${status}`);
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("inquiries")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(`Failed to update lead: ${error.message}`);

  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard");
}

/*
 * Approve or hide a review for the public wall. Same layering: RLS is the gate,
 * the guard is belt-and-braces. Only the `approved` column is grantable.
 */
export async function setReviewApproved(id: string, approved: boolean) {
  await getAdminUser();

  const supabase = await createClient();
  const { error } = await supabase
    .from("reviews")
    .update({ approved })
    .eq("id", id);
  if (error) throw new Error(`Failed to update review: ${error.message}`);

  revalidatePath("/dashboard/reviews");
  revalidatePath("/dashboard");
}
