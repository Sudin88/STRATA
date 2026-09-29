"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  ion: boolean;
}

interface ParticleFieldProps {
  className?: string;
  /** Surface area (px²) allotted per particle. Lower = denser. */
  density?: number;
  /** Hard ceiling so large displays keep a comfortable frame budget. */
  maxParticles?: number;
  /** Longest link line, in CSS px. */
  linkDistance?: number;
  /** Cursor repulsion radius in CSS px. 0 disables pointer interaction. */
  pointerRadius?: number;
}

/*
 * Dark ink on paper, not light on dark. Ink at a given alpha reads far stronger
 * against a light base than the reverse, so every alpha below is roughly a
 * third of what the dark theme used — the web should register as a faint
 * technical drawing, not a visible graphic.
 */
const ION = "31, 52, 207";
const GRAPHITE = "58, 61, 69";
/* Capping DPR keeps the fill rate sane on phone and Retina displays. */
const MAX_DPR = 1.5;

/**
 * Interactive constellation field rendered on a single canvas.
 *
 * Sizes itself to its parent (not the window), pauses while off-screen,
 * repels particles away from the cursor on hover-capable pointers, and
 * degrades to one static frame under `prefers-reduced-motion`.
 */
export function ParticleField({
  className,
  density = 11000,
  maxParticles = 110,
  linkDistance = 132,
  pointerRadius = 170,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const interactive = canHover && pointerRadius > 0 && !reduced;

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    /** Pointer in viewport coords; null when it has left the field. */
    const pointer = { cx: -1, cy: -1, active: false };

    function seed() {
      const target = Math.min(maxParticles, Math.round((width * height) / density));
      particles = Array.from({ length: Math.max(target, 0) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.34,
        vy: (Math.random() - 0.5) * 0.34,
        r: Math.random() * 1.4 + 0.9,
        ion: Math.random() > 0.62,
      }));
    }

    function resize() {
      const rect = parent!.getBoundingClientRect();
      width = Math.max(Math.round(rect.width), 1);
      height = Math.max(Math.round(rect.height), 1);
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduced) draw();
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      /* One layout read per frame keeps pointer math correct while scrolling. */
      let px = -1;
      let py = -1;
      if (interactive && pointer.active) {
        const rect = canvas!.getBoundingClientRect();
        px = pointer.cx - rect.left;
        py = pointer.cy - rect.top;
      }
      const hasPointer = px >= 0 && py >= 0 && px <= width && py <= height;

      // Links first so nodes sit on top of the web
      const maxSq = linkDistance * linkDistance;
      for (let a = 0; a < particles.length; a++) {
        const pa = particles[a];
        for (let b = a + 1; b < particles.length; b++) {
          const pb = particles[b];
          const dx = pa.x - pb.x;
          if (dx > linkDistance || dx < -linkDistance) continue;
          const dy = pa.y - pb.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > maxSq) continue;

          const strength = 1 - distSq / maxSq;
          // Lines within the cursor's reach darken toward ink
          const near =
            hasPointer &&
            Math.abs(pa.x - px) < pointerRadius &&
            Math.abs(pa.y - py) < pointerRadius;
          ctx!.strokeStyle = near
            ? `rgba(${GRAPHITE}, ${strength * 0.34})`
            : `rgba(${ION}, ${strength * 0.15})`;
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(pa.x, pa.y);
          ctx!.lineTo(pb.x, pb.y);
          ctx!.stroke();
        }
      }

      for (const p of particles) {
        if (!reduced) {
          if (p.x > width || p.x < 0) p.vx = -p.vx;
          if (p.y > height || p.y < 0) p.vy = -p.vy;

          if (hasPointer) {
            const dx = px - p.x;
            const dy = py - p.y;
            const dist = Math.hypot(dx, dy);
            if (dist < pointerRadius && dist > 0.01) {
              const force = (pointerRadius - dist) / pointerRadius;
              p.x -= (dx / dist) * force * 3.4;
              p.y -= (dy / dist) * force * 3.4;
            }
          }

          p.x += p.vx;
          p.y += p.vy;
        }

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = p.ion ? `rgba(${ION}, 0.5)` : `rgba(${GRAPHITE}, 0.26)`;
        ctx!.fill();
      }
    }

    function loop() {
      draw();
      frame = requestAnimationFrame(loop);
    }

    function onPointerMove(e: PointerEvent) {
      pointer.cx = e.clientX;
      pointer.cy = e.clientY;
      pointer.active = true;
    }

    function onPointerLeave() {
      pointer.active = false;
    }

    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize();

    /* Don't burn frames on a field that has scrolled out of view. */
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (reduced) return;
        if (visible && !frame) frame = requestAnimationFrame(loop);
        if (!visible && frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: "120px" }
    );
    io.observe(parent);

    if (interactive) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeave);
    }

    if (!reduced && visible) frame = requestAnimationFrame(loop);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      if (interactive) {
        window.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerleave", onPointerLeave);
      }
      particles = [];
    };
  }, [density, maxParticles, linkDistance, pointerRadius]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
    />
  );
}
