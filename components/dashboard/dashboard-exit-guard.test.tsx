import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { DashboardExitGuard } from "@/components/dashboard/dashboard-exit-guard";

const nav = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({
  usePathname: () => nav.pathname,
}));

function clearFlag() {
  document.cookie = "dash_active=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

describe("<DashboardExitGuard />", () => {
  beforeEach(() => {
    nav.pathname = "/";
    clearFlag();
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(new Response(null, { status: 204 }))),
    );
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    clearFlag();
  });

  it("signs out when leaving the dashboard for a marketing page", () => {
    document.cookie = "dash_active=1";
    nav.pathname = "/";
    render(<DashboardExitGuard />);
    expect(fetch).toHaveBeenCalledWith(
      "/api/session/logout",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("does nothing while still inside the dashboard", () => {
    document.cookie = "dash_active=1";
    nav.pathname = "/dashboard/leads";
    render(<DashboardExitGuard />);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("does nothing for a visitor who was never in the dashboard", () => {
    nav.pathname = "/";
    render(<DashboardExitGuard />);
    expect(fetch).not.toHaveBeenCalled();
  });
});
