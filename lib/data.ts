export const SITE = {
  name: "Strata",
  tagline: "AI on the busywork. People on the decisions that matter.",
  url: "https://strata-ai.net",
  email: "strata.agency.co@gmail.com",
  phone: "+977 9769684556",
  location: "Kathmandu, Nepal. Working worldwide",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/strata.agency.ai/" },
  ],
} as const;

export const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "Pricing", href: "/pricing" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Feedback", href: "/feedback" },
  { label: "Contact", href: "/contact" },
] as const;

/** Every indexable route, used by the navbar, footer and sitemap. */
export const ROUTES = ["/", "/services", "/process", "/pricing", "/work", "/about", "/feedback", "/contact"] as const;

/**
 * Icon is stored as a key, not a component, so service data stays
 * serializable across the server/client boundary. Keys are resolved
 * by the registry in components/service-icon.tsx.
 */
export type ServiceIconKey =
  | "seo"
  | "web"
  | "video"
  | "motion"
  | "social"
  | "ads"
  | "automation";

export interface Service {
  id: ServiceIconKey;
  index: string;
  title: string;
  description: string;
  features: string[];
  cta: string;
  /** Listed for interest but not yet deliverable — shown as "Coming soon". */
  comingSoon?: boolean;
}

export const SERVICES: Service[] = [
  {
    id: "seo",
    index: "S.01",
    title: "AI SEO & Content",
    description:
      "Show up when people search for what you sell. AI speeds up the research and first drafts; we handle the strategy, the editing and the technical side that actually makes it rank.",
    features: [
      "AI SEO strategy",
      "Keyword research",
      "Content strategy",
      "SEO articles",
      "Landing page copy",
      "Technical SEO",
      "On-page optimization",
      "Content optimization",
    ],
    cta: "Explore SEO",
  },
  {
    id: "web",
    index: "S.02",
    title: "Website Design & Development",
    description:
      "We design and build sites that load fast, look sharp and turn visitors into customers, not something pretty that just sits there.",
    features: [
      "UI/UX design",
      "Landing pages",
      "Business websites",
      "E-commerce",
      "Web applications",
      "Responsive development",
      "CMS integration",
      "Performance optimization",
    ],
    cta: "Build My Website",
  },
  {
    id: "video",
    index: "S.03",
    title: "AI Ad Videos",
    description:
      "Ad videos that stop the scroll, made with AI production and a real creative eye, plus enough variations to find out what actually works.",
    features: [
      "AI video generation",
      "Product advertisements",
      "Social media ads",
      "Short-form videos",
      "Video scripts",
      "Voiceovers",
      "Creative variations",
    ],
    cta: "Create an Ad",
  },
  {
    id: "motion",
    index: "S.04",
    title: "Motion Graphics",
    description:
      "Animation that makes your brand move: logo stings, explainer videos, kinetic type and animated ads that turn a static idea into something people actually stop to watch.",
    features: [
      "Logo animation",
      "Explainer videos",
      "Kinetic typography",
      "Animated ads",
      "Brand intros & outros",
      "Product animation",
      "Social motion graphics",
      "Storyboarding",
    ],
    cta: "Animate My Brand",
  },
  {
    id: "social",
    index: "S.05",
    title: "AI Social Media",
    description:
      "Show up consistently without burning out. We plan and produce your social content with AI, so the feed stays active and on-brand.",
    features: [
      "Content calendars",
      "Social posts",
      "Reels",
      "Captions",
      "Creative concepts",
      "AI visuals",
      "Community content strategy",
    ],
    cta: "Grow My Socials",
  },
  {
    id: "ads",
    index: "S.06",
    title: "Paid Advertising",
    description:
      "Ad spend that earns its keep. We run search and social campaigns, test the creative constantly and put the budget where the results are.",
    features: [
      "Google Ads",
      "Meta Ads",
      "Campaign strategy",
      "Ad creatives",
      "A/B testing",
      "Retargeting",
      "Conversion tracking",
      "Performance optimization",
    ],
    cta: "Scale My Ads",
  },
  {
    id: "automation",
    index: "S.07",
    title: "AI Marketing Automation",
    description:
      "Hand the repetitive stuff to software. We build the chatbots, follow-ups and workflows that keep working while you sleep.",
    features: [
      "Lead automation",
      "AI chatbots",
      "CRM workflows",
      "Email automation",
      "Lead qualification",
      "Reporting",
      "Customer follow-up",
    ],
    cta: "Automate My Growth",
    comingSoon: true,
  },
];

interface Project {
  index: string;
  name: string;
  industry: string;
  services: string[];
  challenge: string;
  solution: string;
  hue: string; // panel gradient tint
}

/**
 * Real client work, published only with the client's approval. Empty for now —
 * we're a new agency taking on our first engagements. The Work section renders
 * an honest "nothing published yet" state until this fills up.
 */
export const PROJECTS: Project[] = [];

export const PROCESS_STEPS = [
  {
    index: "01",
    title: "Discover",
    body: "We get to know your business, your customers and what winning actually looks like for you.",
  },
  {
    index: "02",
    title: "Strategize",
    body: "We figure out where to focus first, and where AI gives you the biggest head start.",
  },
  {
    index: "03",
    title: "Create",
    body: "We build the pieces: the site, the content, the campaigns, the creative.",
  },
  {
    index: "04",
    title: "Launch",
    body: "We put it live and make sure everything's tracked, so we can tell what's working.",
  },
  {
    index: "05",
    title: "Optimize",
    body: "We read the data, keep what works, cut what doesn't, and improve from there.",
  },
] as const;

interface PricingTier {
  name: string;
  audience: string;
  price: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

export const PRICING: PricingTier[] = [
  {
    name: "Starter",
    audience: "For small businesses just getting going",
    price: "Custom pricing",
    features: ["SEO foundation", "Landing page", "AI content", "Basic analytics"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Growth",
    audience: "For businesses ready to push harder",
    price: "Custom pricing",
    features: [
      "Website",
      "SEO",
      "AI ad creative",
      "Social content",
      "Paid advertising strategy",
      "Analytics",
    ],
    cta: "Choose Growth",
    highlighted: true,
  },
  {
    name: "Scale",
    audience: "For teams going all-in on growth",
    price: "Custom pricing",
    features: [
      "Advanced SEO",
      "Website development",
      "AI video production",
      "Motion graphics",
      "Paid ads",
      "Conversion optimization",
      "Strategy",
    ],
    cta: "Let's Talk",
    highlighted: false,
  },
];

export const FAQS = [
  {
    q: "What services do you offer?",
    a: "Seven, really: AI-assisted SEO and content, website design and development, AI ad videos, motion graphics, social media and paid advertising, with AI marketing automation coming soon. The point is they work together as one engagement, not separate projects that never talk to each other.",
  },
  {
    q: "How does AI improve marketing?",
    a: "It takes the slow, expensive parts off your plate (research, first drafts, creative variations, reporting) so more of your budget goes into strategy and testing. In practice that means more experiments each month, faster feedback and decisions based on data instead of hunches.",
  },
  {
    q: "Can you build my website from scratch?",
    a: "Yes: strategy, design, copy, development and launch, all of it. We build on modern frameworks, make sure the site is fast and search-friendly, and set it up so you can update content yourself without calling a developer every time.",
  },
  {
    q: "Can you create AI advertising videos?",
    a: "Yes. We pair AI video generation with a human creative director: scripts, voiceover, motion graphics and cuts sized for Meta, TikTok, YouTube and the rest, with a few variations so you can test what lands.",
  },
  {
    q: "Do you work with small businesses?",
    a: "Definitely. Our Starter plan is made for local and small businesses that need the basics done well (a fast site, local SEO, steady content) without an enterprise-sized invoice.",
  },
  {
    q: "How long does a website take?",
    a: "A focused landing page is usually 2–3 weeks. A full business site tends to run 4–8 weeks, depending on how big it is, how ready your content is and what needs integrating. Either way, we agree on the timeline before we start.",
  },
  {
    q: "Can you manage SEO monthly?",
    a: "Yes. Ongoing SEO means we keep producing content, watching the technical side and tuning pages, plus a monthly report, with priorities reshuffled around whatever the data says is working.",
  },
  {
    q: "Can you manage paid advertising?",
    a: "Yes. Google and Meta, start to finish: strategy, creative, tracking, testing and optimization. And you get straight reporting on what your spend is actually bringing back.",
  },
  {
    q: "Can you integrate AI automation?",
    a: "It's on the way. AI marketing automation (chatbots, CRM workflows, email sequences and lead qualification) is a service we're building out and it isn't available just yet. Tell us on the contact form if you want it, and we'll let you know the moment it's ready.",
  },
  {
    q: "How do we get started?",
    a: "Send us a project inquiry through the contact form, or book a strategy call. We'll go through your goals, point out where AI can give you the biggest edge and send a clear proposal. No obligation, no pressure.",
  },
] as const;
