import type { TrendPoint } from "@/lib/dashboard/metrics";

const labelFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

/*
 * A CSS bar sparkline of daily lead counts. No charting dependency and no
 * smoothing: quiet days are real zero-height gaps, which is the honest picture
 * while volume is low. Each bar carries its date + count as a title tooltip.
 */
export function LeadsTrend({ trend }: { trend: TrendPoint[] }) {
  const max = trend.reduce((m, p) => Math.max(m, p.count), 0);
  const total = trend.reduce((sum, p) => sum + p.count, 0);
  const first = trend[0];
  const last = trend[trend.length - 1];

  return (
    <div className="hairline rounded-card border border-line bg-surface p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xs font-semibold tracking-wide text-mut uppercase">
          Leads over time
        </h2>
        <span className="text-xs text-dim">
          {total} in {trend.length} days
        </span>
      </div>

      <div
        className="mt-4 flex h-24 items-end gap-px"
        role="img"
        aria-label={`Daily leads for the last ${trend.length} days: ${total} total.`}
      >
        {trend.map((point) => (
          <div
            key={point.date}
            title={`${point.date}: ${point.count}`}
            className="flex-1 rounded-t-sm bg-ion-soft"
            style={{
              // A hairline baseline (min height) keeps empty days visible as a
              // track without implying a count they don't have.
              height:
                max > 0 && point.count > 0
                  ? `${Math.max((point.count / max) * 100, 8)}%`
                  : "2px",
              backgroundColor:
                point.count > 0 ? "var(--color-ion)" : "var(--color-line)",
            }}
          />
        ))}
      </div>

      {first && last && (
        <div className="mt-2 flex justify-between text-xs text-dim tabular-nums">
          <span>{labelFmt.format(new Date(first.date))}</span>
          <span>{labelFmt.format(new Date(last.date))}</span>
        </div>
      )}
    </div>
  );
}
