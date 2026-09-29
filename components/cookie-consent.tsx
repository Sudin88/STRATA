"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { Cookie } from "lucide-react";
import Link from "next/link";
import {
  GA_ID,
  isAnalyticsConfigured,
  CONSENT_KEY,
  type ConsentChoice,
} from "@/lib/analytics";

/*
 * Consent is external state (localStorage), so we read it with
 * useSyncExternalStore rather than an effect: it gives a stable server
 * snapshot (undecided) and swaps to the real value on the client with no
 * hydration mismatch and no cascading setState-in-effect.
 */
const listeners = new Set<() => void>();

function readConsent(): ConsentChoice | null {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  // Sync the choice across tabs.
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function setConsent(next: ConsentChoice) {
  try {
    window.localStorage.setItem(CONSENT_KEY, next);
  } catch {
    /* ignore — the notify below still updates this tab for the session */
  }
  listeners.forEach((l) => l());
}

/*
 * Cookie consent gate for Google Analytics 4.
 *
 * GA sets first-party cookies, so under GDPR/ePrivacy it needs prior, explicit
 * consent. We take the strict route: no GA script is injected — and therefore
 * no request to Google and no cookie — until the visitor clicks Accept.
 * Declining loads nothing. The choice is remembered so the banner shows once.
 */
export function CookieConsent() {
  const choice = useSyncExternalStore(
    subscribe,
    readConsent,
    () => null, // server snapshot: always undecided
  );
  const pathname = usePathname();

  // Nothing renders (no banner, no GA) unless a measurement ID is configured.
  if (!isAnalyticsConfigured || !GA_ID) return null;
  // The dashboard is a bare authenticated surface — no marketing chrome.
  if (pathname.startsWith("/dashboard")) return null;

  const loadGa = choice === "granted";

  return (
    <>
      {loadGa && (
        <>
          <Script
            id="ga-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
gtag('config', '${GA_ID}');`}
          </Script>
        </>
      )}

      {choice === null && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Cookie consent"
          className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-2xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:left-auto sm:w-[26rem]"
        >
          <div className="glass hairline rounded-card border border-line p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-line text-ion">
                <Cookie className="size-4" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-fg">
                  We use cookies for analytics
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-mut">
                  With your OK, we use Google Analytics to understand how the
                  site&apos;s used. Decline and nothing gets loaded. See our{" "}
                  <Link href="/privacy" className="text-ion underline underline-offset-2">
                    privacy policy
                  </Link>
                  .
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setConsent("granted")}
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-pill bg-fg px-5 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_rgba(18,19,20,0.32)]"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => setConsent("denied")}
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-pill border border-line-strong px-5 text-sm font-semibold transition-colors hover:border-ion/60 hover:bg-ion-soft"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
