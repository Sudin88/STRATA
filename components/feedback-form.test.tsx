import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UserEvent } from "@testing-library/user-event";

/* Feedback goes through submitForm() → the `submit` edge function, same as the
 * contact form. Mock submitForm and assert the payload + result-to-UI mapping. */
const { submitFormMock } = vi.hoisted(() => ({ submitFormMock: vi.fn() }));

vi.mock("@/lib/submit", () => ({ submitForm: submitFormMock }));

vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: true,
  supabase: {},
}));

/* Neutralize the spam guard so the fast automated submit isn't dropped. */
vi.mock("@/components/ui/spam-guard", () => ({
  useSpamGuard: () => ({
    trap: "",
    setTrap: vi.fn(),
    isLikelyBot: () => false,
    elapsedMs: () => 3000,
  }),
  HoneypotField: () => null,
}));

import { FeedbackForm } from "@/components/feedback-form";

async function fillValidForm(user: UserEvent) {
  await user.type(screen.getByLabelText(/name \*/i), "Ada Lovelace");
  await user.click(screen.getByRole("radio", { name: "4 stars" }));
  await user.type(
    screen.getByLabelText(/your feedback \*/i),
    "Genuinely great to work with — clear and fast."
  );
}

describe("<FeedbackForm />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits the review through the edge function and confirms success", async () => {
    submitFormMock.mockResolvedValue({ ok: true });
    const user = userEvent.setup();

    render(<FeedbackForm />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send feedback/i }));

    await waitFor(() => expect(submitFormMock).toHaveBeenCalledTimes(1));
    const arg = submitFormMock.mock.calls[0][0];
    expect(arg.kind).toBe("feedback");
    expect(arg.payload).toMatchObject({ name: "Ada Lovelace", rating: 4 });
    expect(await screen.findByText(/really appreciate/i)).toBeInTheDocument();
  });

  it("blocks submission and shows field errors when required fields are empty", async () => {
    const user = userEvent.setup();

    render(<FeedbackForm />);
    await user.click(screen.getByRole("button", { name: /send feedback/i }));

    expect(submitFormMock).not.toHaveBeenCalled();
    expect(screen.getByText(/enter your name/i)).toBeInTheDocument();
    expect(screen.getByText(/select a star rating/i)).toBeInTheDocument();
  });

  it("surfaces a generic error state when the submit fails", async () => {
    submitFormMock.mockResolvedValue({ ok: false, reason: "error" });
    const user = userEvent.setup();

    render(<FeedbackForm />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send feedback/i }));

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  });

  it("supports arrow-key selection in the star rating (radiogroup pattern)", async () => {
    const user = userEvent.setup();

    render(<FeedbackForm />);
    await user.click(screen.getByRole("radio", { name: "3 stars" }));
    expect(screen.getByRole("radio", { name: "3 stars" })).toHaveAttribute(
      "aria-checked",
      "true"
    );

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "4 stars" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });
});
