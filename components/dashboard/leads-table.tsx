"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Download, Search } from "lucide-react";
import type { Inquiry } from "@/lib/dashboard/inquiries";
import { inputClass } from "@/components/ui/field";
import { LeadStatusSelect } from "@/components/dashboard/lead-status-select";
import { toCsv } from "@/lib/dashboard/csv";
import { cn } from "@/lib/utils";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function matches(lead: Inquiry, q: string) {
  const hay = [lead.name, lead.email, lead.service, lead.company ?? ""]
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

export function LeadsTable({ inquiries }: { inquiries: Inquiry[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? inquiries.filter((lead) => matches(lead, q)) : inquiries;
  }, [inquiries, query]);

  // Build a CSV from the currently-filtered rows and hand it to the browser as
  // a download. Client-side only (a Blob), so no lead data touches the network.
  function exportCsv() {
    const csv = toCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (inquiries.length === 0) {
    return (
      <div className="hairline rounded-card border border-line bg-surface p-10 text-center">
        <p className="text-sm text-mut">
          No leads yet. New contact-form submissions will appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-dim"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, service…"
            aria-label="Search leads"
            className={cn(inputClass, "pl-10")}
          />
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="inline-flex min-h-10 items-center gap-2 rounded-pill border border-line px-4 py-2 text-sm font-medium text-mut transition-colors hover:border-line-strong hover:text-fg disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="size-4" aria-hidden />
          Export CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="px-1 py-8 text-sm text-mut">
          No leads match “{query}”.
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((lead) => (
            <li key={lead.id}>
              <details className="hairline group rounded-card border border-line bg-surface open:border-line-strong">
                <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-fg">
                      {lead.name}
                      {lead.company && (
                        <span className="font-normal text-dim">
                          {" "}
                          · {lead.company}
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-mut">
                      {lead.email}
                    </p>
                  </div>
                  <span className="hidden shrink-0 rounded-pill bg-ion-soft px-3 py-1 text-xs font-medium text-ion sm:inline">
                    {lead.service}
                  </span>
                  <time
                    dateTime={lead.created_at}
                    className="hidden shrink-0 font-mono text-xs text-dim md:inline"
                  >
                    {dateFmt.format(new Date(lead.created_at))}
                  </time>
                  <LeadStatusSelect id={lead.id} status={lead.status} />
                  <ChevronDown
                    aria-hidden
                    className="size-4 shrink-0 text-dim transition-transform group-open:rotate-180"
                  />
                </summary>

                <div className="space-y-4 border-t border-line px-5 py-4 text-sm">
                  <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                    <Detail label="Email">
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-ion hover:underline"
                      >
                        {lead.email}
                      </a>
                    </Detail>
                    <Detail label="Service">{lead.service}</Detail>
                    <Detail label="Budget">{lead.budget || "—"}</Detail>
                    <Detail label="Website">
                      {lead.website ? (
                        <a
                          href={
                            /^https?:\/\//.test(lead.website)
                              ? lead.website
                              : `https://${lead.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all text-ion hover:underline"
                        >
                          {lead.website}
                        </a>
                      ) : (
                        "—"
                      )}
                    </Detail>
                    <Detail label="Received">
                      {dateFmt.format(new Date(lead.created_at))}
                    </Detail>
                  </dl>
                  <div>
                    <dt className="mb-1.5 text-xs font-semibold tracking-wide text-mut uppercase">
                      Project details
                    </dt>
                    <p className="whitespace-pre-wrap text-fg/90">
                      {lead.details}
                    </p>
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold tracking-wide text-mut uppercase">
        {label}
      </dt>
      <dd className="mt-0.5 text-fg/90">{children}</dd>
    </div>
  );
}
