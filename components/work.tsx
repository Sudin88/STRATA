import { ArrowUpRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PROJECTS } from "@/lib/data";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

interface WorkProps {
  /** Render only the first N projects (home page preview). */
  limit?: number;
  showHeading?: boolean;
  viewAll?: { label: string; href: string };
}

/* Honest placeholder while we have no published client work yet. */
function EmptyState() {
  return (
    <Reveal>
      <div className="hairline rounded-card border border-line bg-surface p-10 text-center sm:p-14">
        <p className="eyebrow mb-4">Case studies coming soon</p>
        <h3 className="mx-auto max-w-xl text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          We&apos;re a new agency taking on our first clients.
        </h3>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-mut">
          Rather than fill this page with invented case studies, we&apos;re
          keeping it honest. As our first engagements wrap and clients sign off,
          the real work lands right here: the problem, the system we built and
          the numbers behind it. We&apos;d like one of them to be yours.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="group inline-flex min-h-12 items-center gap-2 rounded-pill bg-fg px-6 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5"
          >
            Start a project
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
          <Link
            href="/feedback"
            className="group inline-flex min-h-12 items-center gap-2 rounded-pill border border-line-strong px-6 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-ion/60 hover:bg-ion-soft"
          >
            Share your feedback
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

export function Work({ limit, showHeading = true, viewAll }: WorkProps) {
  const projects = limit ? PROJECTS.slice(0, limit) : PROJECTS;

  return (
    <section id="work" className="scroll-mt-24 border-t border-line py-24 sm:py-32">
      <Container>
        {showHeading ? (
          <SectionHeading
            eyebrow="Work"
            title="Work that will speak for itself."
            subtitle="We're just getting started, so there's nothing to show here yet. As we complete engagements, real case studies (the problem, the system we built, and the results) will be published here with client approval."
          />
        ) : (
          /* Keeps the outline from jumping h1 → h3 when the page hero supplies
             the visible heading instead. */
          <h2 className="sr-only">Our work</h2>
        )}

        {projects.length === 0 ? (
          <div className={showHeading ? "mt-12" : undefined}>
            <EmptyState />
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project, i) => (
                <Reveal key={project.name} delay={(i % 2) * 0.12}>
                  <article className="hairline group h-full overflow-hidden rounded-card border border-line bg-surface transition-all duration-500 hover:-translate-y-1.5 hover:border-line-strong">
                    <div
                      className={`relative flex aspect-16/9 items-end overflow-hidden border-b border-line bg-linear-to-br p-6 ${project.hue}`}
                    >
                      <div
                        aria-hidden
                        className="grid-bg absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="eyebrow relative">{project.index}</span>
                      <h3 className="absolute inset-0 grid place-items-center text-2xl font-extrabold tracking-[0.08em] sm:text-4xl">
                        {project.name}
                      </h3>
                    </div>

                    <div className="p-6 sm:p-7">
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span className="rounded-pill bg-ion-soft px-3 py-1 text-xs font-semibold text-ion">
                          {project.industry}
                        </span>
                        {project.services.map((s) => (
                          <span
                            key={s}
                            className="rounded-pill border border-line px-3 py-1 text-xs text-mut"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      <dl className="space-y-3 text-sm leading-relaxed">
                        <div>
                          <dt className="eyebrow mb-1">Challenge</dt>
                          <dd className="text-mut">{project.challenge}</dd>
                        </div>
                        <div>
                          <dt className="eyebrow mb-1">Solution</dt>
                          <dd className="text-mut">{project.solution}</dd>
                        </div>
                      </dl>

                      <Link
                        href="/contact"
                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-ion"
                      >
                        Start a project like this
                        <ArrowUpRight
                          aria-hidden
                          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            {viewAll && (
              <Reveal className="mt-12 flex justify-center">
                <Link
                  href={viewAll.href}
                  className="group inline-flex min-h-12 items-center gap-2 rounded-pill border border-line-strong px-6 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-ion/60 hover:bg-ion-soft"
                >
                  {viewAll.label}
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </Reveal>
            )}
          </>
        )}
      </Container>
    </section>
  );
}
