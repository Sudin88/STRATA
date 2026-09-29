import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/*
 * notify-inquiry — emails the agency when a new row lands in public.inquiries.
 *
 * Invoked by a Postgres AFTER INSERT trigger (via pg_net) on that table, NOT by
 * the browser. It is gated by a shared secret header instead of a Supabase JWT
 * (so it is deployed with verify_jwt = false): the trigger sends
 * `x-inquiry-secret` and we reject anything that doesn't match. This keeps the
 * lead data server-side — the anon client never touches this function.
 *
 * Required function secrets (set in the Supabase dashboard → Edge Functions →
 * Secrets, or `supabase secrets set`):
 *   RESEND_API_KEY        — Resend API key (secret; never in client/committed code)
 *   INQUIRY_NOTIFY_TO     — where alerts are sent, e.g. leads@yourdomain.com
 *   INQUIRY_NOTIFY_FROM   — verified Resend sender, e.g. "Strata <no-reply@yourdomain.com>"
 *   INQUIRY_WEBHOOK_SECRET — random string shared with the DB trigger
 */

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const NOTIFY_TO = Deno.env.get("INQUIRY_NOTIFY_TO");
const NOTIFY_FROM = Deno.env.get("INQUIRY_NOTIFY_FROM");
const WEBHOOK_SECRET = Deno.env.get("INQUIRY_WEBHOOK_SECRET");

interface Inquiry {
  id: string;
  created_at: string;
  name: string;
  company: string | null;
  email: string;
  website: string | null;
  service: string;
  budget: string | null;
  details: string;
}

/** Escape the characters that matter in HTML text *and* attribute contexts
 *  (the email is interpolated into a `mailto:` href), so a crafted value can't
 *  break out of the attribute or inject markup. */
function esc(value: string | null): string {
  if (!value) return "—";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

Deno.serve(async (req) => {
  // Reject anything without the exact shared secret. length check first so a
  // missing/short header can't sneak past the comparison.
  const provided = req.headers.get("x-inquiry-secret") ?? "";
  if (
    !WEBHOOK_SECRET ||
    provided.length !== WEBHOOK_SECRET.length ||
    provided !== WEBHOOK_SECRET
  ) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!RESEND_API_KEY || !NOTIFY_TO || !NOTIFY_FROM) {
    console.error("notify-inquiry: missing RESEND_API_KEY / NOTIFY_TO / NOTIFY_FROM");
    return new Response(JSON.stringify({ error: "not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let row: Inquiry;
  try {
    const payload = await req.json();
    row = payload.record as Inquiry;
    if (!row?.email || !row?.name) throw new Error("missing record fields");
  } catch {
    return new Response(JSON.stringify({ error: "bad payload" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const subject = `New inquiry — ${row.name}${row.company ? ` (${row.company})` : ""}`;
  const html = `
    <h2 style="margin:0 0 12px">New project inquiry</h2>
    <table style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px">
      <tr><td style="padding:4px 12px 4px 0;color:#5a5d63">Name</td><td>${esc(row.name)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#5a5d63">Company</td><td>${esc(row.company)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#5a5d63">Email</td><td><a href="mailto:${esc(row.email)}">${esc(row.email)}</a></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#5a5d63">Website</td><td>${esc(row.website)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#5a5d63">Service</td><td>${esc(row.service)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#5a5d63">Budget</td><td>${esc(row.budget)}</td></tr>
    </table>
    <p style="margin:16px 0 4px;color:#5a5d63;font-family:system-ui,sans-serif;font-size:14px">Details</p>
    <p style="white-space:pre-wrap;font-family:system-ui,sans-serif;font-size:14px">${esc(row.details)}</p>
  `;

  // Every outbound call gets a hard timeout: a hung Resend request must not keep
  // the function (and its billed wall-clock) alive indefinitely. 10s sits well
  // above Resend's normal latency, so we only trip on a genuine stall.
  // AbortSignal.timeout throws a TimeoutError (a DOMException) when it fires.
  let res: Response;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: [NOTIFY_TO],
        reply_to: row.email,
        subject,
        html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err) {
    // Log only the failure kind, never the error's cause chain, so a network
    // error can't surface request headers (the API key) into the logs.
    const timedOut = err instanceof DOMException && err.name === "TimeoutError";
    console.error("notify-inquiry: Resend request failed", timedOut ? "timeout" : "network");
    return new Response(
      JSON.stringify({ error: timedOut ? "send timeout" : "send failed" }),
      { status: 504, headers: { "Content-Type": "application/json" } },
    );
  }

  if (!res.ok) {
    const detail = await res.text();
    console.error("notify-inquiry: Resend failed", res.status, detail);
    return new Response(JSON.stringify({ error: "send failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
