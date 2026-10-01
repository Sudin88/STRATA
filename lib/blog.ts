import type { ComponentType } from "react";
import * as aiSeo from "@/content/blog/ai-seo";
import * as geo from "@/content/blog/generative-engine-optimization";
import * as aiAdVideos from "@/content/blog/ai-ad-videos";
import * as googleAiContent from "@/content/blog/does-google-penalize-ai-content";

/**
 * Blog registry. Each post is a module under content/blog/ that exports a
 * `meta` object and a default `Body` component (the article as JSX). Posts are
 * authored by the Strata organization entity, not an invented person — so the
 * BlogPosting schema's author/publisher both resolve to the real brand @id and
 * nothing here fabricates a byline, bio or credential.
 *
 * To publish a new post: add content/blog/<slug>.tsx, then import it and append
 * it to `modules` below. The listing, sitemap and JSON-LD pick it up for free.
 */

export interface PostFaq {
  q: string;
  a: string;
}

export interface PostMeta {
  /** URL segment: /blog/<slug>. Keep it kebab-case and stable once published. */
  slug: string;
  /** Document <title> WITHOUT the brand — layout's title.template appends "| Strata". */
  title: string;
  /** On-page H1. May differ from the <title> to read naturally on the page. */
  heading: string;
  /** Meta description, listing excerpt and the article's standfirst. */
  description: string;
  /** Primary keyword, shown as the category eyebrow and used in schema keywords. */
  keyword: string;
  /** ISO date (YYYY-MM-DD) the post was first published. */
  published: string;
  /** ISO date of the last substantive edit. Defaults to `published`. */
  updated?: string;
  /** Rough read time in minutes, shown in the byline. */
  readingMinutes: number;
  /** Optional FAQ block rendered at the foot of the article and as FAQPage schema. */
  faqs?: readonly PostFaq[];
}

export interface Post extends PostMeta {
  Body: ComponentType;
}

/** Every published post module. Add new posts here. */
const modules: { meta: PostMeta; default: ComponentType }[] = [googleAiContent, aiAdVideos, geo, aiSeo];

/** Posts, newest first. */
export const POSTS: Post[] = modules
  .map((m) => ({ ...m.meta, Body: m.default }))
  .sort((a, b) => b.published.localeCompare(a.published));

export const POST_SLUGS: string[] = POSTS.map((p) => p.slug);

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
