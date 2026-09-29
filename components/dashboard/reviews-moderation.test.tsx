import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { DashboardReview } from "@/lib/dashboard/reviews";
import { ReviewsModeration } from "@/components/dashboard/reviews-moderation";
import { setReviewApproved } from "@/app/dashboard/actions";

vi.mock("@/app/dashboard/actions", () => ({
  setReviewApproved: vi.fn(() => Promise.resolve()),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

const mockedSetApproved = vi.mocked(setReviewApproved);

function review(overrides: Partial<DashboardReview> = {}): DashboardReview {
  return {
    id: crypto.randomUUID(),
    created_at: "2026-09-20T10:00:00.000Z",
    name: "Ada Lovelace",
    company: "Analytical Engines",
    email: "ada@example.com",
    rating: 5,
    feedback: "They shipped exactly what we needed.",
    consent: true,
    approved: false,
    ...overrides,
  };
}

describe("<ReviewsModeration />", () => {
  beforeEach(() => {
    mockedSetApproved.mockClear();
  });

  it("shows an honest empty state when there are no reviews", () => {
    render(<ReviewsModeration reviews={[]} />);
    expect(screen.getByText(/no reviews yet/i)).toBeInTheDocument();
  });

  it("renders each review's rating, author and feedback", () => {
    render(
      <ReviewsModeration
        reviews={[review({ feedback: "Great partner to work with." })]}
      />
    );
    expect(screen.getByText(/Ada Lovelace/)).toBeInTheDocument();
    expect(screen.getByText(/Great partner to work with\./)).toBeInTheDocument();
  });

  it("approves a pending review", async () => {
    const user = userEvent.setup();
    const r = review({ approved: false, consent: true });
    render(<ReviewsModeration reviews={[r]} />);

    await user.click(screen.getByRole("button", { name: /approve/i }));

    expect(mockedSetApproved).toHaveBeenCalledWith(r.id, true);
  });

  it("hides an approved review", async () => {
    const user = userEvent.setup();
    const r = review({ approved: true });
    render(<ReviewsModeration reviews={[r]} />);

    await user.click(screen.getByRole("button", { name: /hide/i }));

    expect(mockedSetApproved).toHaveBeenCalledWith(r.id, false);
  });

  it("won't let you publish a review without consent", () => {
    render(<ReviewsModeration reviews={[review({ consent: false })]} />);
    expect(screen.getByRole("button", { name: /approve/i })).toBeDisabled();
    expect(screen.getByText(/no consent to publish/i)).toBeInTheDocument();
  });
});
