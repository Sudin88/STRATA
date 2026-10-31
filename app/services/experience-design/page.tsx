import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ParticleField } from "@/components/ui/particle-field";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Cta } from "@/components/cta";
import { pageMetadata } from "@/lib/seo";
import { pageGraph, serviceOfferSchema, faqPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/json-ld";

const title = "Experience Design: Landing Pages, Microsites & Journeys";
const description =
  "Campaign experience design: landing pages, microsites, email journeys and conversion paths — built engaging enough to finish and instrumented enough to improve.";

const SERVICE_NAME = "Experience Design";

export const metadata = pageMetadata({
  title,
  description,
  path: "/services/experience-design",
});

const FAQS = [
  {
    q: "How is experience design different from your website work?",
    a: "The website is the always-on face of the business, built and maintained for the long run. Experience design is what we build around a campaign: the landing page an ad points to, the microsite for an event or launch, the email journey that follows a sign-up. Same design craft, shorter decks, pointed at one decision at a time — and explicitly built to be measured.",
  },
  {
    q: "What does 'tested the whole way' actually mean?",
    a: "Instrumentation is part of the design, not an afterthought: conversion events set up before launch, so the first variant's numbers are real. From there it's standard practice — headline and layout variants, traffic split by source, and changes promoted only when they beat the incumbent. Small, honest improvements beat one redesign a year.",
  },
  {
    q: "Can we edit things ourselves afterwards?",
    a: "Yes — that's the standard we build to. Pages ship in a CMS or with clearly separated content blocks, so your team can swap copy and images without calling a developer. We set it up, hand over the keys and show the team how it works; nobody should be dependent on us to change a headline.",
  },
  {
    q: "How fast can a landing page go live?",
    a: "A focused, one-goal landing page is usually days, not weeks, including copy and tracking. A microsite with several sections and integrations runs a couple of weeks. We'll give you the estimate before starting rather than after — the timeline agreement happens at kickoff, when scope is still negotiable.",
  },
] as const;

const CAPABILITIES = [
  {
    title: "Landing page systems",
    body: "Pages engineered around one decision: one message, one offer, one action. Fast enough to survive a paid click and clear enough to survive a glance.",
  },
  {
    title: "Microsites & campaign hubs",
    body: "Event, launch or report hubs with their own navigation and narrative — contained experiences that rank, stay up and keep working as evergreen assets.",
  },
  {
    title: "Conversion UX & CRO",
    body: "Wireframed around the journey you're asking someone to complete, then tested: variants, traffic splits, and changes promoted on evidence rather than taste.",
  },
  {
    title: "Email journeys",
    body: "Sequences structured around a skeleton of where the reader is up to — welcome, nurture, win-back — written as journeys, not one-off broadcasts.",
  },
  {
    title: "Interactive & explainer content",
    body: "Interactive demos, 3D visualizations and animated explainers for the moments polish matters: complex offers, products you can't photograph, features words alone can't carry.",
  },
  {
    title: "Journey analytics",
    body: "Instrumented from the start: where people come from, where they drop, what converts — reviewed per campaign so the next build starts smarter.",
  },
] as const;

const STAGES = [
  {
    title: "Model",
    body: "Map the journey as it is: entry points, what someone wants at each step, and where they actually leave. The map is honest before the design is beautiful.",
  },
  {
    title: "Design",
    body: "Lay out each step as a single decision — headline, proof, action. Wireframes before polish, so structure gets its own round of review.",
  },
  {
    title: "Build",
    body: "Ship it fast-loading and instrumented — conversion events live before launch, not retrofitted after.",
  },
  {
    title: "Improve",
    body: "Read the numbers, ship variants, keep the winners. A journey is a piece of infrastructure, expected to get better through use.",
  },
] as const;

function HeroBreadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="mb-7">
      <ol className="flex items-center gap-1.5 font-mono text-[11px] tracking-widest text-dim uppercase">
        <li>
          <Link href="/" className="transition-colors hover:text-fg">
            Home
          </Link>
        </li>
        <li aria-hidden>
          <ChevronRight className="size-3" />
        </li>
        <li>
          <Link href="/services" className="transition-colors hover:text-fg">
            Services
          </Link>
        </li>
        <li aria-hidden>
          <ChevronRight className="size-3" />
        </li>
        <li aria-current="page" className="text-mut">
          Experience Design
        </li>
      </ol>
    </nav>
  );
}

export default function ExperienceDesignPage() {
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: "/services/experience-design",
          name: title,
          description,
          breadcrumb: "Experience Design",
          parent: { name: "Services", path: "/services" },
          extra: [
            serviceOfferSchema("/services/experience-design", SERVICE_NAME, description),
            faqPageSchema(FAQS),
          ],
        })}
      />

      <header className="glow relative overflow-hidden border-b border-line pt-32 pb-14 sm:pt-40 sm:pb-16">
        <div aria-hidden className="grid-bg absolute inset-0 opacity-50" />
        <div aria-hidden className="field-fade absolute inset-0">
          <ParticleField density={20000} maxParticles={52} linkDistance={118} />
        </div>

        <Container className="relative">
          <HeroBreadcrumb />
          <p className="eyebrow mb-4 text-ion">Service</p>
          <h1 className="text-heading max-w-3xl text-balance">
            Design the journey, not just the page.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-mut sm:text-lg">
            Landing pages, microsites, email journeys and the conversion paths
            between campaigns and customers — designed to be finished,
            instrumented to get better, and shipped fast enough to matter.
          </p>
        </Container>
      </header>

      {/* Positioning */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal className="mx-auto max-w-[720px]">
            <h2 className="text-heading">Attention is easy. Attention that completes a decision is designed.</h2>
            <p className="mt-6 leading-relaxed text-mut">
              Getting a click is a solved problem; getting someone to finish an
              action isn&apos;t. The journey between those two moments is full
              of tiny abandonments — a form asked one question too many, a page
              that hadn&apos;t scrambled to explain itself, an email that
              talked about the sender instead of the reader. Each one is a
              design flaw that money can&apos;t fix post hoc.
            </p>
            <p className="mt-5 leading-relaxed text-mut">
              So we treat campaign experiences as their own surface: they
              change faster than your website, they serve one goal each, and
              they&apos;re where most of the learning about your audience
              actually happens. Built properly, they also turn into{" "}
              <Link href="/blog/owned-vs-rented-attention">
                owned assets
              </Link>{" "}
              — the pages and journeys that keep compounding after the campaign
              that created them is over. If you need the always-on site
              rebuilt, that&apos;s our{" "}
              <Link href="/services">website service</Link>; this page is the
              faster, sharper sibling.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Capabilities */}
      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Capabilities"
            title="What we build on the journey."
            subtitle="Each piece is a self-contained engagement. Together they're a growth system that compounds campaign over campaign."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {CAPABILITIES.map((capability, i) => (
              <Reveal key={capability.title} delay={Math.min(i * 0.08, 0.32)} className="h-full">
                <div className="hairline h-full rounded-card border border-line bg-surface p-6 sm:p-8">
                  <h3 className="text-lg font-bold tracking-tight sm:text-xl">
                    {capability.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-mut">{capability.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Stages */}
      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="How a journey gets built"
            title="Four stages, each one shipping something."
            subtitle="Model → design → build → improve. The loop is short enough that learning arrives inside the budget, not after it."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {STAGES.map((stage, i) => (
              <Reveal key={stage.title} delay={i * 0.08} className="h-full">
                <div className="hairline flex h-full flex-col rounded-card border border-line bg-surface p-6 sm:p-8">
                  <p className="eyebrow text-ion">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 text-lg font-bold tracking-tight sm:text-xl">
                    {stage.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-mut">{stage.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-[720px]">
            <Reveal>
              <h2 className="text-heading">Experience design questions, answered honestly.</h2>
            </Reveal>
            <dl className="mt-10 space-y-8">
              {FAQS.map((faq) => (
                <div key={faq.q}>
                  <dt className="text-lg font-semibold text-fg">{faq.q}</dt>
                  <dd className="mt-2 leading-relaxed text-mut">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* Further reading */}
      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Further reading" title="How we think about experiences." />
          <div className="grid gap-5 md:grid-cols-2">
            <Reveal className="h-full">
              <Link
                href="/blog/virtual-event-strategy"
                className="group block h-full rounded-2xl border border-line p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-ion/50 hover:bg-ion-soft sm:p-8"
              >
                <p className="eyebrow mb-3 text-ion">Virtual events</p>
                <h3 className="text-lg font-bold text-fg sm:text-xl">
                  Virtual event strategy: the journeys that keep people attending
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mut">
                  Registration pages, reminder journeys and the follow-through
                  that decides whether a virtual event is remembered or absent.
                </p>
              </Link>
            </Reveal>
            <Reveal delay={0.08} className="h-full">
              <Link
                href="/blog/event-measurement-roi"
                className="group block h-full rounded-2xl border border-line p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-ion/50 hover:bg-ion-soft sm:p-8"
              >
                <p className="eyebrow mb-3 text-ion">Measurement</p>
                <h3 className="text-lg font-bold text-fg sm:text-xl">
                  Whether the journey paid for itself — the ROI question
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mut">
                  How we decide what a campaign experience earned, before and
                  after the numbers are known.
                </p>
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      <Cta />
    </>
  );
}
