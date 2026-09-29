"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/ui/logo";
import { SITE } from "@/lib/data";
import { cn } from "@/lib/utils";

const MIN_VISIBLE_MS = 700;
/** Never hold the page hostage to a stalled asset. */
const HARD_CAP_MS = 3000;

/**
 * First-paint curtain. Server-rendered so there is no flash of unstyled
 * content, then wiped away once the document finishes loading.
 *
 * Safety nets: a CSS keyframe on `.preloader` dismisses the curtain even if
 * this component never hydrates, and under `prefers-reduced-motion` CSS hides
 * it outright rather than making someone sit through an animation.
 */
export function Preloader() {
  const [progress, setProgress] = useState(6);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const pathname = usePathname();
  // The dashboard is a bare authenticated surface — no first-paint curtain.
  const onDashboard = pathname.startsWith("/dashboard");

  useEffect(() => {
    if (onDashboard) return;
    /*
     * The curtain itself is `display: none` under reduced motion, so here we
     * only skip the parts that would still be felt: the scroll lock, the
     * minimum-visible hold and the progress loop.
     */
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const start = performance.now();
    if (!reduced) document.body.style.overflow = "hidden";

    let raf = 0;
    let exitTimer = 0;
    let holdTimer = 0;
    /*
     * Scoped to this effect run, not a ref: `load`, the hard cap and a
     * possibly-already-complete document all race to dismiss the curtain, and
     * only the first should win — but a remount must start the race over.
     */
    let settled = false;

    // Ease toward 90% while the browser is still fetching
    const tick = () => {
      setProgress((p) => (p < 90 ? p + (92 - p) * 0.03 : p));
      raf = requestAnimationFrame(tick);
    };
    if (!reduced) raf = requestAnimationFrame(tick);

    const finish = () => {
      if (settled) return;
      settled = true;
      const hold = reduced
        ? 0
        : Math.max(0, MIN_VISIBLE_MS - (performance.now() - start));
      holdTimer = window.setTimeout(() => {
        cancelAnimationFrame(raf);
        setProgress(100);
        setDone(true);
        document.body.style.overflow = "";
        exitTimer = window.setTimeout(() => setGone(true), reduced ? 0 : 900);
      }, hold);
    };

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    const cap = window.setTimeout(finish, HARD_CAP_MS);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(cap);
      window.clearTimeout(holdTimer);
      window.clearTimeout(exitTimer);
      window.removeEventListener("load", finish);
      document.body.style.overflow = "";
    };
  }, [onDashboard]);

  if (onDashboard || gone) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "preloader fixed inset-0 z-70 grid place-items-center bg-ink transition-transform duration-800 ease-[cubic-bezier(0.76,0,0.24,1)]",
        done && "-translate-y-full"
      )}
    >
      {/* Grid only. A radial accent bloom here would be the first thing a
          visitor sees, and it is exactly the look this theme drops. */}
      <div aria-hidden className="grid-bg absolute inset-0 opacity-70" />

      <div
        className={cn(
          "relative flex flex-col items-center transition-opacity duration-300",
          done && "opacity-0"
        )}
      >
        <LogoMark className="size-8 animate-pulse-soft" />

        <p className="mt-5 text-[13px] font-extrabold tracking-[0.42em] text-fg uppercase">
          {SITE.name}
        </p>

        {/* 1px rail with a travelling highlight over the filled portion */}
        <div className="relative mt-7 h-px w-45 overflow-hidden bg-line-strong">
          <div
            className="absolute inset-y-0 left-0 bg-ion transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-y-0 left-0 w-1/4 animate-sweep bg-linear-to-r from-transparent via-fg/30 to-transparent" />
        </div>

        <p className="mt-4 font-mono text-[10px] tracking-[0.3em] text-dim uppercase">
          {String(Math.round(progress)).padStart(3, "0")}
        </p>
      </div>
    </div>
  );
}
