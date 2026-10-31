import { PageHero } from "@/components/page-hero";
import { Services } from "@/components/services";
import { GrowthEngine } from "@/components/growth-engine";
import { AiDemo } from "@/components/ai-demo";
import { Cta } from "@/components/cta";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { pageMetadata } from "@/lib/seo";
import { pageGraph, serviceCatalogSchema } from "@/lib/schema";
import { JsonLd } from "@/components/json-ld";

const title = "AI Marketing Services: SEO, Websites, Video & Ads";
const description =
  "Eight connected services: AI SEO and content, website design and development, AI ad videos, motion graphics, social media, paid advertising, event and experiential marketing — with AI marketing automation coming soon.";

/* Deep-dive pages for the markets our services specialize into. */
const SPECIALIZATIONS = [
  {
    name: "Event & Experiential Marketing",
    href: "/services/event-marketing",
    blurb: "Fill the room: pages, ads, social and recaps for live, virtual and hybrid events.",
  },
  {
    name: "Experiential Marketing",
    href: "/services/experiential-marketing",
    blurb: "Brand activations, pop-ups and launches — marketing for experiences people walk into.",
  },
  {
    name: "Creative & Communications",
    href: "/services/creative-communications",
    blurb: "Messaging, positioning and copy that make every channel say something worth hearing.",
  },
  {
    name: "Experience Design",
    href: "/services/experience-design",
    blurb: "Landing pages, microsites, email journeys and the conversion paths in between.",
  },
] as const;

export const metadata = pageMetadata({
  title,
  description,
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: "/services",
          name: title,
          description,
          breadcrumb: "Services",
          extra: [serviceCatalogSchema()],
        })}
      />
      <PageHero
        breadcrumb="Services"
        eyebrow="Services"
        title="Eight services, one connected growth system."
        description="Most agencies sell you channels one at a time. We connect them, so your site, content, creative and campaigns work together instead of pulling in different directions."
      />
      <Services showHeading={false} />
      <GrowthEngine />
      <AiDemo />
      {/* Specializations — where the services learn to fit particular jobs. */}
      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Specializations"
            title="The same services, tuned for specific arenas."
            subtitle="Deep-dive pages on where we most often point this system — each one a full picture of what we'd run for that kind of work."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {SPECIALIZATIONS.map((item, i) => (
              <Reveal key={item.href} delay={Math.min(i * 0.08, 0.24)} className="h-full">
                <a
                  href={item.href}
                  className="group flex h-full flex-col rounded-2xl border border-line p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-ion/50 hover:bg-ion-soft sm:p-8"
                >
                  <p className="eyebrow mb-3 text-ion">Specialization</p>
                  <h3 className="text-lg font-bold text-fg sm:text-xl">{item.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mut">{item.blurb}</p>
                </a>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <Cta />
    </>
  );
}
