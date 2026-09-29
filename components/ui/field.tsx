import type { ReactNode } from "react";

/**
 * Shared form primitives for the contact and feedback forms — a single source
 * of truth so the two forms can't drift apart in styling or a11y wiring.
 */

/** Input/select/textarea base styles. Compose extra classes with `cn`. */
export const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-fg placeholder:text-dim transition-colors focus:border-ion/60 focus:outline-none";

export function Field({
  label,
  error,
  htmlFor,
  children,
}: {
  label: string;
  error?: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-xs font-semibold tracking-wide text-mut uppercase"
      >
        {label}
      </label>
      {children}
      {error && (
        /* `role="alert"` announces the message when it appears; the matching
           `aria-describedby` on the control re-announces it on every later
           focus, which is what a keyboard user correcting the field needs. */
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-xs text-warn">
          {error}
        </p>
      )}
    </div>
  );
}
