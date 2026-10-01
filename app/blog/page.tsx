import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { Cta } from "@/components/cta";
import { POSTS } from "@/lib/blog";
import { formatPostDate } from "@/lib/blog-format";
import { pageMetadata } from "@/lib/seo";
import { pageGraph, blogListingSchema } from "@/lib/schema";
import { JsonLd } from "@/components/json-ld";

const title = "Blog: AI Marketing, SEO & Web Insights";
const description =
  "Honest, practical writing on AI marketing, SEO, websites and advertising — what works, what doesn't, and how we actually do the work.";

export const metadata = pageMetadata({
  title,
  description,
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: "/blog",
          name: title,
          description,
          breadcrumb: "Blog",
          type: "CollectionPage",
          extra: [blogListingSchema(POSTS)],
        })}
      />
      <PageHero
        breadcrumb="Blog"
        eyebrow="Blog"
        title="Notes on doing AI marketing well."
        description="No growth-hacking fluff. Just how AI actually fits into SEO, websites, video and ads — and where it doesn't."
      />

      <section className="py-14 sm:py-20">
        <Container>
          {POSTS.length === 0 ? (
            <p className="mx-auto max-w-xl text-center text-mut">
              Nothing published yet. Our first articles are on the way.
            </p>
          ) : (
            <ul className="mx-auto grid max-w-3xl gap-5">
              {POSTS.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block rounded-2xl border border-line p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-ion/50 hover:bg-ion-soft sm:p-8"
                  >
                    <p className="eyebrow mb-4 text-ion">{post.keyword}</p>
                    <h2 className="text-xl font-bold text-fg sm:text-2xl">
                      {post.heading}
                    </h2>
                    <p className="mt-3 leading-relaxed text-mut">
                      {post.description}
                    </p>
                    <div className="mt-5 flex items-center gap-3 font-mono text-[11px] tracking-widest text-dim uppercase">
                      <time dateTime={post.published}>
                        {formatPostDate(post.published)}
                      </time>
                      <span aria-hidden>·</span>
                      <span>{post.readingMinutes} min read</span>
                      <ArrowRight
                        aria-hidden
                        className="ml-auto size-4 text-mut transition-transform duration-300 group-hover:translate-x-1 group-hover:text-fg"
                      />
                    </div>
                  </Link>
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
