import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Inquiry } from "@/lib/dashboard/inquiries";
import { LeadsTable } from "@/components/dashboard/leads-table";

// LeadStatusSelect (rendered per row) calls this Server Action and useRouter;
// stub both so the client component renders in jsdom.
vi.mock("@/app/dashboard/actions", () => ({
  updateLeadStatus: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

function lead(overrides: Partial<Inquiry> = {}): Inquiry {
  return {
    id: crypto.randomUUID(),
    created_at: "2026-09-20T10:00:00.000Z",
    name: "Ada Lovelace",
    company: "Analytical Engines",
    email: "ada@example.com",
    website: "example.com",
    service: "SEO",
    budget: "$5k–$10k",
    details: "We want to rank our new product pages.",
    status: "new",
    ...overrides,
  };
}

describe("<LeadsTable />", () => {
  it("shows an honest empty state when there are no leads", () => {
    render(<LeadsTable inquiries={[]} />);
    expect(screen.getByText(/no leads yet/i)).toBeInTheDocument();
    // No search box when there's nothing to search.
    expect(screen.queryByLabelText(/search leads/i)).not.toBeInTheDocument();
  });

  it("renders a row per lead", () => {
    render(
      <LeadsTable
        inquiries={[
          lead({ name: "Ada Lovelace", email: "ada@example.com" }),
          lead({ name: "Grace Hopper", email: "grace@example.com" }),
        ]}
      />
    );
    expect(screen.getByText(/Ada Lovelace/)).toBeInTheDocument();
    expect(screen.getByText(/Grace Hopper/)).toBeInTheDocument();
  });

  it("renders a status control per lead and an export button", () => {
    render(
      <LeadsTable
        inquiries={[
          lead({ name: "Ada Lovelace" }),
          lead({ name: "Grace Hopper" }),
        ]}
      />
    );
    expect(screen.getAllByLabelText(/lead status/i)).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: /export csv/i })
    ).toBeInTheDocument();
  });

  it("reflects the lead's current status in the control", () => {
    render(<LeadsTable inquiries={[lead({ status: "won" })]} />);
    const select = screen.getByLabelText(/lead status/i) as HTMLSelectElement;
    expect(select.value).toBe("won");
  });

  it("filters by name, email, service or company as you type", async () => {
    const user = userEvent.setup();
    render(
      <LeadsTable
        inquiries={[
          lead({ name: "Ada Lovelace", email: "ada@example.com" }),
          lead({ name: "Grace Hopper", email: "grace@example.com" }),
        ]}
      />
    );

    await user.type(screen.getByLabelText(/search leads/i), "grace");

    expect(screen.getByText(/Grace Hopper/)).toBeInTheDocument();
    expect(screen.queryByText(/Ada Lovelace/)).not.toBeInTheDocument();
  });

  it("tells the user when a search matches nothing", async () => {
    const user = userEvent.setup();
    render(<LeadsTable inquiries={[lead()]} />);

    await user.type(screen.getByLabelText(/search leads/i), "nobody-here");

    expect(screen.getByText(/no leads match/i)).toBeInTheDocument();
  });
});
