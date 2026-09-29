import { ImageResponse } from "next/og";

/*
 * Browser-tab favicon. Reproduces the stacked-strata LogoMark
 * (components/ui/logo.tsx) in white on the ion accent so it stays legible at
 * 16–32px, where the light-background wordmark version would wash out. Tokens
 * are inlined because satori can't read CSS variables (same as the OG image).
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const ION = "#1f34cf";

/* The mark scaled into a rounded ion tile; strokes thickened vs. the on-page
   logo so the two lower layers survive downscaling to a favicon. */
const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 22 22">
  <path d="M3 6.5 11 2l8 4.5-8 4.5z" fill="#ffffff"/>
  <path d="M3 11.5 11 16l8-4.5" fill="none" stroke="#ffffff" stroke-opacity="0.9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M3 15.5 11 20l8-4.5" fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const markDataUri = `data:image/svg+xml;base64,${Buffer.from(markSvg).toString("base64")}`;

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: ION,
          borderRadius: 7,
        }}
      >
        <img src={markDataUri} width={32} height={32} alt="" />
      </div>
    ),
    { ...size }
  );
}
