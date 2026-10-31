import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { Cta } from "@/components/cta";
import { NEWS } from "@/lib/news";
import { formatPostDate } from "@/lib/blog-format";
import { pageMetadata } from "@/lib/seo";
import { pageGraph } from "@/lib/schema";
import { JsonLd } from "@/components/json-ld";

const title = "Company News, Announcements & Press";
const description =
  "Real updates from Strata: capabilities shipped, projects signed off, public appearances — published only when there's something worth saying.";

export const metadata = pageMetadata({
  title,
  description,
  path: "/news",
});

export default function NewsPage() {
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: "/news",
          name: title,
          description,
          breadcrumb: "News",
          type: "CollectionPage",
        })}
      />
      <PageHero
        breadcrumb="News"
        eyebrow="News"
        title="What's happening at Strata."
        description="Announcements, press and short updates about the agency — new capabilities shipped, engagements we're cleared to talk about, talks and appearances. When there's real news, it lands here first."
      />

      <section className="py-14 sm:py-20">
        <Container>
          {NEWS.length === 0 ? (
            <div className="mx-auto max-w-xl text-center">
              <p className="text-mut">
                Nothing to announce yet. We publish here only when there&apos;s
                something real to say — no filler press releases to look busy.
              </p>
              <p className="mt-4 text-sm text-dim">
                In the meantime,{" "}
                <Link href="/blog" className="text-ion underline underline-offset-2 hover:text-fg">
                  the blog
                </Link>{" "}
                covers how we think and actually do the work.
              </p>
            </div>
          ) : (
            <ul className="mx-auto max-w-3xl">
              {NEWS.map((entry) => (
                <li key={entry.id} id={entry.id} className="scroll-mt-28">
                  <div className="rounded-2xl border border-line p-6 sm:p-8">
                    <div className="flex items-center gap-3 font-mono text-[11px] tracking-widest uppercase">
                      <span className="text-ion">{entry.kind}</span>
                      <time dateTime={entry.date} className="text-dim">
                        {formatPostDate(entry.date)}
                      </time>
                    </div>
                    <h2 className="mt-3 text-xl font-bold text-fg sm:text-2xl">
                      {entry.title}
                    </h2>
                    <p className="mt-3 leading-relaxed text-mut">{entry.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <Cta />
    </>
  );
}
