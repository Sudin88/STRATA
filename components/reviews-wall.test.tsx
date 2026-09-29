import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";

/*
 * The wall reads through a chained query builder
 * (from().select().order().limit()) that resolves to { data, error }. The
 * hoisted `resultRef` lets each test set what that final promise resolves to.
 */
const { fromMock, resultRef } = vi.hoisted(() => {
  const resultRef = { current: { data: [] as unknown, error: null as unknown } };
  const builder = {
    select: () => builder,
    order: () => builder,
    limit: () => Promise.resolve(resultRef.current),
  };
  const fromMock = vi.fn(() => builder);
  return { fromMock, resultRef };
});

vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: true,
  supabase: { from: fromMock },
}));

import { ReviewsWall } from "@/components/reviews-wall";

describe("<ReviewsWall />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resultRef.current = { data: [], error: null };
  });

  it("shows the honest empty state when there are no reviews", async () => {
    resultRef.current = { data: [], error: null };
    render(<ReviewsWall />);
    expect(
      await screen.findByText(/where real reviews will live/i)
    ).toBeInTheDocument();
  });

  it("renders approved reviews when present", async () => {
    resultRef.current = {
      data: [
        {
          id: "1",
          created_at: "2026-01-01T00:00:00Z",
          name: "Grace Hopper",
          company: "Navy",
          rating: 5,
          feedback: "They shipped exactly what they promised.",
        },
      ],
      error: null,
    };
    render(<ReviewsWall />);
    expect(
      await screen.findByText(/exactly what they promised/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Grace Hopper")).toBeInTheDocument();
  });

  it("falls back to the empty state when the fetch errors", async () => {
    resultRef.current = { data: null, error: { message: "boom" } };
    render(<ReviewsWall />);
    expect(
      await screen.findByText(/where real reviews will live/i)
    ).toBeInTheDocument();
  });
});
