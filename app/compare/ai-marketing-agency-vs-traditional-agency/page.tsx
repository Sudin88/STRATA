import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ParticleField } from "@/components/ui/particle-field";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Cta } from "@/components/cta";
import { pageMetadata } from "@/lib/seo";
import { pageGraph, faqPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/json-ld";

const title = "AI Marketing Agency vs Traditional Agency: What Actually Differs";
const description =
  "An honest comparison of AI-first and traditional marketing agencies: what actually differs in speed, cost structure, testing volume and craft — how to tell a real AI-first team from an AI badge — and when each model is the right buy.";

export const metadata = pageMetadata({
  title,
  description,
  path: "/compare/ai-marketing-agency-vs-traditional-agency",
});

const FAQS = [
  {
    q: "Is an AI-first agency cheaper because it does less work?",
    a: "No — and any agency that frames it that way is selling the badge, not the method. The strategic work is identical: positioning, audience, offer, measurement. What changes is that the machine absorbs the volume layer — drafts, variations, repurposing, data prep — so the human hours concentrate on judgment and final craft. Same thinking, fewer hours billed against mechanical labour.",
  },
  {
    q: "Will AI-generated marketing hurt my brand voice?",
    a: "Not if a person owns the voice and the AI never does. The pattern that works: people set positioning, tone and the final edit; AI produces the candidate volume in between. The pattern that fails: AI sets direction with a human approving at the end — that inverts to average work fast, which is worse than bespoke work slowly.",
  },
  {
    q: "Can I keep a traditional agency and add AI-first work alongside?",
    a: "Often yes, and it's a sensible arrangement rather than a contradiction. Traditional teams take the large-scale, long-cycle brand work that needs senior craft and production depth; an AI-first layer handles the always-on iteration — content, pages, campaign testing ads — where speed matters more than scale. If you hire in that shape, make the boundary explicit so neither side re-edits the other's work.",
  },
] as const;

const TABLE = [
  {
    aspect: "Speed of iteration",
    aiFirst:
      "Drafts, variants and revisions in hours. Testing message angles across a week is normal, so learning is a weekly cycle, not a quarterly one.",
    traditional:
      "Measured in agency working days per revision cycle. Fine for launch moments; slow for channels that want weekly feedback.",
  },
  {
    aspect: "Cost structure",
    aiFirst:
      "Priced against scope and outcomes, since labour hours stop being the unit of production. Small retainers become viable.",
    traditional:
      "Priced against team time — senior hours, production costs, day rates. Reliable, but the floor per engagement is high by construction.",
  },
  {
    aspect: "Testing volume",
    aiFirst:
      "Dozens of variants of copy and creative in the time one traditional round takes, with humans deciding what survives.",
    traditional:
      "A handful of campaign concepts per cycle, chosen up front. Depth of craft per option, but fewer options.",
  },
  {
    aspect: "Craft ceiling",
    aiFirst:
      "Strong on page, content, motion and video systems; humans make the taste calls. Broadcast-scale production is not this model's arena.",
    traditional:
      "Unmatched where senior creative direction and full-scale production are the product — film, brand worlds, big-ticket launches.",
  },
  {
    aspect: "Team shape",
    aiFirst:
      "A small team of generalists with taste directing tools — fewer people, each accountable for outcomes.",
    traditional:
      "Specialists per channel with account management between you and the work. More process, more consistency at scale.",
  },
  {
    aspect: "Where each wins",
    aiFirst:
      "The always-on machine a small or mid-size business actually needs: content, pages, ads, email, event marketing around a calendar.",
    traditional:
      "Brand stewardship over years and campaigns where presence and craft matter more than iteration speed.",
  },
] as const;

const QUESTIONS = [
  {
    lead: "“What exactly does your AI do, and what do humans sign off?”",
    body: "A real answer names tasks: drafting, variation, repurposing, analysis. A vague answer says “we use AI” — which describes every business in 2026, including the traditional ones.",
  },
  {
    lead: "“Show me something AI produced badly, and how you caught it.”",
    body: "The tell of a real process is a human gate with the authority to kill output. If no work has ever been caught and killed, the process has no review worth the name.",
  },
  {
    lead: "“Who owns my voice and my data?”",
    body: "Voice: one named editor, not “the team”. Data: where it lives, what trains what, and what leaves your tenancy — ask directly; an honest agency answers in one breath.",
  },
  {
    lead: "“What part of your process existed before you added the AI badge?”",
    body: "The badge on an untouched process is the giveaway. AI-first is a restructure of who does what — if nothing moved, it's pricing theatre.",
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
          AI vs Traditional
        </li>
      </ol>
    </nav>
  );
}

export default function ComparePage() {
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: "/compare/ai-marketing-agency-vs-traditional-agency",
          name: title,
          description,
          breadcrumb: "AI vs Traditional Agency",
          parent: { name: "Services", path: "/services" },
          extra: [faqPageSchema(FAQS)],
        })}
      />

      <header className="glow relative overflow-hidden border-b border-line pt-32 pb-14 sm:pt-40 sm:pb-16">
        <div aria-hidden className="grid-bg absolute inset-0 opacity-50" />
        <div aria-hidden className="field-fade absolute inset-0">
          <ParticleField density={20000} maxParticles={52} linkDistance={118} />
        </div>

        <Container className="relative">
          <HeroBreadcrumb />
          <p className="eyebrow mb-4 text-ion">Choosing a model</p>
          <h1 className="text-heading max-w-3xl text-balance">
            AI-first or traditional? Same deadline. Different machine.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-mut sm:text-lg">
            Written by an AI-first agency, so read it with that grain of salt
            — and with the promise that we won&apos;t strawman the other
            side. Both models are legitimate buys. They&apos;re just not
            buying the same thing.
          </p>
        </Container>
      </header>

      {/* Definitions */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal className="mx-auto max-w-[720px]">
            <h2 className="text-heading">Three claims, three categories of agency.</h2>
            <p className="mt-6 leading-relaxed text-mut">
              &quot;Traditional agency&quot;: a team of specialists per
              channel — strategists, designers, copywriters, media buyers —
              whose deliverable is made of human hours. The stronger work in
              this model is excellent and worth paying for; the price floor
              reflects the headcount.
            </p>
            <p className="mt-5 leading-relaxed text-mut">
              &quot;AI-first agency&quot; is what we are, so here&apos;s the
              honest definition rather than the marketing one: AI absorbs the
              volume layer — first drafts, variation, repurposing, analysis —
              while people direct strategy, taste and the final edit. The
              economy is real, but only if the human accountability part is
              too. And between the two sits every agency with a logo badge on
              an untouched process, which is why the checklist later in this
              page exists.
            </p>
            <p className="mt-5 leading-relaxed text-mut">
              One more sentence of fairness: a great traditional agency beats
              a mediocre AI-first one in every dimension, and vice versa.
              Model labels predict less than the people do.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Comparison table */}
      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="The honest comparison"
            title="Six ways the models actually differ."
            subtitle="Where the two models are the same — positioning, audience thinking, measurement discipline, taste — we've left them out, because the difference is where the decision lives."
          />
          <Reveal className="mt-12">
            <div className="hairline overflow-x-auto rounded-card border border-line bg-surface">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="px-5 py-4 font-mono text-[11px] uppercase tracking-widest text-dim">
                      Aspect
                    </th>
                    <th scope="col" className="px-5 py-4 font-mono text-[11px] uppercase tracking-widest text-ion">
                      AI-first
                    </th>
                    <th scope="col" className="px-5 py-4 font-mono text-[11px] uppercase tracking-widest text-dim">
                      Traditional
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE.map((row) => (
                    <tr key={row.aspect} className="border-b border-line/60 last:border-0 align-top">
                      <th scope="row" className="px-5 py-5 font-semibold text-fg">
                        {row.aspect}
                      </th>
                      <td className="px-5 py-5 leading-relaxed text-mut">{row.aiFirst}</td>
                      <td className="px-5 py-5 leading-relaxed text-mut">{row.traditional}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Wrapper detector */}
      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Wrapper detector"
            title="Four questions that separate a real AI-first team from an AI badge."
            subtitle="Ask them of any agency — including us. An agency worth hiring answers in specifics; a badge politely baffles."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {QUESTIONS.map((q, i) => (
              <Reveal key={q.lead} delay={Math.min(i * 0.08, 0.24)} className="h-full">
                <div className="hairline h-full rounded-card border border-line bg-surface p-6 sm:p-8">
                  <h3 className="text-lg font-bold tracking-tight sm:text-xl">{q.lead}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mut">{q.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Where Strata fits */}
      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <Reveal className="mx-auto max-w-[720px]">
            <h2 className="text-heading">Where we fit — and where we don&apos;t.</h2>
            <p className="mt-6 leading-relaxed text-mut">
              We&apos;re built for the always-on machine a small or
              mid-size business actually needs: content, pages, campaign
              ads, email journeys and event marketing pointed at a date — a
              small team of people who direct the tools, described plainly
              on our{" "}
              <Link href="/services">services</Link> and{" "}
              <Link href="/process">process</Link> pages. That machine
              compounding month over month is the thing this model buys
              best, and it&apos;s the thing most small businesses are
              underserved by.
            </p>
            <p className="mt-5 leading-relaxed text-mut">
              Where we don&apos;t compete: broadcast-scale production and
              long-cycle brand worlds — the traditional ceiling. If that&apos;s
              the job, hire great traditional hands for it; we&apos;ll keep
              the rest humming beside them.
            </p>
            <p className="mt-5 leading-relaxed text-mut">
              Two honest reading notes as you keep evaluating: how to read
              {" "}
              <Link href="/blog/agency-case-studies">
                agency case studies
              </Link>{" "}
              (we publish none yet — our{" "}
              <Link href="/work">work page</Link> explains) and what{" "}
              <Link href="/blog/does-google-penalize-ai-content">
                Google actually counts against AI content
              </Link>
              , because we&apos;d rather you know that answer than inherit
              it.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-[720px]">
            <Reveal>
              <h2 className="text-heading">Questions, answered honestly.</h2>
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

      <Cta />
    </>
  );
}
