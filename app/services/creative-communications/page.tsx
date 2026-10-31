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

const title = "Creative & Communications: Messaging, Copy & Campaign Craft";
const description =
  "Messaging and positioning, campaign concepts, copywriting and communications calendars — the words and ideas that make every channel worth listening to, kept honest to what the business can deliver.";

const SERVICE_NAME = "Creative & Communications";

export const metadata = pageMetadata({
  title,
  description,
  path: "/services/creative-communications",
});

const FAQS = [
  {
    q: "Is this branding?",
    a: "Not the logo-first kind. We don't design identity systems from a blank page — we sharpen the identity you have (or work alongside your designer) on the half of your brand that's actually made of words: positioning, voice, taglines, campaign copy and the messages that repeat everywhere. If the visual side needs work, we'll say so and point it to the right craft.",
  },
  {
    q: "How does AI fit into creative work?",
    a: "On the volume, not the judgment. First drafts, variations, repurposing, research summaries — AI makes all of that fast. What it can't do is decide what your brand should sound like, which claim is defensible, or which story is actually yours. A person directs the voice and kills the output that sounds like everyone&apos;s. That division is what keeps creative fast and still yours.",
  },
  {
    q: "Do you write the copy once or maintain it?",
    a: "Both, depending on the engagement. A one-off campaign ships as final, polished copy. Ongoing retainers treat copy as an asset with versions: messages that performed get promoted to repeatable boilerplate, tired ones get rewritten, and the voice stays consistent as new pages, emails and ads appear across the year.",
  },
  {
    q: "How early on in a project do you start on messaging?",
    a: "Right at the beginning — usually before design or ad creative, because every downstream asset inherits it. Rewriting a sentence is free; redesigning a launch campaign because the positioning was fuzzy is not. Discover-first isn't process theatre; it's where the expensive mistakes get avoided.",
  },
] as const;

const CAPABILITIES = [
  {
    title: "Messaging & positioning",
    body: "What you sell, to whom, against what alternative, and the sentence that carries it. Documented so the whole team stops improvising the pitch every time the question comes up.",
  },
  {
    title: "Campaign concepts",
    body: "Ideas built to pass a business test before an awards test: a concept an actual budget can execute, in a system we can measure, tied to an offer someone can accept.",
  },
  {
    title: "Copywriting",
    body: "Site pages, landing pages, ads, emails and event copy — written from the research rather than against it, and obsessed with the one thing copy is for: being read and acted on.",
  },
  {
    title: "Voice & tone systems",
    body: "The repeatable rules of how your brand talks — vocabulary, rhythm, what we never say — so that a freelancer on Tuesday sounds like the founder on Monday.",
  },
  {
    title: "Content & comms calendars",
    body: "What gets published when, tied to launches, seasons and sales reality — the calendar as an operations document instead of a nice intent.",
  },
  {
    title: "Creative testing",
    body: "Messages run against real audiences early, where a weak idea costs a few clicks instead of a full campaign. The winners get written bigger; the losers get retired faster.",
  },
] as const;

const OUTPUTS = [
  {
    title: "The messaging house",
    body: "Positioning, proof and the three messages everything must echo. The base document other assets inherit from.",
  },
  {
    title: "Copy systems",
    body: "Page templates, ad libraries, email sequences — written and versioned, ready to run and easier to keep fresh.",
  },
  {
    title: "Campaign playbooks",
    body: "Concept, rollout calendar and measurement plan for launches and activations, ready to hand to production partners.",
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
          Creative & Communications
        </li>
      </ol>
    </nav>
  );
}

export default function CreativeCommunicationsPage() {
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: "/services/creative-communications",
          name: title,
          description,
          breadcrumb: "Creative & Communications",
          parent: { name: "Services", path: "/services" },
          extra: [
            serviceOfferSchema("/services/creative-communications", SERVICE_NAME, description),
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
            Say it in fewer words, to the people actually listening.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-mut sm:text-lg">
            Messaging, campaign concepts, copywriting and communications
            calendars — the words and ideas underneath every channel we run,
            directed by people and accelerated by AI.
          </p>
        </Container>
      </header>

      {/* Positioning */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal className="mx-auto max-w-[720px]">
            <h2 className="text-heading">Creative that has to pass a business test.</h2>
            <p className="mt-6 leading-relaxed text-mut">
              The market is full of beautiful work that converts no one and
              ugly work that prints money — and the healthiest spot is where
              you refuse to accept that trade-off. Creative earns its keep when
              it&apos;s distinctive <em>and</em> carries the offer to the right
              person in a way they can act on. That takes a research-first
              brief, an editor with taste, and the willingness to test a
              favourite idea before it becomes a six-week production.
            </p>
            <p className="mt-5 leading-relaxed text-mut">
              Words are where most buying decisions are actually made in
              writing — headlines, subject lines, page intros — and they are
              the cheapest thing in marketing to iterate. We take them
              seriously enough to do the unglamorous work: message testing,
              ruthless editing, version control across channels, and reporting
              that shows which words actually moved anyone.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Capabilities */}
      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Capabilities"
            title="What the communications layer covers."
            subtitle="From the positioning that everything inherits to the testing cadence that keeps it honest."
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

      {/* Outputs */}
      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="What you keep"
            title="Deliverables that outlive the invoice."
            subtitle="The work isn't finished when the file is sent. It's finished when your team can keep using it without us in the room."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {OUTPUTS.map((output, i) => (
              <Reveal key={output.title} delay={i * 0.1} className="h-full">
                <div className="hairline h-full rounded-card border border-line bg-surface p-6 sm:p-8">
                  <h3 className="text-lg font-bold tracking-tight sm:text-xl">{output.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mut">{output.body}</p>
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
              <h2 className="text-heading">Communications questions, answered honestly.</h2>
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
          <SectionHeading eyebrow="Further reading" title="How we think about creative." />
          <div className="grid gap-5 md:grid-cols-2">
            <Reveal className="h-full">
              <Link
                href="/blog/ai-ad-videos"
                className="group block h-full rounded-2xl border border-line p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-ion/50 hover:bg-ion-soft sm:p-8"
              >
                <p className="eyebrow mb-3 text-ion">AI ad videos</p>
                <h3 className="text-lg font-bold text-fg sm:text-xl">
                  Where AI helps the craft — and where the human edit wins
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mut">
                  The division of labour we apply to every creative asset:
                  machines on volume, people on the decisions the volume can&apos;t make.
                </p>
              </Link>
            </Reveal>
            <Reveal delay={0.08} className="h-full">
              <Link
                href="/blog/owned-vs-rented-attention"
                className="group block h-full rounded-2xl border border-line p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-ion/50 hover:bg-ion-soft sm:p-8"
              >
                <p className="eyebrow mb-3 text-ion">Marketing strategy</p>
                <h3 className="text-lg font-bold text-fg sm:text-xl">
                  Owned vs rented attention — the math small businesses miss
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mut">
                  Why the messages you build should belong to you too, and how
                  rented campaigns seed owned assets.
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
