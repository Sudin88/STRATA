"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw } from "lucide-react";
import { Container } from "@/components/ui/container";

/**
 * Route-level error boundary. Catches render/runtime errors in the page tree
 * and shows a branded fallback (the root layout, with navbar and footer, is
 * still rendered around this). `retry()` re-fetches and re-renders the failed
 * segment — the stable prop in Next 16.3+ (the older `reset()` only re-renders
 * without re-fetching; see node_modules/next/dist/docs/.../error.md).
 */
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // Surface the error for whatever monitoring is wired up (or the console in
    // dev). `digest` correlates with the server-side log entry in production.
    console.error(error);
  }, [error]);

  return (
    <section className="glow relative flex min-h-[80svh] items-center overflow-hidden pt-32 pb-20">
      <div aria-hidden className="grid-bg absolute inset-0 opacity-50" />
      <Container className="relative text-center">
        <p className="eyebrow mb-5 text-ion">Something broke</p>
        <h1 className="text-heading text-balance">This page hit an error.</h1>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-mut">
          Sorry about that — it&apos;s on us, not you. Try again, and if it keeps
          happening, get in touch and we&apos;ll sort it out.
        </p>
        <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <button
            onClick={retry}
            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-pill bg-fg px-7 py-3 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_26px_-10px_rgba(18,19,20,0.34)]"
          >
            <RotateCw aria-hidden className="size-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-pill border border-line-strong px-7 py-3 text-sm font-semibold text-fg transition-all duration-300 hover:-translate-y-0.5 hover:border-ion/60 hover:bg-ion-soft"
          >
            Back to home
          </Link>
        </div>
      </Container>
    </section>
  );
}
