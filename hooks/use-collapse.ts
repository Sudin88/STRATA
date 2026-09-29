"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Height animation for collapsible panels.
 *
 * `grid-template-rows: 0fr → 1fr` is the tidier CSS-only technique, but inside
 * a definite-height flex column the open state collapses to 0px: the clipped
 * child has an automatic minimum size of 0, so the flexible track has nothing
 * to resolve against. Measuring the content is less elegant and always right.
 *
 * Returns a ref for the *content* wrapper — its natural height is measured and
 * kept current by a ResizeObserver, so breakpoint changes, font swaps and
 * text rewrapping never leave a clipped or over-tall panel.
 */
export function useCollapse() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    // The observer fires once on observe(), so height is correct before any
    // interaction — the first open animates from 0 to a real measurement.
    const ro = new ResizeObserver(() => setHeight(el.scrollHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { contentRef, height };
}
