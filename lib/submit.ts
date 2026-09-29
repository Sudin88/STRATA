import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/*
 * Client → server bridge for both public forms. The browser used to insert
 * straight into Supabase with the anon key; it now calls the `submit` edge
 * function instead (supabase/functions/submit/index.ts), which is the only
 * writer once anon INSERT is revoked. The function re-checks the spam signals,
 * rate-limits per IP, and verifies the email is really deliverable before it
 * writes a row — none of which the client can be trusted to enforce.
 */

export type SubmitKind = "inquiry" | "feedback";

/** Discriminated result so callers can map each failure to the right UI. */
export type SubmitResult =
  | { ok: true }
  | { ok: false; reason: "invalid_email" | "rate_limited" | "unconfigured" | "error" };

interface SubmitArgs {
  kind: SubmitKind;
  payload: Record<string, unknown>;
  /** Honeypot value + ms since mount, from useSpamGuard — re-checked server-side. */
  trap: string;
  elapsedMs: number;
}

export async function submitForm({
  kind,
  payload,
  trap,
  elapsedMs,
}: SubmitArgs): Promise<SubmitResult> {
  if (!isSupabaseConfigured || !supabase) return { ok: false, reason: "unconfigured" };

  try {
    const { data, error } = await supabase.functions.invoke("submit", {
      body: { kind, trap, elapsedMs, payload },
    });

    // functions.invoke throws (FunctionsHttpError) on non-2xx; read the reason
    // off the response body so 422/429 map to specific messages, not a generic
    // failure. The context is the raw Response.
    if (error) {
      const reason = await reasonFromError(error);
      return { ok: false, reason };
    }

    if (data && typeof data === "object" && (data as { ok?: boolean }).ok) {
      return { ok: true };
    }
    return { ok: false, reason: "error" };
  } catch {
    return { ok: false, reason: "error" };
  }
}

/** Pull our `{ error: "..." }` code out of a FunctionsHttpError, if present. */
async function reasonFromError(
  error: unknown
): Promise<"invalid_email" | "rate_limited" | "error"> {
  try {
    const ctx = (error as { context?: Response }).context;
    if (ctx && typeof ctx.json === "function") {
      const body = await ctx.json();
      const code = (body as { error?: string }).error;
      if (code === "invalid_email") return "invalid_email";
      if (code === "rate_limited") return "rate_limited";
    }
  } catch {
    // no parseable body — fall through
  }
  return "error";
}
