"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "inverse" | "inverse-ghost";

interface ButtonProps {
  href: string;
  variant?: Variant;
  withArrow?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Magnetic CTA button: eases toward the cursor on hover (desktop only),
 * settles back on leave. Falls back to a static button under reduced motion.
 */
export function Button({
  href,
  variant = "primary",
  withArrow = true,
  className,
  children,
}: ButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 22 });
  const sy = useSpring(y, { stiffness: 260, damping: 22 });

  function onMove(e: React.MouseEvent) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.18);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.28);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-block"
    >
      <Link
        href={href}
        className={cn(
          "group inline-flex min-h-12 items-center justify-center gap-2 rounded-pill px-7 py-3 text-sm font-semibold transition-all duration-300",
          variant === "primary" &&
            "bg-fg text-ink hover:-translate-y-0.5 hover:shadow-[0_10px_26px_-10px_rgba(18,19,20,0.34)]",
          variant === "ghost" &&
            "border border-line-strong text-fg hover:-translate-y-0.5 hover:border-ion/60 hover:bg-ion-soft",
          /* For use on the inverted (near-black) CTA block */
          variant === "inverse" && "bg-ink text-fg hover:-translate-y-0.5 hover:bg-white",
          variant === "inverse-ghost" &&
            "border border-white/25 text-ink hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10",
          className
        )}
      >
        {children}
        {withArrow && (
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
          />
        )}
      </Link>
    </motion.div>
  );
}
