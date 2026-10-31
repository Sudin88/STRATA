import Link from "next/link";
import type { PostMeta } from "@/lib/blog";

export const meta: PostMeta = {
  slug: "agency-case-studies",
  title: "How to Read Agency Case Studies (Ours Included)",
  heading: "Most case studies are ads wearing a lab coat.",
  description:
    "The four tells of a hollow case study, the questions that beat it when you're hiring an agency — and why we publish no case studies yet, and what we offer instead.",
  keyword: "agency case studies",
  published: "2026-10-31",
  readingMinutes: 6,
  faqs: [
    {
      q: "Why doesn't Strata publish case studies yet?",
      a: "Because we're a new agency and don't yet have engagements that can be shown with client permission and honest baselines. Publishing inflated or unverifiable results to look established is exactly the inflation this article describes — so our work page says plainly that there's no published work yet, and shows how our engagements are structured instead. Real projects will appear there with client approval.",
    },
    {
      q: "How can you evaluate an agency without case studies?",
      a: "Read how they think — articles, proposals, the questions they ask about your business. Then buy small: a paid audit or pilot phase with defined outputs beats a PDF promise. Choose your own references rather than the curated three. And watch for candour: an agency that can describe a failure plainly is showing you the trait that saves budgets.",
    },
    {
      q: "What makes a case study credible when you find one?",
      a: "Five requirements: a client who can be named or independently verified, a stated baseline, clear boundaries on what the agency actually did, numbers the client would confirm, and at least one thing that went wrong. A case study without a failure section is a highlights reel.",
    },
  ],
};

export default function Body() {
  return (
    <>
      <p>
        Case studies are the most-read documents in agency marketing and the
        least audited. Everyone publishes them; almost nobody checks them;
        the whole genre floats on a polite agreement that all sides are
        exaggerating. But if you&apos;re about to hand an agency your
        budget, an uncritical read of a case study is due diligence skipped
        at the worst possible moment. What follows is a guide you can apply
        to any agency — including us, an agency that publishes its thinking
        and, deliberately, no case studies.
      </p>

      <h2>Four tells of a hollow case study</h2>
      <ol>
        <li>
          <strong>Metrics without baselines.</strong> &quot;Engagement up
          240%&quot; means nothing until you know the from-where. A tiny
          starting base, a seasonal spike or a measurement tool that changed
          mid-flight can all print the same triumphant sentence.
        </li>
        <li>
          <strong>Blur on who did what.</strong> &quot;Our work featured in
          the launch&quot; can describe ten weeks of strategy or one deck.
          Credible case studies draw the role boundary in wide lines: what
          the agency did, what the client already had, what the platform
          did, and where timing helped.
        </li>
        <li>
          <strong>Perfect arcs.</strong> Everything succeeded, and the
          &quot;lessons learned&quot; are decorative. Real engagements
          contain at least one wrong turn — a page that flopped, a channel
          that never carried — and say what it cost.
        </li>
        <li>
          <strong>Unverifiable everything.</strong> &quot;A global fintech
          unicorn,&quot; no scope, no timeline, no human quote. If nothing
          in the story can be checked, nothing in the story is being
          claimed.
        </li>
      </ol>

      <h2>The questions that beat the PDF</h2>
      <p>
        Ask any agency these in a first call. They take less time than
        reading the album, and the answers will teach you more:
      </p>
      <ul>
        <li>
          <strong>&quot;What would you do differently if you ran that
          project today?&quot;</strong> If the answer is nothing, no
          learning has happened since.
        </li>
        <li>
          <strong>&quot;Who did what?&quot;</strong> Listen for nouns and
          weeks, not adjectives.
        </li>
        <li>
          <strong>&quot;If the client can&apos;t be named, what
          can?&quot;</strong> Sector, duration, scope, a reference call
          under NDA — some verifiable residue, or none.
        </li>
        <li>
          <strong>&quot;What failed first?&quot;</strong> Every credible
          project has an answer.
        </li>
        <li>
          <strong>&quot;What&apos;s the smallest first phase where you
          could prove this on us — paid normally?&quot;</strong> Confident
          agencies sell the first step, not just the retainer.
        </li>
      </ul>

      <h2>Why we publish no case studies (yet)</h2>
      <p>
        Strata is a young agency taking on its first clients. That&apos;s
        the whole reason there are no case studies on our site: not enough
        finished engagements — and the ones in progress belong to their
        clients until those clients say otherwise. Padding the gap with
        borrowed benchmarks and unverifiable numbers would be exactly the
        inflation this article warns about, so{" "}
        <Link href="/work">our work page</Link> says plainly that there is
        no published work yet, and describes how our engagements are
        structured instead. When real projects can be shown with client
        approval, honest baselines and named roles, they&apos;ll appear
        there — built to the{" "}
        <Link href="/blog/event-measurement-roi">
          measurement discipline
        </Link>{" "}
        we hold every campaign to.
      </p>
      <p>
        What we can show today is how we think: the articles on this blog,
        the way scope and reporting are written into our proposals, and the
        questions we ask before agreeing to work. Evidence can start before
        the first case study exists.
      </p>

      <h2>Hiring on evidence, not albums</h2>
      <ul>
        <li>
          <strong>Buy small first.</strong> A paid audit, a pilot phase, a
          one-page plan — priced normally. Agencies confident in their
          process don&apos;t need the whole year sold upfront.
        </li>
        <li>
          <strong>Choose your references.</strong> Not the three curated
          names offered on request — find two clients through the
          agency&apos;s public footprint and ask the awkward questions
          yourself.
        </li>
        <li>
          <strong>Read the writing.</strong> How an agency argues in public
          is the cheapest available evidence of how it will think about
          your problem.
        </li>
        <li>
          <strong>Check the contract for honesty.</strong> Scope stated,
          success defined, exclusions listed. A contract that promises
          everything can&apos;t measure anything.
        </li>
      </ul>

      <p>
        The best time to read an agency this way is before the pitch — and
        the guide applies to us as much as anyone.{" "}
        <Link href="/contact">Put us through the five questions</Link> on a
        call, including the failure ones; candour under questioning is the
        strongest evidence any agency can give you.
      </p>
    </>
  );
}
