import type { Inquiry } from "@/lib/dashboard/inquiries";

/*
 * Minimal, dependency-free CSV builder for exporting leads to a spreadsheet or
 * CRM. Pure so it unit-tests cleanly and runs client-side (the export button
 * builds a Blob from the currently-filtered rows).
 */

const COLUMNS: { header: string; value: (i: Inquiry) => string }[] = [
  { header: "Received", value: (i) => i.created_at },
  { header: "Name", value: (i) => i.name },
  { header: "Company", value: (i) => i.company ?? "" },
  { header: "Email", value: (i) => i.email },
  { header: "Website", value: (i) => i.website ?? "" },
  { header: "Service", value: (i) => i.service },
  { header: "Budget", value: (i) => i.budget ?? "" },
  { header: "Status", value: (i) => i.status },
  { header: "Details", value: (i) => i.details },
];

/** Escape one field per RFC 4180: quote when it contains "," '"' or a newline. */
function escapeCell(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** Build a CSV string (header row + one row per lead). Always ends with CRLF. */
export function toCsv(inquiries: Inquiry[]): string {
  const rows = [
    COLUMNS.map((c) => c.header),
    ...inquiries.map((i) => COLUMNS.map((c) => escapeCell(c.value(i)))),
  ];
  return rows.map((cells) => cells.join(",")).join("\r\n") + "\r\n";
}
