import type { Metadata } from "next";
import { Manrope, IBM_Plex_Mono } from "next/font/google";
import { SITE } from "@/lib/data";
import { rootGraph } from "@/lib/schema";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Preloader } from "@/components/preloader";
import { CookieConsent } from "@/components/cookie-consent";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const title = "AI Marketing Agency | AI SEO, Websites & AI Advertising";
const description =
  "We build AI-powered marketing systems: SEO, websites, AI ad videos, motion graphics, social content and paid advertising.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  /* `default` is the home/fallback title; `template` appends the brand to every
     page that exports a bare title (via lib/seo.ts), so per-page titles never
     hand-repeat "| Strata" and can't double the brand. */
  title: { default: title, template: `%s | ${SITE.name}` },
  description,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport = {
  /* Matches --color-ink so mobile browser chrome blends into the page. */
  themeColor: "#faf9f7",
  colorScheme: "light" as const,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /* `data-scroll-behavior` tells the router to jump, not glide, on route
       change — smooth scrolling is for in-page anchors only. */
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${plexMono.variable}`}
    >
      <body>
        <Preloader />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-md focus:bg-fg focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <CookieConsent />
        <JsonLd data={rootGraph(description)} />
      </body>
    </html>
  );
}
