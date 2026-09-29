import type { Metadata } from "next";
import { SITE } from "@/lib/data";

/**
 * Builds per-route metadata with a canonical URL plus matching Open Graph and
 * Twitter cards. Pass `path` as a root-relative route and `title` WITHOUT the
 * brand — the document <title> gets "| Strata" appended by the layout's
 * title.template, so repeating it here would double the brand.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  // OG/Twitter titles do NOT inherit title.template, so brand them explicitly.
  const ogTitle = `${title} | ${SITE.name}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle,
      description,
      url: `${SITE.url}${path === "/" ? "" : path}`,
      siteName: SITE.name,
      type: "website",
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title: ogTitle, description },
  };
}
