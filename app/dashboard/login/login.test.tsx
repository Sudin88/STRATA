import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

/*
 * The login form only establishes a Supabase session; the real access boundary
 * is RLS. Here we mock the browser client and the router, then assert the form
 * signs in with the entered credentials, redirects on success, and surfaces an
 * error (without redirecting) on failure.
 */
const { signInMock, replaceMock, refreshMock } = vi.hoisted(() => ({
  signInMock: vi.fn(),
  replaceMock: vi.fn(),
  refreshMock: vi.fn(),
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({ auth: { signInWithPassword: signInMock } }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock, refresh: refreshMock }),
}));

import LoginPage from "@/app/dashboard/login/page";

async function signIn(email: string, password: string) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/email/i), email);
  await user.type(screen.getByLabelText(/password/i), password);
  await user.click(screen.getByRole("button", { name: /sign in/i }));
}

describe("<LoginPage />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("signs in with the entered credentials and redirects to the dashboard", async () => {
    signInMock.mockResolvedValue({ error: null });

    render(<LoginPage />);
    await signIn("  owner@example.com  ", "hunter2");

    await waitFor(() =>
      expect(signInMock).toHaveBeenCalledWith({
        email: "owner@example.com",
        password: "hunter2",
      })
    );
    expect(replaceMock).toHaveBeenCalledWith("/dashboard");
    expect(refreshMock).toHaveBeenCalled();
  });

  it("shows an error and does not redirect when sign-in fails", async () => {
    signInMock.mockResolvedValue({ error: { message: "Invalid login credentials" } });

    render(<LoginPage />);
    await signIn("owner@example.com", "wrong");

    expect(await screen.findByRole("alert")).toHaveTextContent(/don't match/i);
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
