import type { Inquiry, LeadStatus } from "@/lib/dashboard/inquiries";

/*
 * Pure aggregation over the real leads — no fabricated numbers, no smoothing.
 * With few rows the output is sparse, and that's the honest picture. Kept free
 * of I/O so it unit-tests cleanly and can run on the server per request.
 */

export type Slice = { label: string; count: number };
export type TrendPoint = { date: string; count: number };

export type Metrics = {
  total: number;
  last7: number;
  last30: number;
  byStatus: Record<LeadStatus, number>;
  byService: Slice[];
  byBudget: Slice[];
  trend: TrendPoint[];
};

const DAY_MS = 24 * 60 * 60 * 1000;

/** Local YYYY-MM-DD key for a date (used to bucket the daily trend). */
function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function countBy(inquiries: Inquiry[], pick: (i: Inquiry) => string): Slice[] {
  const map = new Map<string, number>();
  for (const i of inquiries) {
    const key = pick(i);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

/**
 * @param now injectable clock so the 7/30-day windows and the trend are
 *   deterministic in tests.
 */
export function computeMetrics(
  inquiries: Inquiry[],
  now: Date = new Date(),
  trendDays = 30,
): Metrics {
  const nowMs = now.getTime();
  const since7 = nowMs - 7 * DAY_MS;
  const since30 = nowMs - 30 * DAY_MS;

  let last7 = 0;
  let last30 = 0;
  const byStatus: Record<LeadStatus, number> = {
    new: 0,
    contacted: 0,
    won: 0,
    lost: 0,
  };

  for (const i of inquiries) {
    const t = new Date(i.created_at).getTime();
    if (t >= since7) last7 += 1;
    if (t >= since30) last30 += 1;
    byStatus[i.status] = (byStatus[i.status] ?? 0) + 1;
  }

  // Daily buckets for the last `trendDays`, oldest → newest, zero-filled so the
  // chart shows real gaps rather than hiding quiet days.
  const buckets = new Map<string, number>();
  for (let d = trendDays - 1; d >= 0; d--) {
    buckets.set(dayKey(new Date(nowMs - d * DAY_MS)), 0);
  }
  for (const i of inquiries) {
    const key = dayKey(new Date(i.created_at));
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  const trend: TrendPoint[] = [...buckets.entries()].map(([date, count]) => ({
    date,
    count,
  }));

  return {
    total: inquiries.length,
    last7,
    last30,
    byStatus,
    byService: countBy(inquiries, (i) => i.service),
    byBudget: countBy(inquiries, (i) => i.budget || "Not specified"),
    trend,
  };
}
