"use client";

import { useEffect } from "react";

/**
 * Global error boundary — the last line of defense. It only renders when the
 * root layout or template itself throws, so it REPLACES that layout and must
 * ship its own <html>/<body>. Next does not apply global styles here (see
 * node_modules/next/dist/docs/.../error.md), so every style is inline and the
 * brand tokens from app/globals.css are hard-coded to keep the fallback on-brand
 * without depending on the stylesheet. `retry()` is the stable Next 16.3+ prop.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "#faf9f7",
          color: "#121314",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          textAlign: "center",
        }}
      >
        {/* metadata exports aren't allowed in error boundaries; set the tab
            title with React's <title> instead. */}
        <title>Something went wrong | Strata</title>
        <div style={{ maxWidth: "30rem" }}>
          <p
            style={{
              margin: "0 0 1.25rem",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#1f34cf",
            }}
          >
            Something broke
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              fontWeight: 600,
            }}
          >
            The site hit an unexpected error.
          </h1>
          <p
            style={{
              margin: "1.5rem 0 0",
              fontSize: "1rem",
              lineHeight: 1.6,
              color: "#5a5d63",
            }}
          >
            Sorry about that. It&apos;s on us, not you. Try reloading, and if it
            keeps happening, please get in touch.
          </p>
          <button
            onClick={retry}
            style={{
              marginTop: "2.25rem",
              minHeight: "3rem",
              padding: "0.75rem 1.75rem",
              borderRadius: "999px",
              border: "none",
              background: "#121314",
              color: "#faf9f7",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
