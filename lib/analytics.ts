/*
 * Google Analytics 4 configuration.
 *
 * The measurement ID is PUBLIC (it ships in the client bundle by design), so
 * it's a NEXT_PUBLIC_ var. GA is only ever loaded after the visitor accepts
 * cookies — see components/cookie-consent.tsx — so nothing here runs, and no
 * GA cookies are set, until then. Leave the env var unset to disable analytics
 * (and the cookie banner) entirely.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/** True only when a measurement ID is configured. */
export const isAnalyticsConfigured = Boolean(GA_ID);

/** localStorage key holding the visitor's cookie choice. */
export const CONSENT_KEY = "strata-cookie-consent";

export type ConsentChoice = "granted" | "denied";
