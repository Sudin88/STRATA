import { ImageResponse } from "next/og";

/*
 * iOS / iPadOS home-screen icon. Same stacked-strata mark as the favicon
 * (app/icon.tsx), rendered large with generous padding so it reads well after
 * Apple applies its own rounded-corner mask. Full-bleed ion background.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const ION = "#1f34cf";

const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="112" height="112" viewBox="0 0 22 22">
  <path d="M3 6.5 11 2l8 4.5-8 4.5z" fill="#ffffff"/>
  <path d="M3 11.5 11 16l8-4.5" fill="none" stroke="#ffffff" stroke-opacity="0.9" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M3 15.5 11 20l8-4.5" fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const markDataUri = `data:image/svg+xml;base64,${Buffer.from(markSvg).toString("base64")}`;

export default function AppleIcon() {
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
        }}
      >
        <img src={markDataUri} width={112} height={112} alt="" />
      </div>
    ),
    { ...size }
  );
}
