import { describe, it, expect, afterEach } from "vitest";
import type { NextRequest } from "next/server";
import { clientIp, dashboardIpAllowed } from "./proxy";

/*
 * The IP gate is pure header/env logic, so we exercise it with a minimal stub
 * (just the `headers` NextRequest depends on) rather than a full NextRequest.
 */
function req(headers: Record<string, string> = {}): NextRequest {
  return { headers: new Headers(headers) } as unknown as NextRequest;
}

const ORIGINAL = process.env.DASHBOARD_IP_ALLOWLIST;
afterEach(() => {
  if (ORIGINAL === undefined) delete process.env.DASHBOARD_IP_ALLOWLIST;
  else process.env.DASHBOARD_IP_ALLOWLIST = ORIGINAL;
});

describe("clientIp", () => {
  it("uses the leftmost x-forwarded-for hop", () => {
    expect(clientIp(req({ "x-forwarded-for": "1.2.3.4, 10.0.0.1" }))).toBe(
      "1.2.3.4",
    );
  });

  it("falls back to x-real-ip when no forwarded header", () => {
    expect(clientIp(req({ "x-real-ip": "5.6.7.8" }))).toBe("5.6.7.8");
  });

  it("returns null when no IP header is present", () => {
    expect(clientIp(req())).toBeNull();
  });
});

describe("dashboardIpAllowed", () => {
  it("fails open when the allowlist env var is unset", () => {
    delete process.env.DASHBOARD_IP_ALLOWLIST;
    expect(dashboardIpAllowed(req({ "x-forwarded-for": "9.9.9.9" }))).toBe(true);
  });

  it("fails open when the allowlist is blank", () => {
    process.env.DASHBOARD_IP_ALLOWLIST = "  ,  ";
    expect(dashboardIpAllowed(req({ "x-forwarded-for": "9.9.9.9" }))).toBe(true);
  });

  it("allows a listed IP", () => {
    process.env.DASHBOARD_IP_ALLOWLIST = "1.2.3.4";
    expect(dashboardIpAllowed(req({ "x-forwarded-for": "1.2.3.4" }))).toBe(true);
  });

  it("allows when the IP is one of several listed", () => {
    process.env.DASHBOARD_IP_ALLOWLIST = "1.1.1.1, 1.2.3.4 , 8.8.8.8";
    expect(dashboardIpAllowed(req({ "x-forwarded-for": "1.2.3.4" }))).toBe(true);
  });

  it("denies an unlisted IP", () => {
    process.env.DASHBOARD_IP_ALLOWLIST = "1.2.3.4";
    expect(dashboardIpAllowed(req({ "x-forwarded-for": "9.9.9.9" }))).toBe(false);
  });

  it("denies when the allowlist is set but the IP is unknown", () => {
    process.env.DASHBOARD_IP_ALLOWLIST = "1.2.3.4";
    expect(dashboardIpAllowed(req())).toBe(false);
  });

  it("matches an IPv4 CIDR range", () => {
    process.env.DASHBOARD_IP_ALLOWLIST = "1.2.3.0/24";
    expect(dashboardIpAllowed(req({ "x-forwarded-for": "1.2.3.200" }))).toBe(
      true,
    );
    expect(dashboardIpAllowed(req({ "x-forwarded-for": "1.2.4.1" }))).toBe(
      false,
    );
  });

  it("matches an exact IPv6 address", () => {
    process.env.DASHBOARD_IP_ALLOWLIST =
      "2400:1a00:4ba4:89d:7828:4a53:6f54:2836";
    expect(
      dashboardIpAllowed(
        req({ "x-forwarded-for": "2400:1a00:4ba4:89d:7828:4a53:6f54:2836" }),
      ),
    ).toBe(true);
  });

  it("matches an IPv6 /64 prefix as the host half rotates", () => {
    process.env.DASHBOARD_IP_ALLOWLIST = "2400:1a00:4ba4:89d::/64";
    // same /64, different (rotated) host suffix → still allowed
    expect(
      dashboardIpAllowed(
        req({ "x-forwarded-for": "2400:1a00:4ba4:89d:aaaa:bbbb:cccc:dddd" }),
      ),
    ).toBe(true);
    // different /64 → denied
    expect(
      dashboardIpAllowed(
        req({ "x-forwarded-for": "2400:1a00:4ba4:222:7828:4a53:6f54:2836" }),
      ),
    ).toBe(false);
  });

  it("does not cross address families (v4 entry never matches a v6 client)", () => {
    process.env.DASHBOARD_IP_ALLOWLIST = "1.2.3.4";
    expect(
      dashboardIpAllowed(req({ "x-forwarded-for": "2400:1a00:4ba4:89d::1" })),
    ).toBe(false);
  });

  it("supports a mixed v4 + v6/64 allowlist", () => {
    process.env.DASHBOARD_IP_ALLOWLIST =
      "27.34.111.144, 2400:1a00:4ba4:89d::/64";
    expect(dashboardIpAllowed(req({ "x-forwarded-for": "27.34.111.144" }))).toBe(
      true,
    );
    expect(
      dashboardIpAllowed(
        req({ "x-forwarded-for": "2400:1a00:4ba4:89d:1:2:3:4" }),
      ),
    ).toBe(true);
    expect(dashboardIpAllowed(req({ "x-forwarded-for": "8.8.8.8" }))).toBe(
      false,
    );
  });

  it("denies a malformed client IP", () => {
    process.env.DASHBOARD_IP_ALLOWLIST = "1.2.3.0/24";
    expect(dashboardIpAllowed(req({ "x-forwarded-for": "not-an-ip" }))).toBe(
      false,
    );
  });
});
