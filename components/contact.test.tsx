import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UserEvent } from "@testing-library/user-event";

/*
 * Mock the Supabase client the form inserts through. `insertMock` is hoisted so
 * the factory can close over it, and each test sets its resolved value.
 */
const { insertMock, fromMock } = vi.hoisted(() => {
  const insertMock = vi.fn();
  const fromMock = vi.fn(() => ({ insert: insertMock }));
  return { insertMock, fromMock };
});

vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: true,
  supabase: { from: fromMock },
}));

/*
 * Neutralize the spam guard so these tests exercise the submission path
 * directly. Its own timing/honeypot behavior is orthogonal to what we assert
 * here, and the real 1500ms timing check would otherwise flag the fast
 * automated submit as a bot and silently skip the insert.
 */
vi.mock("@/components/ui/spam-guard", () => ({
  useSpamGuard: () => ({ trap: "", setTrap: vi.fn(), isLikelyBot: () => false }),
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

  it("inserts the inquiry into Supabase and confirms success", async () => {
    insertMock.mockResolvedValue({ error: null });
    const user = userEvent.setup();

    render(<Contact />);
    await fillValidForm(user);
    await user.click(
      screen.getByRole("button", { name: /send project inquiry/i })
    );

    await waitFor(() => expect(insertMock).toHaveBeenCalledTimes(1));
    expect(fromMock).toHaveBeenCalledWith("inquiries");
    expect(insertMock.mock.calls[0][0]).toMatchObject({
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

    expect(insertMock).not.toHaveBeenCalled();
    expect(screen.getByText(/enter your name/i)).toBeInTheDocument();
    expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
  });

  it("surfaces an error state when the insert fails", async () => {
    insertMock.mockResolvedValue({ error: { message: "insert failed" } });
    const user = userEvent.setup();

    render(<Contact />);
    await fillValidForm(user);
    await user.click(
      screen.getByRole("button", { name: /send project inquiry/i })
    );

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  });
});
