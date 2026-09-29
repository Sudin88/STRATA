import type { MetadataRoute } from "next";
import { SITE } from "@/lib/data";

/*
 * Web app manifest (served at /manifest.webmanifest). Gives the browser a
 * name, theme, and icons for "Add to Home Screen" / installed-PWA contexts.
 *
 * theme_color / background_color match --color-ink (the page base) so the
 * splash and OS chrome blend with the site, matching the viewport.themeColor
 * set in app/layout.tsx. Icons point at the generated icon routes (app/icon.tsx
 * and app/apple-icon.tsx) at their real rendered sizes — no fabricated assets.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — AI marketing agency`,
    short_name: SITE.name,
    description:
      "AI-powered marketing systems: SEO, websites, AI ad videos, social content, paid advertising and automation.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f7",
    theme_color: "#faf9f7",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
