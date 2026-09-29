"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { SITE } from "@/lib/data";
import {
  BUDGET_OPTIONS,
  EMPTY,
  FIELD_ORDER,
  SERVICE_OPTIONS,
  validate,
  type FormErrors,
  type FormState,
} from "@/lib/contact";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useSpamGuard, HoneypotField } from "@/components/ui/spam-guard";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Field, inputClass } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "success" | "error";

export function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const { trap, setTrap, isLikelyBot } = useSpamGuard();

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      /* Without this a keyboard or screen-reader user submits and nothing
         appears to happen — the errors render far from their focus point. */
      const first = FIELD_ORDER.find((key) => nextErrors[key]);
      if (first) document.getElementById(`cf-${first}`)?.focus();
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      /* Surface a real error rather than a fake success when Supabase isn't
         configured — a silent no-op would lose the lead. */
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "Contact form: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to store inquiries."
        );
      }
      setStatus("error");
      return;
    }

    // Silently drop suspected bots: report success but never write the row.
    if (isLikelyBot()) {
      setStatus("success");
      setForm(EMPTY);
      return;
    }

    setStatus("sending");
    try {
      // Insert-only: inquiries are private leads, never read back by the client.
      const { error } = await supabase.from("inquiries").insert({
        name: form.name.trim(),
        company: form.company.trim() || null,
        email: form.email.trim(),
        website: form.website.trim() || null,
        service: form.service,
        budget: form.budget || null,
        details: form.details.trim(),
      });
      if (error) throw error;
      setStatus("success");
      setForm(EMPTY);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 border-t border-line bg-raise/60 py-24 sm:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeading
              eyebrow="Contact"
              title="Start the conversation."
              subtitle="Give us the shape of your project. We reply within one business day with next steps — no pressure, no jargon."
              className="mb-10"
            />
            <Reveal delay={0.1}>
              <ul className="space-y-5 text-sm">
                <li className="flex items-center gap-3.5">
                  <span className="grid size-10 place-items-center rounded-xl border border-line text-ion">
                    <Mail className="size-4" aria-hidden />
                  </span>
                  <a href={`mailto:${SITE.email}`} className="link-sweep text-mut hover:text-fg">
                    {SITE.email}
                  </a>
                </li>
                <li className="flex items-center gap-3.5">
                  <span className="grid size-10 place-items-center rounded-xl border border-line text-ion">
                    <Phone className="size-4" aria-hidden />
                  </span>
                  <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="link-sweep text-mut hover:text-fg">
                    {SITE.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3.5">
                  <span className="grid size-10 place-items-center rounded-xl border border-line text-ion">
                    <MapPin className="size-4" aria-hidden />
                  </span>
                  <span className="text-mut">{SITE.location}</span>
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
                {SITE.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-sweep text-sm text-dim transition-colors hover:text-fg"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
              <p className="mt-6 font-mono text-[10px] tracking-widest text-dim uppercase">
                Placeholder contact details — updated at launch
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <form
              onSubmit={onSubmit}
              noValidate
              className="hairline rounded-card border border-line bg-surface p-6 sm:p-9"
            >
              <HoneypotField value={trap} onChange={setTrap} />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name *" htmlFor="cf-name" error={errors.name}>
                  <input
                    id="cf-name"
                    name="name"
                    required
                    className={inputClass}
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Your full name"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "cf-name-error" : undefined}
                  />
                </Field>
                <Field label="Company" htmlFor="cf-company">
                  <input
                    id="cf-company"
                    name="company"
                    className={inputClass}
                    value={form.company}
                    onChange={(e) => set("company", e.target.value)}
                    placeholder="Company or brand"
                    autoComplete="organization"
                  />
                </Field>
                <Field label="Email *" htmlFor="cf-email" error={errors.email}>
                  <input
                    id="cf-email"
                    name="email"
                    type="email"
                    required
                    className={inputClass}
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "cf-email-error" : undefined}
                  />
                </Field>
                <Field label="Website" htmlFor="cf-website">
                  <input
                    id="cf-website"
                    name="website"
                    type="url"
                    className={inputClass}
                    value={form.website}
                    onChange={(e) => set("website", e.target.value)}
                    placeholder="https://…"
                    autoComplete="url"
                  />
                </Field>
                <Field label="Services needed *" htmlFor="cf-service" error={errors.service}>
                  <select
                    id="cf-service"
                    name="service"
                    required
                    className={cn(inputClass, !form.service && "text-dim")}
                    value={form.service}
                    onChange={(e) => set("service", e.target.value)}
                    aria-invalid={!!errors.service}
                    aria-describedby={errors.service ? "cf-service-error" : undefined}
                  >
                    <option value="" disabled>
                      Select a service
                    </option>
                    {SERVICE_OPTIONS.map((option) => (
                      <option key={option} value={option} className="bg-surface text-fg">
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Budget range" htmlFor="cf-budget">
                  <select
                    id="cf-budget"
                    name="budget"
                    className={cn(inputClass, !form.budget && "text-dim")}
                    value={form.budget}
                    onChange={(e) => set("budget", e.target.value)}
                  >
                    <option value="" disabled>
                      Select a range
                    </option>
                    {BUDGET_OPTIONS.map((option) => (
                      <option key={option} value={option} className="bg-surface text-fg">
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="mt-5">
                <Field label="Project details *" htmlFor="cf-details" error={errors.details}>
                  <textarea
                    id="cf-details"
                    name="details"
                    required
                    rows={5}
                    className={cn(inputClass, "resize-y")}
                    value={form.details}
                    onChange={(e) => set("details", e.target.value)}
                    placeholder="What are you building, and what does growth look like for you?"
                    aria-invalid={!!errors.details}
                    aria-describedby={errors.details ? "cf-details-error" : undefined}
                  />
                </Field>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex min-h-12 items-center gap-2 rounded-pill bg-fg px-7 py-3 text-sm font-semibold text-ink transition-all duration-300 enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_10px_24px_-10px_rgba(18,19,20,0.32)] disabled:opacity-60"
                >
                  <Send className="size-4" aria-hidden />
                  {status === "sending" ? "Sending…" : "Send Project Inquiry"}
                </button>
                <p aria-live="polite" className="text-sm">
                  {status === "success" && (
                    <span className="text-ion">Thanks — we&apos;ll be in touch shortly.</span>
                  )}
                  {status === "error" && (
                    <span className="text-warn">Something went wrong. Please try again.</span>
                  )}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
