/**
 * Company news registry, consumed by /news. Entries are real announcements
 * only: capabilities shipped, projects signed off with the client's approval,
 * public appearances. Nothing is invented to make the section look active —
 * the page renders an honest empty state until there's something to publish.
 *
 * To publish an entry: append here. The page, footer link and sitemap pick it
 * up with no further changes.
 */
export interface NewsEntry {
  /** URL-safe id, doubles as the /news#<id> anchor. Kebab-case, stable once published. */
  id: string;
  kind: "announcement" | "press" | "update";
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD) the news was published. */
  date: string;
}

export const NEWS: NewsEntry[] = [];
