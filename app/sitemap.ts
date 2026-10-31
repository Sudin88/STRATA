import type { MetadataRoute } from "next";
import { SITE, ROUTES } from "@/lib/data";
import { POSTS } from "@/lib/blog";
import { NEWS } from "@/lib/news";

/* Legal pages are indexable but low-priority — kept out of ROUTES so they
   never leak into primary navigation. */
const LEGAL_ROUTES = ["/privacy", "/terms"] as const;

/* Service sections and detail pages linked beneath the primary nav rather
   than joining ROUTES. /news only joins when there is news to show — an
   empty page in the sitemap is thin content. */
const FOOTER_ROUTES: readonly string[] = NEWS.length > 0 ? ["/news"] : [];
const SERVICE_DETAIL_ROUTES = [
  "/services/event-marketing",
  "/services/experiential-marketing",
  "/services/creative-communications",
  "/services/experience-design",
] as const;

/* Real last-updated date for static pages. Bump when page copy changes;
   blog posts carry their own updated/published dates. Build-time `new
   Date()` stamps every URL identically on every deploy, which makes
   lastmod meaningless to crawlers. */
const LAST_CONTENT_SYNC = "2026-10-31" as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(LAST_CONTENT_SYNC);

  const marketing = ROUTES.map((route) => ({
    url: `${SITE.url}${route === "/" ? "" : route}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: route === "/" ? 1 : route === "/contact" ? 0.9 : 0.8,
  }));

  const posts = POSTS.map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: new Date(post.updated ?? post.published),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const news = FOOTER_ROUTES.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const serviceDetails = SERVICE_DETAIL_ROUTES.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const legal = LEGAL_ROUTES.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  return [...marketing, ...serviceDetails, ...news, ...posts, ...legal];
}
