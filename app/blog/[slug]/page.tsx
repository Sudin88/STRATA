import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ParticleField } from "@/components/ui/particle-field";
import { ArticleProse } from "@/components/article-prose";
import { Cta } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { getPost, POST_SLUGS } from "@/lib/blog";
import { formatPostDate } from "@/lib/blog-format";
import { pageMetadata } from "@/lib/seo";
import { blogPostGraph } from "@/lib/schema";

/* Only the slugs we actually publish get rendered; anything else 404s. */
export const dynamicParams = false;

export function generateStaticParams() {
  return POST_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const base = pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
  });

  // A post is an article, not a generic website page — enrich the OG card.
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.published,
      modifiedTime: post.updated ?? post.published,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { Body } = post;

  return (
    <>
      <JsonLd data={blogPostGraph(post)} />

      <article>
        <header className="glow relative overflow-hidden border-b border-line pt-32 pb-14 sm:pt-40 sm:pb-16">
          <div aria-hidden className="grid-bg absolute inset-0 opacity-50" />
          <div aria-hidden className="field-fade absolute inset-0">
            <ParticleField density={20000} maxParticles={52} linkDistance={118} />
          </div>

          <Container className="relative">
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
                  <Link href="/blog" className="transition-colors hover:text-fg">
                    Blog
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="size-3" />
                </li>
                <li aria-current="page" className="text-mut normal-case">
                  {post.keyword}
                </li>
              </ol>
            </nav>

            <p className="eyebrow mb-4 text-ion">{post.keyword}</p>
            <h1 className="text-heading max-w-3xl text-balance">{post.heading}</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-mut sm:text-lg">
              {post.description}
            </p>
            <div className="mt-7 flex items-center gap-3 font-mono text-[11px] tracking-widest text-dim uppercase">
              <time dateTime={post.published}>{formatPostDate(post.published)}</time>
              <span aria-hidden>·</span>
              <span>{post.readingMinutes} min read</span>
            </div>
          </Container>
        </header>

        <ArticleProse>
          <Body />
        </ArticleProse>

        {post.faqs && post.faqs.length > 0 && (
          <section className="border-t border-line py-14 sm:py-20">
            <Container>
              <div className="mx-auto max-w-[720px]">
                <h2 className="text-2xl font-bold text-fg sm:text-3xl">
                  Frequently asked questions
                </h2>
                <dl className="mt-8 space-y-8">
                  {post.faqs.map((faq) => (
                    <div key={faq.q}>
                      <dt className="text-lg font-semibold text-fg">{faq.q}</dt>
                      <dd className="mt-2 leading-relaxed text-mut">{faq.a}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Container>
          </section>
        )}
      </article>

      <Cta />
    </>
  );
}
