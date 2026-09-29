"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/ui/logo";
import { Field, inputClass } from "@/components/ui/field";
import { createClient } from "@/lib/supabase/client";

/*
 * Email + password sign-in for the single agency owner. Public sign-ups are
 * disabled in Supabase Auth, so this is a login-only screen (no "create
 * account"). The real access boundary is RLS on `inquiries` — this form only
 * establishes a session; a non-admin who signs in still sees zero leads.
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "signing-in">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("signing-in");

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError("That email and password don't match. Please try again.");
      setStatus("idle");
      return;
    }

    // Server Components read the fresh session cookie only after a refresh.
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <LogoMark className="size-8" />
          <h1 className="mt-4 text-lg font-semibold text-fg">Leads dashboard</h1>
          <p className="mt-1 text-sm text-mut">Sign in to continue.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="hairline space-y-5 rounded-card border border-line bg-surface p-6"
        >
          <Field label="Email" htmlFor="login-email">
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Password" htmlFor="login-password">
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </Field>

          {error && (
            <p role="alert" className="text-sm text-warn">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "signing-in"}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-pill bg-fg px-7 py-3 text-sm font-semibold text-ink transition-all duration-300 enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_10px_24px_-10px_rgba(18,19,20,0.32)] disabled:opacity-60"
          >
            {status === "signing-in" ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
