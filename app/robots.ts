import type { MetadataRoute } from "next";
import { SITE } from "@/lib/data";

/*
 * Crawler policy. The whole site is public marketing content we WANT indexed,
 * so everything is allowed. We spell out the AI crawlers explicitly rather than
 * leaning on the "*" wildcard for two reasons:
 *
 *  1. AI *search* bots (OAI-SearchBot for ChatGPT, PerplexityBot, and Google's
 *     Google-Extended) are how we get surfaced and cited in AI answers — the
 *     GEO channel. We never want a future blanket rule to accidentally cut them
 *     off, so they get their own always-allowed block.
 *  2. AI *training* crawlers (GPTBot, ClaudeBot, CCBot, Applebot-Extended) are
 *     a separate business decision from being findable. Today we allow them too
 *     — being in training corpora only helps a new brand's discoverability — but
 *     they live in their own block so opting out later is a one-line `disallow`
 *     change per agent, with no effect on the search bots above.
 *
 * `host` names the canonical origin so crawlers coalesce www/non-www variants.
 */
const AI_SEARCH_BOTS = ["OAI-SearchBot", "PerplexityBot", "Google-Extended"];
const AI_TRAINING_BOTS = ["GPTBot", "ClaudeBot", "CCBot", "Applebot-Extended"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_SEARCH_BOTS, allow: "/" },
      { userAgent: AI_TRAINING_BOTS, allow: "/" },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
