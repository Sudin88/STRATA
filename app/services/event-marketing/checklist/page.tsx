import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ParticleField } from "@/components/ui/particle-field";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Cta } from "@/components/cta";
import { pageMetadata } from "@/lib/seo";
import { pageGraph } from "@/lib/schema";
import { JsonLd } from "@/components/json-ld";

const title = "Event Marketing Checklist: Before, During, After";
const description =
  "A working event marketing checklist in the order events actually run — the plan to lock before anyone spends, the jobs to own during, and the follow-through that decides whether the event paid off.";

export const metadata = pageMetadata({
  title,
  description,
  path: "/services/event-marketing/checklist",
});

const BEFORE = [
  {
    lead: "Name the job in one sentence.",
    body: "Chiefly what the event exists to move: registrations that become pipeline, launch coverage, client retention, list growth. If two people from your team give two different answers, the sentence isn't written yet.",
  },
  {
    lead: "Agree the numbers and the judge date.",
    body: "What success reads as, decided before anyone is invested in an attendance count — and two review dates: operational metrics after days, commercial outcomes after the agreed weeks.",
  },
  {
    lead: "Build the event page early.",
    body: "One page that answers what, where, when and why-it's-for-them, offerable straight into a calendar, and live early enough to collect the searches people already make before the doors open.",
  },
  {
    lead: "Sequence the emails before the first send.",
    body: "Confirmation that adds value, reminders framed as value, a final-hour logistics mail. Written once and ready to schedule, so the sequence never depends on spare Friday energy.",
  },
  {
    lead: "Pick channels where the audience actually plans.",
    body: "Local search, the feed they scroll, industry partners, the speakers' own networks. Every other channel is reach vanity at this scale.",
  },
  {
    lead: "Arm every partner with a share kit.",
    body: "Speakers, sponsors and co-promoters each get ready-made copy, images and links with the right UTM tags — because partner reach is free reach, but only if nobody has to improvise it.",
  },
  {
    lead: "Put paid budget behind registration only.",
    body: "Ads aimed at the metric agreed in step two, capped until the cost per registration is known — not aimed at reach, and not launched before the page measures it.",
  },
  {
    lead: "Decide the capture plan and the consent line.",
    body: "What you collect at registration and at the door, where it lands, who processes it, and the plain-language consent that makes the list an asset rather than a liability.",
  },
] as const;

const DURING = [
  {
    lead: "One owner per channel.",
    body: "Who posts to social, who films, who fields the chat or the room, who captures leads. Name them the day before, not in the corridor on the day.",
  },
  {
    lead: "Capture every attendee you can.",
    body: "Registration desk plus a QR at every entry point, consent language stated plainly. The room is the product; the list is the asset.",
  },
  {
    lead: "Film for the recap, not for the archive.",
    body: "Planned shots beat luck: the opening beat, audience reactions, three speaker sound bites, b-roll of the room. The recap depends on footage you decide to gather beforehand.",
  },
  {
    lead: "Harvest every question asked.",
    body: "The Q&A trail is a live research file: it becomes the next event's agenda and the next quarter's content brief.",
  },
  {
    lead: "Publish while it happens.",
    body: "Same-day social and a same-day photo selection keep the people who didn't come warm for the on-demand path instead of the memory fade.",
  },
  {
    lead: "Note what goes wrong, live.",
    body: "The fix list written during the event is the only version of next year's checklist that can be trusted.",
  },
] as const;

const AFTER = [
  {
    lead: "Follow up inside 72 hours.",
    body: "Replay or summary link, the one-paragraph takeaway, a next step sized small. After that, the memory of the event is an expense.",
  },
  {
    lead: "Ship the recap within days.",
    body: "One hero video plus clips off the planned footage, and a home page that keeps ranking and converting after the venue empties.",
  },
  {
    lead: "Run the two-clock report.",
    body: "Operational numbers now (registrations, attendance, cost per registration, list growth); commercial numbers on the date agreed before the event. Compare them to that agreement, not to the applause.",
  },
  {
    lead: "Repurpose everything once more.",
    body: "The Q&A and speaker quotes become article briefs; the recordings become social and email assets. One event, several months of honest content.",
  },
  {
    lead: "Segment the list immediately.",
    body: "Attendees, no-shows and registrants-at-large each get different follow-up. Treating them alike burns the value of the distinction you just paid to create.",
  },
  {
    lead: "Hold the verdict review.",
    body: "Repeat, drop, try-instead — three sentences that decide next year's plan. If your post-event review can't produce them, the earlier steps were decoration.",
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
          <Link href="/services/event-marketing" className="transition-colors hover:text-fg">
            Event Marketing
          </Link>
        </li>
        <li aria-hidden>
          <ChevronRight className="size-3" />
        </li>
        <li aria-current="page" className="text-mut">
          Checklist
        </li>
      </ol>
    </nav>
  );
}

export default function EventMarketingChecklistPage() {
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: "/services/event-marketing/checklist",
          name: title,
          description,
          breadcrumb: "Checklist",
          parent: { name: "Event Marketing", path: "/services/event-marketing" },
        })}
      />

      <header className="glow relative overflow-hidden border-b border-line pt-32 pb-14 sm:pt-40 sm:pb-16">
        <div aria-hidden className="grid-bg absolute inset-0 opacity-50" />
        <div aria-hidden className="field-fade absolute inset-0">
          <ParticleField density={20000} maxParticles={52} linkDistance={118} />
        </div>

        <Container className="relative">
          <HeroBreadcrumb />
          <p className="eyebrow mb-4 text-ion">Event marketing</p>
          <h1 className="text-heading max-w-3xl text-balance">
            The event marketing checklist, in the order events actually run.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-mut sm:text-lg">
            Twenty steps across before, during and after, in the same order we
            run them. Take it as a working document — print it, put an
            owner&apos;s name beside every line, and let the paper do the
            chasing.
          </p>
        </Container>
      </header>

      {/* Before */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Before"
            title="Eight things to lock before anyone spends a thing."
            subtitle="Every expensive event mistake available to humankind is made in this phase. The list is short precisely because these are the decisions that can't be bought back."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {BEFORE.map((step, i) => (
              <Reveal key={step.lead} delay={Math.min(i * 0.06, 0.3)} className="h-full">
                <div className="hairline flex h-full flex-col rounded-card border border-line bg-surface p-6 sm:p-8">
                  <div className="flex items-start gap-3">
                    <span aria-hidden className="mt-1 font-mono text-xs text-ion">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-lg font-bold tracking-tight sm:text-xl">
                      {step.lead}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-mut">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* During */}
      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="During"
            title="Six jobs that decide whether the room was an asset."
            subtitle="The event runs itself for a few hours; these are the things that don't."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {DURING.map((step, i) => (
              <Reveal key={step.lead} delay={Math.min(i * 0.06, 0.3)} className="h-full">
                <div className="hairline flex h-full flex-col rounded-card border border-line bg-surface p-6 sm:p-8">
                  <div className="flex items-start gap-3">
                    <span aria-hidden className="mt-1 font-mono text-xs text-ion">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-lg font-bold tracking-tight sm:text-xl">
                      {step.lead}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-mut">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* After */}
      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="After"
            title="Six follow-throughs where the event's return is decided."
            subtitle="Most of the value is won or lost after the venue empties — in the follow-up, the recap and the honest report."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {AFTER.map((step, i) => (
              <Reveal key={step.lead} delay={Math.min(i * 0.06, 0.3)} className="h-full">
                <div className="hairline flex h-full flex-col rounded-card border border-line bg-surface p-6 sm:p-8">
                  <div className="flex items-start gap-3">
                    <span aria-hidden className="mt-1 font-mono text-xs text-ion">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-lg font-bold tracking-tight sm:text-xl">
                      {step.lead}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-mut">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Honest close */}
      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <Reveal className="mx-auto max-w-[720px]">
            <h2 className="text-heading">A checklist is the floor, not the strategy.</h2>
            <p className="mt-6 leading-relaxed text-mut">
              None of these twenty steps is hard — which is exactly why they
              get skipped. The value in the list is that it makes the
              discipline external: print it, put the owner&apos;s name beside
              each line, and let the paper be the bad guy instead of whoever
              has to nag. What the list can&apos;t do is replace the
              judgment calls underneath each step — that&apos;s where the{" "}
              <Link href="/services/event-marketing">event marketing service</Link>{" "}
              earns its keep, with the measurement built in from the{" "}
              <Link href="/blog/event-measurement-roi">
                numbers agreed up front
              </Link>
              .
            </p>
            <p className="mt-5 leading-relaxed text-mut">
              Run more events than budget? Start with the{" "}
              <Link href="/blog/event-marketing-for-small-business">
                small-business event marketing guide
              </Link>
              , which prioritizes these steps when you can&apos;t do them all.
            </p>
          </Reveal>
        </Container>
      </section>

      <Cta />
    </>
  );
}
