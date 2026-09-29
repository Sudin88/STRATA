import type { MetadataRoute } from "next";
import { SITE, ROUTES } from "@/lib/data";

/* Legal pages are indexable but low-priority — kept out of ROUTES so they
   never leak into primary navigation. */
const LEGAL_ROUTES = ["/privacy", "/terms"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const marketing = ROUTES.map((route) => ({
    url: `${SITE.url}${route === "/" ? "" : route}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: route === "/" ? 1 : route === "/contact" ? 0.9 : 0.8,
  }));

  const legal = LEGAL_ROUTES.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  return [...marketing, ...legal];
}
