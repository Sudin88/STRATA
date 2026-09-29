import { Container } from "@/components/ui/container";
import { PageHeading } from "@/components/dashboard/page-heading";
import { LeadsTable } from "@/components/dashboard/leads-table";
import { getInquiries } from "@/lib/dashboard/inquiries";

/*
 * The leads inbox. The (dash) layout already ran the auth gate; RLS still
 * scopes the query to the admin allowlist (a signed-in non-admin gets zero
 * rows). Reading the session cookie forces dynamic rendering.
 */
export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const inquiries = await getInquiries();

  return (
    <>
      <PageHeading
        title="Leads"
        description={
          inquiries.length === 0
            ? "No leads yet."
            : `${inquiries.length} ${
                inquiries.length === 1 ? "lead" : "leads"
              }, newest first.`
        }
      />
      <Container className="py-6">
        <LeadsTable inquiries={inquiries} />
      </Container>
    </>
  );
}
