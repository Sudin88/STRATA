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

const title = "Event Marketing for Small Business: SEO, Ads, Social & Recaps";
const description =
  "Event marketing for conferences, trade shows, launches and hybrid events: event SEO and landing pages, ticket campaigns, social rollouts, recap videos and post-event reporting.";

const SERVICE_NAME = "Event & Experiential Marketing";

export const metadata = pageMetadata({
  title,
  description,
  path: "/services/event-marketing",
});

const FAQS = [
  {
    q: "Do you produce or run events themselves?",
    a: "No — that's a different craft and we won't pretend otherwise. We're the marketing side: the pages, ads, social, recap videos and reporting that put people in the room and make the event pay off afterwards. Production (staging, AV, logistics) stays with you or your production company, and we work to their timeline. If you need both covered, we can coordinate with your production team, but marketing is what we deliver.",
  },
  {
    q: "Can you promote virtual and hybrid events?",
    a: "Yes. Hybrid events really have two audiences — the room and the feed — and they need different reasons to register. We promote the seat and the stream separately: what you get in person, what you get joining online, distinct creative for each, and a post-event content plan so the recordings keep working long after the session ends.",
  },
  {
    q: "How early should event marketing start?",
    a: "Earlier than feels necessary. Event pages need runway to rank before people start searching for your event, and paid campaigns perform better on a warm audience than a cold one. If your date is close, we won't lecture you about it — we triage: get the registration page and tracking live first, buy reach with ads, and build the organic layer as fast as it can realistically land.",
  },
  {
    q: "How do you measure whether event marketing worked?",
    a: "We agree the numbers before we start and wire the tracking before launch, not after. Typically: registrations and cost per registration, attendance against registrations, branded search and traffic lift after the event, growth of the retargeting pool, and inquiries we can trace back to the campaign. The post-event report ends with what we'd change for the next one, because that's the point of measuring.",
  },
] as const;

const CAPABILITIES = [
  {
    title: "Event SEO & landing pages",
    body: "Pages that rank for your event's searches and pre-sell the room — schedule, speakers, venue, registration — designed to turn intent into sign-ups and rebuilt as evergreen assets when the event is over.",
  },
  {
    title: "Ticket & booking campaigns",
    body: "Search and social ads aimed at one thing: registrations. Built around the offer and the deadline, with conversion tracking wired before a single impression runs.",
  },
  {
    title: "Virtual & hybrid promotion",
    body: "Two audiences, two pitches. We market the seat and the stream separately — the price, the access, the reasons each audience would care — so the feed doesn't cannibalise the room.",
  },
  {
    title: "Social media rollouts",
    body: "Teasers, speaker cards, countdowns and live coverage, planned as a calendar that runs across the whole event arc instead of fading out the moment doors open.",
  },
  {
    title: "Recap videos & motion graphics",
    body: "A capture plan agreed from day one, so short-form recap edits can ship in days — AI-assisted production with a human cut, sized for every feed the event lives on.",
  },
  {
    title: "Sponsor & exhibitor co-marketing",
    body: "Promotion packages your sponsors and exhibitors can actually use: co-branded creatives, their own tracking, and reporting each of them can take back to their team.",
  },
] as const;

const PHASES = [
  {
    phase: "Before",
    items: [
      "Keyword research and event pages live early",
      "Registration funnel and conversion tracking wired",
      "Promo videos, motion graphics and speaker cards",
      "Social calendar scheduled across the whole arc",
      "Paid campaigns priming a retargeting pool",
    ],
  },
  {
    phase: "During",
    items: [
      "Live coverage with posts ready to react in real time",
      "Capture plan for recaps: shots, interviews, b-roll",
      "Spend shifted toward whatever the data says is landing",
      "Lead capture checked while people still care",
    ],
  },
  {
    phase: "After",
    items: [
      "Recap videos shipped in days, not weeks",
      "Follow-ups and retargeting to warm audiences",
      "Pages rebuilt into evergreen content assets",
      "A report on registrations, attendance and pipeline — and what the next event should copy",
    ],
  },
] as const;

const METRICS = [
  "Registrations and cost per registration",
  "Attendance against registrations",
  "Traffic and branded search lift after the event",
  "Retargeting pool growth across the campaign",
  "Inquiries attributable to the event itself",
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
          Event Marketing
        </li>
      </ol>
    </nav>
  );
}

export default function EventMarketingPage() {
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: "/services/event-marketing",
          name: title,
          description,
          breadcrumb: "Event Marketing",
          parent: { name: "Services", path: "/services" },
          extra: [
            serviceOfferSchema("/services/event-marketing", SERVICE_NAME, description, "Event Marketing"),
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
            Fill the room. Then make the event keep working.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-mut sm:text-lg">
            We don&apos;t produce events — we market them. SEO, paid campaigns,
            social, video and recaps for launches, conferences, trade shows and
            both virtual and hybrid formats, run as one campaign before, during
            and after.
          </p>
        </Container>
      </header>

      {/* Positioning — one honest paragraph instead of a stage-design fantasy. */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal className="mx-auto max-w-[720px]">
            <h2 className="text-heading">Marketing around the event, not production under it.</h2>
            <p className="mt-6 leading-relaxed text-mut">
              An event is the most expensive way to meet your audience, and the
              marketing around it is usually stitched together from whoever was
              available — an ads freelancer here, a poster designer there —
              nothing connected, nothing measured. The room fills or it
              doesn&apos;t because of that loose seam.
            </p>
            <p className="mt-5 leading-relaxed text-mut">
              What we sell is the marketing arm of the event: the same{" "}
              <Link href="/services">services we run for any engagement</Link> —
              SEO, paid, social, video — pointed at a date on a calendar and a
              number of seats to fill. Your production team builds the stage.
              We make sure the room is full, the room knows why, and the work
              keeps returning value after the lights go down. Where the centre
              of gravity is a brand moment rather than a calendar — pop-ups,
              retail takeovers, sponsorships — that&apos;s our{" "}
              <Link href="/services/experiential-marketing">
                experiential marketing
              </Link>{" "}
              practice, on its own page.
            </p>
            <p className="mt-5 leading-relaxed text-mut">
              Want the working version of the plan? Our{" "}
              <Link href="/services/event-marketing/checklist">
                event marketing checklist
              </Link>{" "}
              walks the before, during and after in order — usable whether we
              run the campaign or your own team does.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Capabilities */}
      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Capabilities"
            title="What runs on our side of the event."
            subtitle="Six connected pieces, one team on them. Ship all of it or just the slice your event actually needs."
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

      {/* The arc */}
      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="The arc"
            title="Before, during, after — one campaign, not three vendors."
            subtitle="Events run on deadlines, and marketing that starts at the deadline is decoration. The whole point of the plan below is that the work on the right side of the date has already been set up."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {PHASES.map((phase, i) => (
              <Reveal key={phase.phase} delay={i * 0.1} className="h-full">
                <div className="hairline flex h-full flex-col rounded-card border border-line bg-surface p-6 sm:p-8">
                  <p className="eyebrow text-ion">{phase.phase}</p>
                  <ul className="mt-5 space-y-3">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-mut">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-ion" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Measurement */}
      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <Reveal className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="eyebrow mb-4">Measurement</p>
              <h2 className="text-heading">
                Judged on numbers the event actually moves.
              </h2>
              <p className="mt-6 max-w-md leading-relaxed text-mut">
                &quot;Good vibes in the room&quot; isn&apos;t a report. We agree
                the metrics before we start and wire the tracking before the
                campaign launches — so the post-event review is evidence, not a
                mood board, and it ends with what the next event should do
                differently.
              </p>
            </div>
            <ul className="space-y-3">
              {METRICS.map((metric) => (
                <li key={metric} className="flex items-start gap-3 text-mut">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-ion" aria-hidden />
                  {metric}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-[720px]">
            <Reveal>
              <h2 className="text-heading">Event marketing questions, answered honestly.</h2>
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
          <SectionHeading
            eyebrow="Further reading"
            title="How we think about event marketing."
          />
          <div className="grid gap-5 md:grid-cols-2">
            <Reveal className="h-full">
              <Link
                href="/blog/event-marketing-trends"
                className="group block h-full rounded-2xl border border-line p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-ion/50 hover:bg-ion-soft sm:p-8"
              >
                <p className="eyebrow mb-3 text-ion">Event marketing trends</p>
                <h3 className="text-lg font-bold text-fg sm:text-xl">
                  Six shifts that decide who fills the room next
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mut">
                  How hybrid defaults, first-party data and recap economics are
                  changing event marketing — and what we&apos;re building for.
                </p>
              </Link>
            </Reveal>
            <Reveal delay={0.08} className="h-full">
              <Link
                href="/blog/ai-ad-videos"
                className="group block h-full rounded-2xl border border-line p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-ion/50 hover:bg-ion-soft sm:p-8"
              >
                <p className="eyebrow mb-3 text-ion">AI ad videos</p>
                <h3 className="text-lg font-bold text-fg sm:text-xl">
                  Recaps and event promos, produced fast and cut by humans
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mut">
                  How AI-assisted video production makes testing event creative
                  cheap — and why the human edit is still what makes it work.
                </p>
              </Link>
            </Reveal>
            <Reveal delay={0.16} className="h-full">
              <Link
                href="/blog/event-measurement-roi"
                className="group block h-full rounded-2xl border border-line p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-ion/50 hover:bg-ion-soft sm:p-8"
              >
                <p className="eyebrow mb-3 text-ion">Event marketing ROI</p>
                <h3 className="text-lg font-bold text-fg sm:text-xl">
                  Deciding whether the event paid off — before it runs
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mut">
                  The measurement chain that keeps post-event reports from
                  flattering themselves.
                </p>
              </Link>
            </Reveal>
            <Reveal delay={0.24} className="h-full">
              <Link
                href="/blog/virtual-event-strategy"
                className="group block h-full rounded-2xl border border-line p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-ion/50 hover:bg-ion-soft sm:p-8"
              >
                <p className="eyebrow mb-3 text-ion">Virtual events</p>
                <h3 className="text-lg font-bold text-fg sm:text-xl">
                  Running virtual events people actually join
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mut">
                  Platform choice for the job, registration pages that convert,
                  and the list that outlives the stream.
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
