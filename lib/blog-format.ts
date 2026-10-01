/**
 * Formats a date-only post date (YYYY-MM-DD) as e.g. "October 1, 2026".
 * Pinned to UTC so a server in any timezone renders the same day the string
 * names — a date-only value parses as UTC midnight, which a local-time format
 * could otherwise roll back to the previous day.
 */
export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
