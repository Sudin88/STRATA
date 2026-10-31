#!/usr/bin/env node

/**
 * Deploy-verification smoke test.
 *
 * The failure mode this guards against: work merges and pushes, but
 * production keeps serving a stale build (seen live on 2026-10-31 — sitemap
 * served 15 URLs and every new page 404'd for hours after the push). This
 * script reads what the live site actually serves and fails loudly when it
 * is stale, missing, or unreachable.
 *
 * Dependency-free by design: Node >= 20 (which Next.js requires anyway) and
 * global fetch — no packages to install, so it also runs on bare CI runners.
 *
 *   npm run verify:deploy
 *       → verifies production (the default below).
 *
 *   npm run verify:deploy -- --base=https://<hash>.vercel.app
 *   VERIFY_BASE_URL=... node scripts/verify-deploy.mjs
 *       → verifies a specific deploy (Vercel preview, staging, local dev).
 *
 * Checks:
 *   1. /sitemap.xml is reachable and parses to >= MIN_SITEMAP_URLS URLs.
 *      (A stale deploy shows up here first: committed routes missing from
 *      the live sitemap.)
 *   2. Required money pages are listed in the sitemap.
 *   3. Deindexed pages are NOT listed — an accidental revert reintroducing
 *      thin pages fails loudly instead of silently.
 *   4. Every listed URL returns HTTP 200 when fetched.
 *
 * Exits 0 green, 1 with a per-URL report otherwise.
 */

const PROD_BASE = "https://www.strata-agency.me";

/* Compared by pathname, not full URL, so the same check works against a
   preview deploy — sitemap <loc> origins are hard-coded to production while
   the page itself is fetched from whichever base run is being tested. */
const REQUIRED_IN_SITEMAP = [
  "/",
  "/services/event-marketing",
  "/services/experiential-marketing",
  "/services/creative-communications",
  "/services/experience-design",
  "/services/event-marketing/checklist",
  "/compare/ai-marketing-agency-vs-traditional-agency",
];

/* Intentionally out of the sitemap (/feedback is deindexed, /news is
   noindexed while empty). If one reappears, a reindexing regression is the
   most likely cause — worth failing over. */
const FORBIDDEN_IN_SITEMAP = ["/feedback"];

/* Not in the sitemap by design, but the pages must still exist and answer. */
const EXTRA_STATUS_CHECKS = ["/feedback", "/news"];

/* 32 URLs as of 2026-10-31. Deliberately a floor, not an exact count, so
   adding posts doesn't demand a script edit — losing URLs still fails. */
const MIN_SITEMAP_URLS = 30;

const REQUEST_TIMEOUT_MS = 15_000;

/* ---------- helpers ---------- */

function base() {
  const arg = process.argv
    .slice(2)
    .find((a) => a.startsWith("--base="));
  const raw =
    arg?.slice("--base=".length) || process.env.VERIFY_BASE_URL || PROD_BASE;
  try {
    // Origin-only: every check below is pathname-based.
    return new URL(raw).origin;
  } catch {
    console.error(
      `Invalid base URL: "${raw}" — pass an absolute origin, e.g. --base=https://example.vercel.app`
    );
    process.exit(1);
  }
}

/** Fetch a URL and return { status, error }; status is 0 on network errors. */
async function statusOf(url) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    await res.arrayBuffer().catch(() => {}); // drain so sockets don't linger
    return { status: res.status, error: null };
  } catch (err) {
    const reason =
      err?.name === "TimeoutError"
        ? `timeout after ${REQUEST_TIMEOUT_MS / 1000}s`
        : (err?.cause?.code ?? err?.message ?? "unknown network error");
    return { status: 0, error: reason };
  }
}

/* ---------- main ---------- */

const origin = base();
console.log(`\nVerifying deploy at ${origin}\n`);

const sitemapUrl = `${origin}/sitemap.xml`;
const sitemapRes = await statusOf(sitemapUrl);

if (sitemapRes.status !== 200) {
  console.error(
    `✗ /sitemap.xml is unreachable — got HTTP ${sitemapRes.status || "no response"}` +
      (sitemapRes.error ? ` (${sitemapRes.error})` : "")
  );
  console.error(
    "  The deploy is stale, deleted, or the base URL is wrong. Nothing further to verify."
  );
  process.exit(1);
}

const xml = await (await fetch(sitemapUrl)).text();
const paths = [
  ...new Set(
    [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) => {
      try {
        return new URL(m[1].trim()).pathname;
      } catch {
        return m[1].trim();
      }
    })
  ),
];

const problems = [];

/* Size */
if (paths.length < MIN_SITEMAP_URLS) {
  problems.push(
    `sitemap lists ${paths.length} URLs — expected >= ${MIN_SITEMAP_URLS} (likely a stale deploy)`
  );
}

/* Required pages present */
const listedSet = new Set(paths);
for (const required of REQUIRED_IN_SITEMAP) {
  if (!listedSet.has(required)) {
    problems.push(`required page missing from sitemap: ${required}`);
  }
}

/* Deindex guards */
for (const forbidden of FORBIDDEN_IN_SITEMAP) {
  if (listedSet.has(forbidden)) {
    problems.push(
      `deindexed page is back in the sitemap: ${forbidden} (check for a reverted noindex)`
    );
  }
}

/* Every listed URL answers */
const statusTargets = [...paths, ...EXTRA_STATUS_CHECKS];
const results = await Promise.all(
  statusTargets.map(async (path) => ({ path, ...(await statusOf(`${origin}${path}`)) }))
);
for (const r of results) {
  if (r.status !== 200) {
    problems.push(
      `${r.path} returned ${r.status === 0 ? "no response" : r.status}` +
        (r.error ? ` (${r.error})` : "")
    );
  }
}

/* Report */
const allRows = [...results];
const width = Math.min(
  72,
  Math.max(...allRows.map((r) => r.path.length))
);
for (const r of allRows) {
  const mark = r.status === 200 ? "✓" : "✗";
  const path = r.path.length > width ? r.path.slice(0, width - 1) + "…" : r.path;
  console.log(
    `  ${mark} ${path.padEnd(width)}  ${r.status === 0 ? `ERR ${r.error}` : r.status}`
  );
}

console.log("");
console.log(
  `  Sitemap: ${paths.length} URLs (required >= ${MIN_SITEMAP_URLS})`
);
console.log(
  `  Required pages: ${REQUIRED_IN_SITEMAP.length - problems.filter((p) => p.startsWith("required page missing")).length}/${REQUIRED_IN_SITEMAP.length} listed`
);
for (const forbidden of FORBIDDEN_IN_SITEMAP) {
  const state = listedSet.has(forbidden) ? "PRESENT — regression" : "absent";
  console.log(`  Deindex guard ${forbidden}: ${state}`);
}
console.log(
  `  HTTP checks: ${results.length - results.filter((r) => r.status !== 200).length}/${results.length} returned 200`
);

if (problems.length > 0) {
  console.error(`\nFAIL — deploy verification failed:`);
  for (const p of problems) console.error(`  • ${p}`);
  process.exit(1);
}

console.log(`\nPASS — ${origin} serves the current site: all checks green.\n`);
