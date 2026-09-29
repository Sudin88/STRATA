import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UserEvent } from "@testing-library/user-event";

/*
 * The form no longer writes to Supabase directly — it calls submitForm(), which
 * invokes the `submit` edge function (rate limit + email verification live
 * there, and have their own coverage). Here we mock submitForm and assert the
 * component sends the right payload and maps each result to the right UI.
 */
const { submitFormMock } = vi.hoisted(() => ({ submitFormMock: vi.fn() }));

vi.mock("@/lib/submit", () => ({ submitForm: submitFormMock }));

vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: true,
  supabase: {},
}));

/*
 * Neutralize the spam guard so these tests exercise the submission path
 * directly. Its own timing/honeypot behavior is orthogonal to what we assert
 * here, and the real 1500ms timing check would otherwise flag the fast
 * automated submit as a bot and silently skip the submit.
 */
vi.mock("@/components/ui/spam-guard", () => ({
  useSpamGuard: () => ({
    trap: "",
    setTrap: vi.fn(),
    isLikelyBot: () => false,
    elapsedMs: () => 3000,
  }),
  HoneypotField: () => null,
}));

import { Contact } from "@/components/contact";

async function fillValidForm(user: UserEvent) {
  await user.type(screen.getByLabelText(/name \*/i), "Ada Lovelace");
  await user.type(screen.getByLabelText(/email \*/i), "ada@example.com");
  await user.selectOptions(screen.getByLabelText(/services needed \*/i), "SEO");
  await user.type(
    screen.getByLabelText(/project details \*/i),
    "We need help ranking our new product pages."
  );
}

describe("<Contact />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits the inquiry through the edge function and confirms success", async () => {
    submitFormMock.mockResolvedValue({ ok: true });
    const user = userEvent.setup();

    render(<Contact />);
    await fillValidForm(user);
    await user.click(
      screen.getByRole("button", { name: /send project inquiry/i })
    );

    await waitFor(() => expect(submitFormMock).toHaveBeenCalledTimes(1));
    const arg = submitFormMock.mock.calls[0][0];
    expect(arg.kind).toBe("inquiry");
    expect(arg.payload).toMatchObject({
      name: "Ada Lovelace",
      email: "ada@example.com",
      service: "SEO",
    });
    expect(await screen.findByText(/in touch shortly/i)).toBeInTheDocument();
  });

  it("blocks submission and shows field errors when required fields are empty", async () => {
    const user = userEvent.setup();

    render(<Contact />);
    await user.click(
      screen.getByRole("button", { name: /send project inquiry/i })
    );

    expect(submitFormMock).not.toHaveBeenCalled();
    expect(screen.getByText(/enter your name/i)).toBeInTheDocument();
    expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
  });

  it("shows an email error when the server can't verify the address", async () => {
    submitFormMock.mockResolvedValue({ ok: false, reason: "invalid_email" });
    const user = userEvent.setup();

    render(<Contact />);
    await fillValidForm(user);
    await user.click(
      screen.getByRole("button", { name: /send project inquiry/i })
    );

    expect(await screen.findByText(/couldn't verify that email/i)).toBeInTheDocument();
  });

  it("shows a rate-limit message when the server throttles the submit", async () => {
    submitFormMock.mockResolvedValue({ ok: false, reason: "rate_limited" });
    const user = userEvent.setup();

    render(<Contact />);
    await fillValidForm(user);
    await user.click(
      screen.getByRole("button", { name: /send project inquiry/i })
    );

    expect(await screen.findByText(/sent a few messages already/i)).toBeInTheDocument();
  });

  it("surfaces a generic error state when the submit fails", async () => {
    submitFormMock.mockResolvedValue({ ok: false, reason: "error" });
    const user = userEvent.setup();

    render(<Contact />);
    await fillValidForm(user);
    await user.click(
      screen.getByRole("button", { name: /send project inquiry/i })
    );

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  });
});
