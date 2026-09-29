import { ImageResponse } from "next/og";
import { SITE } from "@/lib/data";

/* Social share card for every route (inherited from the app root). Next
   injects the resulting URL as og:image / twitter:image automatically. */

export const alt =
  "Strata — marketing that actually moves your numbers.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/*
 * Design tokens are inlined as literals: this renders on the server through
 * satori, which can't read the CSS custom properties in globals.css. Keep in
 * sync with app/globals.css.
 */
const INK = "#faf9f7";
const FG = "#121314";
const MUT = "#5a5d63";
const ION = "#1f34cf";
const LINE = "rgba(18, 19, 20, 0.10)";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: 80,
          position: "relative",
        }}
      >
        {/* Faint engineering grid — the site's signature backdrop. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${LINE} 1px, transparent 1px), linear-gradient(90deg, ${LINE} 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 24, height: 24, background: ION, borderRadius: 6 }} />
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: "0.34em",
              color: FG,
            }}
          >
            {SITE.name.toUpperCase()}
          </div>
        </div>

        {/* Headline — split so the accent word gets its own colour without
            mixing text nodes inside one element (a satori constraint). */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 74,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: FG,
              maxWidth: 980,
            }}
          >
            Marketing that actually moves your
          </div>
          <div
            style={{
              fontSize: 74,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: ION,
            }}
          >
            numbers.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ fontSize: 26, color: MUT, maxWidth: 780 }}>
            {SITE.tagline}
          </div>
          <div style={{ fontSize: 22, color: MUT }}>{new URL(SITE.url).host}</div>
        </div>
      </div>
    ),
    size
  );
}
