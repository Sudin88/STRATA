/*
 * A single Overview metric: big value, label, and an optional sub-line. Purely
 * presentational — every number handed to it is computed from real rows.
 */
export function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="hairline rounded-card border border-line bg-surface p-5">
      <p className="text-xs font-semibold tracking-wide text-mut uppercase">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-fg tabular-nums">
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-dim">{sub}</p>}
    </div>
  );
}
