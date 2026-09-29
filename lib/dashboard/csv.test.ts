import { describe, it, expect } from "vitest";
import type { Inquiry } from "@/lib/dashboard/inquiries";
import { toCsv } from "@/lib/dashboard/csv";

const HEADER =
  "Received,Name,Company,Email,Website,Service,Budget,Status,Details";

function lead(overrides: Partial<Inquiry> = {}): Inquiry {
  return {
    id: "1",
    created_at: "2026-09-20T10:00:00.000Z",
    name: "Ada",
    company: null,
    email: "ada@example.com",
    website: null,
    service: "SEO",
    budget: "$5k",
    details: "Simple details",
    status: "new",
    ...overrides,
  };
}

describe("toCsv", () => {
  it("emits just the header (plus trailing CRLF) for no rows", () => {
    expect(toCsv([])).toBe(`${HEADER}\r\n`);
  });

  it("writes one data row per lead", () => {
    const lines = toCsv([lead(), lead()]).split("\r\n");
    // header + 2 rows + trailing empty
    expect(lines).toHaveLength(4);
    expect(lines[0]).toBe(HEADER);
    expect(lines[3]).toBe("");
  });

  it("leaves plain fields unquoted", () => {
    const row = toCsv([lead()]).split("\r\n")[1];
    expect(row).toContain("ada@example.com");
    expect(row).toContain("SEO");
    expect(row).not.toContain('"');
  });

  it("escapes commas, quotes and newlines per RFC 4180", () => {
    const row = toCsv([
      lead({
        company: "Acme, Inc",
        details: 'He said "hi",\nthen left',
      }),
    ]).split("\r\n")[1];

    // Comma forces quoting.
    expect(row).toContain('"Acme, Inc"');
    // Embedded quotes are doubled; commas/newlines force the wrapping quotes.
    expect(row).toContain('"He said ""hi"",\nthen left"');
  });

  it("renders null/optional fields as empty cells", () => {
    const row = toCsv([
      lead({ company: null, website: null }),
    ]).split("\r\n")[1];
    // created_at,name,company(empty),email,...
    expect(row.startsWith("2026-09-20T10:00:00.000Z,Ada,,ada@example.com,")).toBe(
      true,
    );
  });
});
