"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/*
 * Lightweight, no-dependency spam defense for the public forms that write to
 * Supabase. Two signals, both invisible to real users:
 *
 *   1. Honeypot  — a hidden field no human ever sees or tabs to. Bots that
 *                  auto-fill every input will fill it; a non-empty value is a
 *                  near-certain bot.
 *   2. Timing    — humans take a moment to read and fill a form. A submit that
 *                  lands within MIN_FILL_MS of mount is almost always scripted.
 *
 * When either trips, the caller fakes a success response and skips the insert,
 * so the bot gets no signal that it was caught. This stops the common
 * form-filling bots. It does NOT stop an attacker POSTing straight at the
 * Supabase REST endpoint — for that, add Cloudflare Turnstile or an Edge
 * Function proxy later. See the note in components/feedback-form.tsx.
 */
const MIN_FILL_MS = 1500;

export function useSpamGuard() {
  // Record mount time in an effect rather than during render: React 19 forbids
  // calling the impure Date.now() while rendering. Until the effect runs the
  // ref is 0, which reads as "plenty of time elapsed" — i.e. it fails open (a
  // real user is never wrongly flagged), which is the safe direction here.
  const startedAt = useRef(0);
  const [trap, setTrap] = useState("");

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const isLikelyBot = useCallback(() => {
    if (trap.trim() !== "") return true;
    if (startedAt.current !== 0 && Date.now() - startedAt.current < MIN_FILL_MS)
      return true;
    return false;
  }, [trap]);

  return { trap, setTrap, isLikelyBot };
}

/**
 * Off-screen honeypot input. Hidden from sighted users (positioned off-canvas)
 * and from assistive tech (`aria-hidden` + `tabIndex={-1}`), and excluded from
 * autofill, so only a bot ever populates it.
 */
export function HoneypotField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden"
    >
      {/* Named to look like a real field a bot would want to fill. */}
      <label>
        Company website
        <input
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}
