import { PageHero } from "@/components/page-hero";
import { LegalProse, LegalSection } from "@/components/legal-prose";
import { SITE } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { pageGraph } from "@/lib/schema";
import { JsonLd } from "@/components/json-ld";

/*
 * General website terms of use — this governs use of the site itself, not any
 * client engagement (those are covered by a separate signed agreement). It's a
 * reasonable starting point; have counsel review and adapt it to your
 * jurisdiction before relying on it. Update LAST_UPDATED on any change.
 */
const LAST_UPDATED = "September 29, 2026";

const description =
  "The terms that govern your use of the Strata website, including submissions, intellectual property and liability.";

export const metadata = pageMetadata({
  title: "Terms & Conditions",
  description,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: "/terms",
          name: "Terms & Conditions",
          description,
          breadcrumb: "Terms",
        })}
      />
      <PageHero
        breadcrumb="Terms"
        eyebrow="Legal"
        title="Terms & conditions."
        description="The ground rules for using this website. Paid work is always covered by a separate agreement we sign with you."
      />

      <LegalProse lastUpdated={LAST_UPDATED}>
        <LegalSection heading="Accepting these terms">
          <p>
            By using this website you agree to these terms. If you don&apos;t
            agree with them, please don&apos;t use the site. These terms cover
            the website only. Any project we take on is governed by a separate
            written agreement.
          </p>
        </LegalSection>

        <LegalSection heading="Using the site">
          <p>
            You may browse and use this site for lawful purposes. Please
            don&apos;t attempt to disrupt it, access it in unauthorised ways,
            scrape it at scale, submit false information through our forms, or
            use it to send spam or malicious content.
          </p>
        </LegalSection>

        <LegalSection heading="Intellectual property">
          <p>
            The content, design, and branding on this site belong to {SITE.name}{" "}
            unless stated otherwise. You&apos;re welcome to view and share it,
            but please don&apos;t copy, republish, or reuse it commercially
            without our permission.
          </p>
        </LegalSection>

        <LegalSection heading="Anything you submit">
          <p>
            When you send us details or feedback through a form, you confirm
            it&apos;s accurate and that you&apos;re allowed to share it. We
            handle what you send according to our{" "}
            <a href="/privacy">privacy policy</a>. We&apos;ll only publish
            feedback as a review if you give explicit consent.
          </p>
        </LegalSection>

        <LegalSection heading="No warranty">
          <p>
            The site is provided &ldquo;as is.&rdquo; We work to keep it
            accurate and available, but we can&apos;t guarantee it will always
            be error-free, uninterrupted, or completely secure. Nothing here is
            professional advice.
          </p>
        </LegalSection>

        <LegalSection heading="Limitation of liability">
          <p>
            To the extent the law allows, {SITE.name} isn&apos;t liable for any
            indirect or consequential loss arising from your use of this
            website.
          </p>
        </LegalSection>

        <LegalSection heading="Links to other sites">
          <p>
            We sometimes link to third-party sites for convenience. We don&apos;t
            control them and aren&apos;t responsible for their content or
            practices.
          </p>
        </LegalSection>

        <LegalSection heading="Governing law">
          <p>
            These terms are governed by the laws of Nepal. Any disputes will be
            handled by the courts there, unless local law requires otherwise.
          </p>
        </LegalSection>

        <LegalSection heading="Changes & contact">
          <p>
            We may update these terms from time to time; the date at the top
            shows the latest version. Questions? Email{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>
        </LegalSection>
      </LegalProse>
    </>
  );
}
