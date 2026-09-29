"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* Three.js is heavy — load it only on capable clients, after hydration. */
const NetworkScene = dynamic(() => import("./network-scene"), {
  ssr: false,
  loading: () => <ScenePlaceholder />,
});

function ScenePlaceholder() {
  return (
    <div className="absolute inset-0 grid place-items-center" aria-hidden>
      {/* A drawn ring, not a blurred glow — the placeholder should look like the
          wireframe that replaces it. */}
      <div className="size-56 animate-pulse-soft rounded-full border border-line-strong" />
    </div>
  );
}

/** Static constellation for mobile / no-WebGL clients. */
function StaticConstellation() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 m-auto size-full max-h-105 max-w-105"
      aria-hidden
    >
      <defs>
        {/* Light-theme core: a faint accent wash. A bright centre would read as
            a glow, which is the look this theme is getting away from. */}
        <radialGradient id="core" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#1f34cf" stopOpacity="0.16" />
          <stop offset="55%" stopColor="#1f34cf" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#1f34cf" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="90" fill="url(#core)" />
      <circle cx="200" cy="200" r="130" fill="none" stroke="#1f34cf" strokeOpacity="0.22" />
      <circle
        cx="200"
        cy="200"
        r="168"
        fill="none"
        stroke="#3a3d45"
        strokeOpacity="0.2"
        strokeDasharray="3 7"
      />
      {[
        [200, 70], [312, 132], [330, 240], [252, 322], [136, 318], [72, 226], [96, 116],
        [200, 132], [262, 178], [244, 262], [156, 258], [142, 168],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i < 7 ? 3 : 2.2} fill={i % 3 === 0 ? "#1f34cf" : "#3a3d45"} />
      ))}
      <g stroke="#1f34cf" strokeOpacity="0.32" strokeWidth="1">
        <path
          d="M200 70 L200 132 L262 178 L312 132 M262 178 L244 262 L330 240 M244 262 L252 322 M244 262 L156 258 L136 318 M156 258 L142 168 L96 116 M142 168 L200 132 M156 258 L72 226"
          fill="none"
        />
      </g>
    </svg>
  );
}

interface OrbitLabel {
  text: string;
  className: string;
}

const DEFAULT_LABELS: readonly OrbitLabel[] = [
  { text: "SEO", className: "left-[6%] top-[10%]" },
  { text: "AI ADS", className: "right-[5%] top-[10%]" },
  { text: "LEADS", className: "left-[2%] bottom-[32%]" },
  { text: "CONVERSIONS", className: "right-[1%] bottom-[32%]" },
  { text: "GROWTH", className: "left-1/2 -translate-x-1/2 bottom-[6%]" },
];

/**
 * Interactive 3D growth constellation on capable viewports, with a
 * hand-drawn SVG fallback for narrow screens and clients without WebGL.
 * Labels are HTML so they stay crisp at any pixel density.
 */
export function NetworkVisual({
  labels = DEFAULT_LABELS,
}: {
  labels?: readonly OrbitLabel[];
}) {
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<"pending" | "3d" | "static">("pending");

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");

    let webgl = false;
    try {
      const canvas = document.createElement("canvas");
      webgl = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      webgl = false;
    }

    // Re-evaluate on breakpoint changes so rotation/resize swaps cleanly
    const sync = () => setMode(mq.matches && webgl ? "3d" : "static");
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div className="relative aspect-square w-full max-w-140 select-none">
      {mode === "3d" ? <NetworkScene reducedMotion={!!reduced} /> : null}
      {mode === "static" ? <StaticConstellation /> : null}
      {mode === "pending" ? <ScenePlaceholder /> : null}

      {labels.map((l, i) => (
        <motion.span
          key={l.text}
          className={`eyebrow hairline absolute inline-flex items-center gap-1.5 rounded-pill border border-line bg-surface/90 px-2.5 py-1.5 text-mut backdrop-blur-sm transition-colors duration-300 hover:border-ion/60 hover:text-fg sm:px-3 ${l.className}`}
          initial={reduced ? false : { opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1, y: reduced ? 0 : [0, -6, 0] }}
          whileHover={reduced ? undefined : { scale: 1.08 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            opacity: { delay: 0.15 + i * 0.1, duration: 0.5 },
            scale: { delay: 0.15 + i * 0.1, duration: 0.5 },
            // Each pill drifts on its own slightly different cadence so the ring
            // of labels never bobs in lockstep — the section feels alive.
            y: reduced
              ? undefined
              : { delay: 0.6 + i * 0.2, duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <span
            aria-hidden
            className={`size-1 shrink-0 rounded-full bg-ion ${reduced ? "" : "animate-pulse-soft"}`}
          />
          {l.text}
        </motion.span>
      ))}
    </div>
  );
}
