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

const title = "Experiential Marketing: Pop-ups, Activations & Launches";
const description =
  "Marketing for brand experiences: pop-ups, activations, launches and sponsorships — strategy, creative, rollout, creator coverage and measurement of moments that aren't ticketed.";

const SERVICE_NAME = "Experiential Marketing";

export const metadata = pageMetadata({
  title,
  description,
  path: "/services/experiential-marketing",
});

const FAQS = [
  {
    q: "What's the difference between experiential marketing and event marketing?",
    a: "They overlap, but the center of gravity differs. Event marketing is organized around a calendar and an audience with a reason to convene — conferences, trade shows, launches with a date. Experiential marketing is organized around a brand moment: pop-ups, in-store activations, street experiences, sponsorships — moments that usually aren't ticketed and have to earn attention. We run the marketing layer of both, on separate pages so each keeps its own focus.",
  },
  {
    q: "Do you build the physical spaces?",
    a: "No — fabrication and staging sit with your production partners, as they should. Our lane is everything around the build: the strategy for who it's for, the concept and creative, the rollout that gets people to the door, the capture plan for what gets produced from the space, and the reporting that says what it did for the brand.",
  },
  {
    q: "How do you measure an activation if there are no tickets?",
    a: "With a different toolkit. Unticketed experiences are tracked through footfall and dwell proxies, sign-ups and redemptions captured on-site, user-generated content and creator coverage, branded search and traffic lift afterwards, and the growth of your retargeting and email pools. No single number says much — together they say whether the moment earned its budget.",
  },
  {
    q: "Can you work with a small pop-up budget?",
    a: "Honestly, yes — small pop-ups are where a lean marketing plan pays off most. One page that ranks and converts before the doors open, one paid channel aimed at local intent, one video that documents it well, and disciplined capture of everyone who walks in. What we won't do is invent a launch that three channels can't support; we'll tell you what the budget realistically buys.",
  },
] as const;

const CAPABILITIES = [
  {
    title: "Activation strategy & concepting",
    body: "Who the moment is for, why it earns attention, and what it's meant to do for the brand — agreed before anyone books a venue, so the creative serves a goal rather than a mood.",
  },
  {
    title: "Pop-up marketing",
    body: "Location pages that rank for local intent, paid campaigns aimed at footfall, countdown content for the feed, and a capture system so every visitor is worth more than their visit.",
  },
  {
    title: "Product launch campaigns",
    body: "Launch releases built as campaigns, not announcements: pre-launch pages, teaser creative, launch-day coverage and the follow-through that keeps the product searchable when the spotlight moves on.",
  },
  {
    title: "Sponsorship amplification",
    body: "You pay to be at the venue — we make the appearance look deliberate: co-branded creatives, event-page placements, social coverage and your own recap assets from a slice of attention you're already paying for.",
  },
  {
    title: "Creator & UGC coverage",
    body: "Experiences are inherently shareable; we plan for it. Briefed creators, a UGC capture plan and rights-cleared aggregation so the moment keeps generating content after the moment itself ends.",
  },
  {
    title: "Post-experience measurement",
    body: "The report that answers the only question a board-like audience asks: what did the moment change? Footfall proxies, redemptions, branded search lift, list growth and content value, with what we'd change next time.",
  },
] as const;

const MOMENTS = [
  {
    title: "Pop-ups & retail takeovers",
    body: "Footfall, dwell and redemptions are the metrics; the window is short and local. Pages, geo-intent ads and capture touchpoints carry the weight.",
  },
  {
    title: "In-store & mall activations",
    body: "Co-planned with retail teams: staff-ready offer cards, on-site sign-up flows and post-visit retargeting that turns a demo into a pipeline.",
  },
  {
    title: "Brand launches",
    body: "Date-driven like an event, works like a campaign: pre-launch SEO and waitlist, launch-day creative, and a tail of recap content that keeps the product discoverable.",
  },
  {
    title: "Sponsorships & festivals",
    body: "You inherit a crowd you didn't gather. The job is standing out in it and taking data and assets home, not just presence.",
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
          Experiential Marketing
        </li>
      </ol>
    </nav>
  );
}

export default function ExperientialMarketingPage() {
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: "/services/experiential-marketing",
          name: title,
          description,
          breadcrumb: "Experiential Marketing",
          parent: { name: "Services", path: "/services" },
          extra: [
            serviceOfferSchema("/services/experiential-marketing", SERVICE_NAME, description),
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
            Be somewhere your audience can walk into.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-mut sm:text-lg">
            Pop-ups, activations, launches and sponsorships — planned and
            marketed as moments that earn attention instead of renting it, with
            measurement that works even when nothing is ticketed.
          </p>
        </Container>
      </header>

      {/* Positioning */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal className="mx-auto max-w-[720px]">
            <h2 className="text-heading">Experiential is the moment. Marketing is what makes it land.</h2>
            <p className="mt-6 leading-relaxed text-mut">
              An activation costs money the day it opens whether anyone shows up
              or not. The gap between a moment that gets remembered and one that
              gets wasted is almost never the fabrication budget — it&apos;s
              whether anyone knew it was happening, walked in with a reason to
              stay, and left behind something the brand can act on.
            </p>
            <p className="mt-5 leading-relaxed text-mut">
              That&apos;s our lane. We don&apos;t build walls — we build the
              attention around them: the pages that get found, the campaigns
              that pull people in, the coverage that outlives the day, and the
              data that proves the moment mattered. It shares a system with our{" "}
              <Link href="/services/event-marketing">event marketing</Link>; the
              difference is what&apos;s at the center — a brand moment, not a
              calendar.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Capabilities */}
      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Capabilities"
            title="What we run on our side of the space."
            subtitle="Six pieces of the experiential layer, runnable together or as the slice your moment needs."
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

      {/* Moments */}
      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Where it happens"
            title="Four brand moments, four different jobs."
            subtitle="The marketing moves change with the setting. What doesn't change: someone must know it's happening, care once they're in, and be capturable when they leave."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {MOMENTS.map((moment, i) => (
              <Reveal key={moment.title} delay={Math.min(i * 0.08, 0.24)} className="h-full">
                <div className="hairline h-full rounded-card border border-line bg-surface p-6 sm:p-8">
                  <h3 className="text-lg font-bold tracking-tight sm:text-xl">{moment.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mut">{moment.body}</p>
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
              <h2 className="text-heading">Experiential marketing questions, answered honestly.</h2>
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
          <SectionHeading eyebrow="Further reading" title="How we think about activations." />
          <div className="grid gap-5 md:grid-cols-2">
            <Reveal className="h-full">
              <Link
                href="/blog/popup-events-activations"
                className="group block h-full rounded-2xl border border-line p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-ion/50 hover:bg-ion-soft sm:p-8"
              >
                <p className="eyebrow mb-3 text-ion">Pop-up marketing</p>
                <h3 className="text-lg font-bold text-fg sm:text-xl">
                  A small-budget playbook for pop-ups and activations
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mut">
                  What a lean pop-up plan actually consists of: one page, one
                  paid channel, one video, and capture discipline.
                </p>
              </Link>
            </Reveal>
            <Reveal delay={0.08} className="h-full">
              <Link
                href="/blog/agency-case-studies"
                className="group block h-full rounded-2xl border border-line p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-ion/50 hover:bg-ion-soft sm:p-8"
              >
                <p className="eyebrow mb-3 text-ion">Honesty about proof</p>
                <h3 className="text-lg font-bold text-fg sm:text-xl">
                  How to read agency case studies (ours included)
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mut">
                  What separates an activation case study with a real result in
                  it from a photo album with a logo — and why we don&apos;t
                  publish ours yet.
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
