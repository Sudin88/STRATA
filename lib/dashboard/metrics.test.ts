import { describe, it, expect } from "vitest";
import type { Inquiry } from "@/lib/dashboard/inquiries";
import { computeMetrics } from "@/lib/dashboard/metrics";

const DAY = 24 * 60 * 60 * 1000;
// Fixed local clock so the 7/30-day windows and trend buckets are deterministic.
const NOW = new Date(2026, 8, 29, 12, 0, 0);

function lead(overrides: Partial<Inquiry> = {}): Inquiry {
  return {
    id: crypto.randomUUID(),
    created_at: NOW.toISOString(),
    name: "Test",
    company: null,
    email: "t@example.com",
    website: null,
    service: "SEO",
    budget: null,
    details: "…",
    status: "new",
    ...overrides,
  };
}

function daysAgo(n: number): string {
  return new Date(NOW.getTime() - n * DAY).toISOString();
}

describe("computeMetrics", () => {
  it("returns honest zeros for no leads", () => {
    const m = computeMetrics([], NOW, 30);
    expect(m.total).toBe(0);
    expect(m.last7).toBe(0);
    expect(m.last30).toBe(0);
    expect(m.byStatus).toEqual({ new: 0, contacted: 0, won: 0, lost: 0 });
    expect(m.byService).toEqual([]);
    expect(m.byBudget).toEqual([]);
    expect(m.trend).toHaveLength(30);
    expect(m.trend.every((p) => p.count === 0)).toBe(true);
  });

  it("counts the 7- and 30-day windows by created_at", () => {
    const m = computeMetrics(
      [
        lead({ created_at: daysAgo(1) }),
        lead({ created_at: daysAgo(3) }),
        lead({ created_at: daysAgo(10) }),
        lead({ created_at: daysAgo(40) }),
      ],
      NOW,
    );
    expect(m.total).toBe(4);
    expect(m.last7).toBe(2);
    expect(m.last30).toBe(3);
  });

  it("tallies leads by status", () => {
    const m = computeMetrics(
      [
        lead({ status: "new" }),
        lead({ status: "new" }),
        lead({ status: "contacted" }),
        lead({ status: "won" }),
      ],
      NOW,
    );
    expect(m.byStatus).toEqual({ new: 2, contacted: 1, won: 1, lost: 0 });
  });

  it("breaks down by service, sorted by count then label", () => {
    const m = computeMetrics(
      [
        lead({ service: "SEO" }),
        lead({ service: "SEO" }),
        lead({ service: "Ads" }),
        lead({ service: "Ads" }),
        lead({ service: "Content" }),
      ],
      NOW,
    );
    // Ads and SEO tie at 2 → alphabetical; Content trails at 1.
    expect(m.byService).toEqual([
      { label: "Ads", count: 2 },
      { label: "SEO", count: 2 },
      { label: "Content", count: 1 },
    ]);
  });

  it("labels missing budgets honestly and groups them", () => {
    const m = computeMetrics(
      [
        lead({ budget: "$5k" }),
        lead({ budget: "$5k" }),
        lead({ budget: null }),
        lead({ budget: "" }),
      ],
      NOW,
    );
    expect(m.byBudget).toEqual([
      { label: "$5k", count: 2 },
      { label: "Not specified", count: 2 },
    ]);
  });

  it("zero-fills the daily trend and buckets same-day leads", () => {
    const m = computeMetrics(
      [lead({ created_at: NOW.toISOString() }), lead({ created_at: daysAgo(2) })],
      NOW,
      7,
    );
    expect(m.trend).toHaveLength(7);
    expect(m.trend.reduce((s, p) => s + p.count, 0)).toBe(2);
    // Last bucket is today and holds the same-day lead.
    expect(m.trend[m.trend.length - 1].count).toBe(1);
  });

  it("excludes leads older than the trend window from the trend", () => {
    const m = computeMetrics([lead({ created_at: daysAgo(60) })], NOW, 30);
    expect(m.total).toBe(1);
    expect(m.trend.reduce((s, p) => s + p.count, 0)).toBe(0);
  });
});
