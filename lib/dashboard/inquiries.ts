import { createClient } from "@/lib/supabase/server";
import type { Inquiry } from "@/lib/dashboard/types";

// Re-export the pure lead types/constants so existing server-side importers can
// keep pulling them from here; client components should import from
// "@/lib/dashboard/types" directly to avoid bundling this server module.
export {
  type LeadStatus,
  LEAD_STATUSES,
  type Inquiry,
} from "@/lib/dashboard/types";

/*
 * Reads leads newest-first with the signed-in user's session. Row-level
 * security scopes the result to admins (allowlist) — this query carries no
 * elevated privilege, so a non-admin session returns an empty array rather
 * than an error.
 */
export async function getInquiries(): Promise<Inquiry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to load inquiries: ${error.message}`);
  return (data ?? []) as Inquiry[];
}
