import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

/*
 * Consent gate is privacy-critical: GA must NOT load until the visitor clicks
 * Accept. These tests lock that contract in.
 *
 * `analyticsCfg` is a hoisted, mutable stand-in for @/lib/analytics so a test
 * can flip GA_ID / isAnalyticsConfigured (the "analytics disabled" path) —
 * the component reads them as live bindings via the getters below.
 */
const CONSENT_KEY = "strata-cookie-consent";
const { analyticsCfg } = vi.hoisted(() => ({
  analyticsCfg: {
    GA_ID: "G-TEST00000" as string | undefined,
    isAnalyticsConfigured: true,
  },
}));

vi.mock("@/lib/analytics", () => ({
  get GA_ID() {
    return analyticsCfg.GA_ID;
  },
  get isAnalyticsConfigured() {
    return analyticsCfg.isAnalyticsConfigured;
  },
  CONSENT_KEY: "strata-cookie-consent",
}));

/* Render next/script as a plain <script> so we can assert GA injection by id
   instead of fighting Next's async script loader in jsdom. We intentionally
   drop `src` (the test asserts by id) so this stub can't trip the
   no-sync-scripts lint rule. */
vi.mock("next/script", () => ({
  default: ({ id, children }: { id?: string; children?: React.ReactNode }) => (
    <script id={id}>{children}</script>
  ),
}));

// The banner is hidden on /dashboard; these tests exercise a marketing route.
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

/* next/link needs no router context here — render a bare anchor. */
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import { CookieConsent } from "@/components/cookie-consent";

const gaLoaded = () => document.getElementById("ga-src") !== null;
const banner = () => screen.queryByRole("dialog", { name: /cookie consent/i });

describe("<CookieConsent />", () => {
  beforeEach(() => {
    window.localStorage.clear();
    analyticsCfg.GA_ID = "G-TEST00000";
    analyticsCfg.isAnalyticsConfigured = true;
  });

  it("shows the banner and does NOT load GA before a choice is made", () => {
    render(<CookieConsent />);
    expect(banner()).toBeInTheDocument();
    expect(gaLoaded()).toBe(false);
  });

  it("loads GA and hides the banner after Accept, persisting the choice", async () => {
    const user = userEvent.setup();
    render(<CookieConsent />);

    await user.click(screen.getByRole("button", { name: /accept/i }));

    expect(window.localStorage.getItem(CONSENT_KEY)).toBe("granted");
    await waitFor(() => expect(gaLoaded()).toBe(true));
    expect(banner()).not.toBeInTheDocument();
  });

  it("does NOT load GA and hides the banner after Decline, persisting the choice", async () => {
    const user = userEvent.setup();
    render(<CookieConsent />);

    await user.click(screen.getByRole("button", { name: /decline/i }));

    expect(window.localStorage.getItem(CONSENT_KEY)).toBe("denied");
    await waitFor(() => expect(banner()).not.toBeInTheDocument());
    expect(gaLoaded()).toBe(false);
  });

  it("respects a stored 'granted' choice: GA loads, no banner", () => {
    window.localStorage.setItem(CONSENT_KEY, "granted");
    render(<CookieConsent />);
    expect(gaLoaded()).toBe(true);
    expect(banner()).not.toBeInTheDocument();
  });

  it("respects a stored 'denied' choice: no GA, no banner", () => {
    window.localStorage.setItem(CONSENT_KEY, "denied");
    render(<CookieConsent />);
    expect(gaLoaded()).toBe(false);
    expect(banner()).not.toBeInTheDocument();
  });

  it("renders nothing (no banner, no GA) when analytics is not configured", () => {
    analyticsCfg.GA_ID = undefined;
    analyticsCfg.isAnalyticsConfigured = false;
    const { container } = render(<CookieConsent />);
    expect(container).toBeEmptyDOMElement();
    expect(gaLoaded()).toBe(false);
  });
});
