import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHeading } from "@/components/dashboard/page-heading";
import { StatCard } from "@/components/dashboard/stat-card";
import { BarBreakdown } from "@/components/dashboard/bar-breakdown";
import { LeadsTrend } from "@/components/dashboard/leads-trend";
import { getInquiries, LEAD_STATUSES } from "@/lib/dashboard/inquiries";
import { countPendingReviews } from "@/lib/dashboard/reviews";
import { computeMetrics, type Slice } from "@/lib/dashboard/metrics";

/*
 * Overview. Every figure here is aggregated from real rows by computeMetrics —
 * no fabricated numbers. With little data it reads sparse, which is the honest
 * picture.
 */
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  won: "Won",
  lost: "Lost",
};

const dateFmt = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
});

export default async function OverviewPage() {
  const [inquiries, pendingReviews] = await Promise.all([
    getInquiries(),
    countPendingReviews(),
  ]);
  const metrics = computeMetrics(inquiries);

  const pipeline: Slice[] = LEAD_STATUSES.map((status) => ({
    label: STATUS_LABEL[status],
    count: metrics.byStatus[status],
  }));

  const recent = inquiries.slice(0, 5);

  return (
    <>
      <PageHeading
        title="Overview"
        description="Everything here is measured from real leads and reviews."
      />
      <Container className="space-y-6 py-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total leads" value={metrics.total} />
          <StatCard label="Last 7 days" value={metrics.last7} />
          <StatCard label="Last 30 days" value={metrics.last30} />
          <StatCard
            label="Pending reviews"
            value={pendingReviews}
            sub={pendingReviews > 0 ? "Awaiting moderation" : "Nothing waiting"}
          />
        </div>

        <LeadsTrend trend={metrics.trend} />

        <div className="grid gap-4 lg:grid-cols-3">
          <BarBreakdown
            title="Pipeline"
            slices={pipeline}
            emptyLabel="No leads yet."
          />
          <BarBreakdown
            title="By service"
            slices={metrics.byService}
            emptyLabel="No leads yet."
          />
          <BarBreakdown
            title="By budget"
            slices={metrics.byBudget}
            emptyLabel="No leads yet."
          />
        </div>

        <div className="hairline rounded-card border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold tracking-wide text-mut uppercase">
              Recent leads
            </h2>
            {inquiries.length > 0 && (
              <Link
                href="/dashboard/leads"
                className="inline-flex items-center gap-1 text-sm font-medium text-ion hover:underline"
              >
                All leads
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            )}
          </div>

          {recent.length === 0 ? (
            <p className="mt-4 text-sm text-dim">
              No leads yet. New contact-form submissions will appear here.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {recent.map((lead) => (
                <li
                  key={lead.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-fg">
                      {lead.name}
                      {lead.company && (
                        <span className="font-normal text-dim">
                          {" "}
                          · {lead.company}
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-mut">{lead.service}</p>
                  </div>
                  <span className="shrink-0 rounded-pill bg-raise px-2.5 py-0.5 text-xs font-medium text-mut">
                    {STATUS_LABEL[lead.status]}
                  </span>
                  <time
                    dateTime={lead.created_at}
                    className="hidden shrink-0 font-mono text-xs text-dim sm:inline"
                  >
                    {dateFmt.format(new Date(lead.created_at))}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </>
  );
}
