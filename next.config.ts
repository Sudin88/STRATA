import type { NextConfig } from "next";
import path from "node:path";

const isDev = process.env.NODE_ENV === "development";

/*
 * The Supabase origin the browser talks to, kept in sync with the client env
 * (NEXT_PUBLIC_SUPABASE_URL) rather than hardcoded — a project migration only
 * needs the env var updated, not this file. We parse to an origin so a stray
 * path/trailing slash in the env can't smuggle extra tokens into the directive;
 * an unset/invalid value simply contributes nothing.
 */
const supabaseOrigin = (() => {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return "";
  try {
    return new URL(raw).origin;
  } catch {
    return "";
  }
})();

/*
 * Content-Security-Policy for a statically-rendered marketing site.
 *
 * We deliberately avoid the nonce/'strict-dynamic' approach: nonces require
 * per-request dynamic rendering (see node_modules/next/dist/docs/01-app/
 * 02-guides/content-security-policy.md), which would disable static
 * optimization and CDN caching for every page. For a brochure site the
 * tradeoff isn't worth it, so we accept 'unsafe-inline' for scripts/styles
 * and lean on the other directives (object-src, base-uri, frame-ancestors)
 * for hardening.
 *
 *   script-src  'unsafe-inline' — Next injects inline bootstrap/hydration
 *               scripts and the layout renders an inline JSON-LD block.
 *               googletagmanager.com serves gtag.js, loaded only after the
 *               visitor accepts cookies (see components/cookie-consent.tsx).
 *               'unsafe-eval' is only needed in dev (React debug tooling).
 *   style-src   'unsafe-inline' — framer-motion sets inline styles and
 *               Tailwind injects a runtime style tag.
 *   img-src     data:/blob: — next/og and canvas/WebGL textures; the GA
 *               domains cover its tracking pixel.
 *   connect-src supabase origin (from NEXT_PUBLIC_SUPABASE_URL) — the contact
 *               form inserts inquiries and the feedback form + reviews wall
 *               read/write reviews over the Supabase REST API; the GA domains
 *               receive analytics beacons; dev also needs ws: for Turbopack HMR.
 *   font-src    'self' — next/font self-hosts Google fonts at build time.
 */
const ga = [
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
];
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${isDev ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' blob: data: https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com`,
  `font-src 'self'`,
  `connect-src 'self'${supabaseOrigin ? ` ${supabaseOrigin}` : ""} ${ga.join(" ")}${isDev ? " ws: wss:" : ""}`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `upgrade-insecure-requests`,
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    /*
     * Pin the workspace root to this project. A stray package-lock.json in a
     * parent directory (here, the home folder) otherwise makes Turbopack infer
     * that parent as the root — the source of the "ignored package-lock.json"
     * build warning, which widens file watching to the whole home directory.
     */
    root: path.join(__dirname),
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
