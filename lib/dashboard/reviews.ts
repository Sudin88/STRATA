import { createClient } from "@/lib/supabase/server";

/**
 * A review as the moderation view sees it — the full row, including fields the
 * public wall never receives (`email`, `consent`, `approved`). Mirrors
 * `public.reviews`. Admin-only: RLS restricts unapproved rows to admins.
 */
export type DashboardReview = {
  id: string;
  created_at: string;
  name: string;
  company: string | null;
  email: string | null;
  rating: number;
  feedback: string;
  consent: boolean;
  approved: boolean;
};

/*
 * Reads every review with the signed-in admin's session. The "Admins can read
 * all reviews" RLS policy widens visibility to unapproved rows for admins only;
 * a non-admin session still sees just approved+consented reviews.
 */
export async function getAllReviews(): Promise<DashboardReview[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to load reviews: ${error.message}`);
  return (data ?? []) as DashboardReview[];
}

/** How many reviews are awaiting a decision (shown as a nav badge). */
export async function countPendingReviews(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("approved", false);

  if (error) throw new Error(`Failed to count reviews: ${error.message}`);
  return count ?? 0;
}
