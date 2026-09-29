import { SITE, SERVICES, NAV_LINKS } from "@/lib/data";

/**
 * schema.org JSON-LD builders. Centralized so every page emits structured data
 * that entity-links back to ONE Organization node via `@id`. That cross-linking
 * — not the individual rich-result types — is what makes search engines and AI
 * answer engines treat the site as a single brand entity instead of a pile of
 * unrelated pages.
 *
 * We describe only what is real. No Review/AggregateRating (no genuine reviews
 * yet), no priced Offer (pricing is scoped per project, not a fixed number), and
 * no HowTo (deprecated as a rich result and a poor fit for an engagement flow).
 * Adding any of those would be fabricated structured data — a spam signal, not a
 * ranking boost.
 */

type Json = Record<string, unknown>;

/** Stable @ids so nodes on any page can reference the same entities. */
export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

/** Absolute URL for a root-relative path, collapsing the home "/" to the origin. */
function abs(path: string): string {
  return `${SITE.url}${path === "/" ? "" : path}`;
}

/**
 * The brand entity. Uses ProfessionalService (a LocalBusiness subtype) so the
 * NAP block and areaServed carry local-business meaning. `logo`/`image` point at
 * the framework-generated icon and OG image routes — both real, always-present.
 */
export function organizationNode(description: string): Json {
  return {
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: SITE.name,
    description,
    url: SITE.url,
    email: SITE.email,
    telephone: SITE.phone,
    image: `${SITE.url}/opengraph-image`,
    logo: `${SITE.url}/icon`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kathmandu",
      addressCountry: "NP",
    },
    areaServed: "Worldwide",
    // Every entry in SITE.socials is a live, official profile (placeholders were
    // removed), so all of them belong in sameAs.
    sameAs: SITE.socials.map((s) => s.href),
    knowsAbout: [
      "AI SEO",
      "Website development",
      "AI advertising video",
      "Social media marketing",
      "Paid advertising",
      "Marketing automation",
    ],
  };
}

/** The site itself, publisher-linked to the org. hasPart lists the top nav. */
export function websiteNode(): Json {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE.url,
    name: SITE.name,
    publisher: { "@id": ORG_ID },
    hasPart: NAV_LINKS.map((link) => ({
      "@type": "WebPage",
      name: link.label,
      url: abs(link.href),
    })),
  };
}

/** Root @graph rendered once in the layout: brand entity + site. */
export function rootGraph(description: string): Json {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode(description), websiteNode()],
  };
}

/**
 * BreadcrumbList for an interior page. The trail always starts at Home, matching
 * the visible breadcrumb in PageHero, so the markup and the UI agree.
 */
function breadcrumbNode(breadcrumb: string, path: string): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: breadcrumb, item: abs(path) },
    ],
  };
}

/** FAQPage from real Q&A copy. Emit only the entries actually shown on the page. */
export function faqPageSchema(faqs: readonly { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** OfferCatalog of the six services, each provided by the org entity. */
export function serviceCatalogSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: `${SITE.name} services`,
    itemListElement: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.title,
        description: s.description,
        serviceType: s.title,
        provider: { "@id": ORG_ID },
        areaServed: "Worldwide",
      },
    })),
  };
}

/**
 * Standard graph for an interior page: a WebPage node linked to the site and the
 * brand, its breadcrumb trail, and any page-specific nodes (FAQPage, catalog…)
 * passed in via `extra`. Rendered once per page with <JsonLd>.
 */
export function pageGraph({
  path,
  name,
  description,
  breadcrumb,
  type = "WebPage",
  extra = [],
}: {
  path: string;
  name: string;
  description: string;
  breadcrumb: string;
  /** A more specific WebPage subtype (e.g. AboutPage, ContactPage) when it fits. */
  type?: string;
  extra?: Json[];
}): Json {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type,
        "@id": `${abs(path)}/#webpage`,
        url: abs(path),
        name,
        description,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORG_ID },
        breadcrumb: breadcrumbNode(breadcrumb, path),
      },
      ...extra,
    ],
  };
}
