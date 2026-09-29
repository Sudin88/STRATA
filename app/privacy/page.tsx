import { PageHero } from "@/components/page-hero";
import { LegalProse, LegalSection } from "@/components/legal-prose";
import { SITE } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { pageGraph } from "@/lib/schema";
import { JsonLd } from "@/components/json-ld";

/*
 * This policy describes the site's *actual* data flows (the two forms and the
 * Supabase backend they write to). It's an accurate starting point — have it
 * reviewed by counsel and localised for your jurisdiction before you rely on
 * it. Update LAST_UPDATED whenever the copy or the data flows change.
 */
const LAST_UPDATED = "September 29, 2026";

const description =
  "How Strata collects, uses and protects the information you share through our contact and feedback forms.";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: "/privacy",
          name: "Privacy Policy",
          description,
          breadcrumb: "Privacy",
        })}
      />
      <PageHero
        breadcrumb="Privacy"
        eyebrow="Legal"
        title="Privacy policy."
        description="Plain-English explanation of what we collect, why, and what you can do about it. No dark patterns, no selling your data."
      />

      <LegalProse lastUpdated={LAST_UPDATED}>
        <LegalSection heading="Who we are">
          <p>
            {SITE.name} is a marketing agency based in {SITE.location}. This
            policy covers this website and the information you share with us
            through it. Questions? Email us at{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>
        </LegalSection>

        <LegalSection heading="What we collect">
          <p>We only collect what you actively send us through a form:</p>
          <ul>
            <li>
              <strong>Contact form:</strong> your name, email, and — if you
              choose to add them — company, website, the service you&apos;re
              interested in, a budget range, and the project details you write.
            </li>
            <li>
              <strong>Feedback form:</strong> your name, a rating, your
              feedback, and optionally your company/role and email.
            </li>
          </ul>
          <p>
            We don&apos;t use analytics or advertising trackers, and the site
            sets no tracking cookies. We don&apos;t buy or enrich your data from
            third parties.
          </p>
        </LegalSection>

        <LegalSection heading="How we use it">
          <ul>
            <li>To reply to your inquiry and scope potential work.</li>
            <li>
              To improve how we work, based on the feedback you send us.
            </li>
            <li>
              To publish a review <em>only</em> if you explicitly tick the
              consent box on the feedback form. Nothing you submit is published
              until we approve it, and you can ask us to remove it at any time.
            </li>
          </ul>
          <p>
            We never sell your information, and we don&apos;t use it for
            automated decision-making or profiling.
          </p>
        </LegalSection>

        <LegalSection heading="Where it's stored">
          <p>
            Form submissions are stored in a database hosted by Supabase, our
            infrastructure provider, which processes the data on our behalf.
            Access is restricted, and new submissions may trigger an internal
            email notification to our team so we can respond.
          </p>
        </LegalSection>

        <LegalSection heading="How long we keep it">
          <p>
            We keep inquiries and feedback for as long as we need them to
            respond and maintain our records, and remove them when they&apos;re
            no longer needed. Ask us to delete yours sooner and we will, unless
            we&apos;re required to keep it.
          </p>
        </LegalSection>

        <LegalSection heading="Your rights">
          <p>
            You can ask us to access, correct, or delete the information you
            gave us, or to stop using it. Email{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and we&apos;ll take
            care of it. Depending on where you live, you may have additional
            rights under laws such as the GDPR or similar regulations.
          </p>
        </LegalSection>

        <LegalSection heading="Changes to this policy">
          <p>
            If we change how we handle your data, we&apos;ll update this page and
            the date at the top. Material changes will be reflected here before
            they take effect.
          </p>
        </LegalSection>
      </LegalProse>
    </>
  );
}
