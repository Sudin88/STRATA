import type { Slice } from "@/lib/dashboard/metrics";

/*
 * Horizontal bars sized as a share of the largest slice (relative, not % of
 * total — it's a comparison, not a pie). Bars are CSS-width only; no charting
 * dependency. Honest empty state when there's nothing to break down yet.
 */
export function BarBreakdown({
  title,
  slices,
  emptyLabel = "No data yet.",
}: {
  title: string;
  slices: Slice[];
  emptyLabel?: string;
}) {
  const max = slices.reduce((m, s) => Math.max(m, s.count), 0);

  return (
    <div className="hairline rounded-card border border-line bg-surface p-5">
      <h2 className="text-xs font-semibold tracking-wide text-mut uppercase">
        {title}
      </h2>
      {slices.length === 0 ? (
        <p className="mt-4 text-sm text-dim">{emptyLabel}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {slices.map((slice) => (
            <li key={slice.label}>
              <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate text-fg">{slice.label}</span>
                <span className="shrink-0 font-mono text-xs text-mut tabular-nums">
                  {slice.count}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-pill bg-raise">
                <div
                  className="h-full rounded-pill bg-ion"
                  style={{
                    width: `${max > 0 ? (slice.count / max) * 100 : 0}%`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
