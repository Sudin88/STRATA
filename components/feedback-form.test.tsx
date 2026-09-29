import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UserEvent } from "@testing-library/user-event";

/* Same Supabase mock shape as contact.test.tsx — a hoisted insert spy. */
const { insertMock, fromMock } = vi.hoisted(() => {
  const insertMock = vi.fn();
  const fromMock = vi.fn(() => ({ insert: insertMock }));
  return { insertMock, fromMock };
});

vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: true,
  supabase: { from: fromMock },
}));

/* Neutralize the spam guard so the fast automated submit isn't dropped. */
vi.mock("@/components/ui/spam-guard", () => ({
  useSpamGuard: () => ({ trap: "", setTrap: vi.fn(), isLikelyBot: () => false }),
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

  it("inserts the review into Supabase and confirms success", async () => {
    insertMock.mockResolvedValue({ error: null });
    const user = userEvent.setup();

    render(<FeedbackForm />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send feedback/i }));

    await waitFor(() => expect(insertMock).toHaveBeenCalledTimes(1));
    expect(fromMock).toHaveBeenCalledWith("reviews");
    expect(insertMock.mock.calls[0][0]).toMatchObject({
      name: "Ada Lovelace",
      rating: 4,
    });
    expect(await screen.findByText(/really appreciate/i)).toBeInTheDocument();
  });

  it("blocks submission and shows field errors when required fields are empty", async () => {
    const user = userEvent.setup();

    render(<FeedbackForm />);
    await user.click(screen.getByRole("button", { name: /send feedback/i }));

    expect(insertMock).not.toHaveBeenCalled();
    expect(screen.getByText(/enter your name/i)).toBeInTheDocument();
    expect(screen.getByText(/select a star rating/i)).toBeInTheDocument();
  });

  it("surfaces an error state when the insert fails", async () => {
    insertMock.mockResolvedValue({ error: { message: "insert failed" } });
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
