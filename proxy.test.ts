import { describe, it, expect, afterEach } from "vitest";
import { NextRequest } from "next/server";
import type { NextRequest as NextRequestType } from "next/server";
import {
  clientIp,
  dashboardIpAllowed,
  accessDecision,
  dashboardAccessGate,
} from "./proxy";

/*
 * The IP gate is pure header/env logic, so we exercise it with a minimal stub
 * (just the `headers` NextRequest depends on) rather than a full NextRequest.
 */
function req(headers: Record<string, string> = {}): NextRequestType {
  return { headers: new Headers(headers) } as unknown as NextRequestType;
}

const ORIGINAL_ALLOWLIST = process.env.DASHBOARD_IP_ALLOWLIST;
const ORIGINAL_KEY = process.env.DASHBOARD_ACCESS_KEY;
afterEach(() => {
  if (ORIGINAL_ALLOWLIST === undefined) delete process.env.DASHBOARD_IP_ALLOWLIST;
  else process.env.DASHBOARD_IP_ALLOWLIST = ORIGINAL_ALLOWLIST;
  if (ORIGINAL_KEY === undefined) delete process.env.DASHBOARD_ACCESS_KEY;
  else process.env.DASHBOARD_ACCESS_KEY = ORIGINAL_KEY;
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

describe("accessDecision", () => {
  it("is disabled when no key is configured", () => {
    expect(accessDecision(undefined, "anything", "anything")).toBe("disabled");
    expect(accessDecision("   ", "x", "x")).toBe("disabled");
  });

  it("unlocks when the provided ?key matches", () => {
    expect(accessDecision("s3cret", "s3cret", undefined)).toBe("unlock");
  });

  it("allows when the cookie matches", () => {
    expect(accessDecision("s3cret", null, "s3cret")).toBe("allow");
  });

  it("hides when neither key nor cookie matches", () => {
    expect(accessDecision("s3cret", "wrong", "wrong")).toBe("hide");
    expect(accessDecision("s3cret", null, undefined)).toBe("hide");
  });

  it("prefers a correct ?key even if the cookie is stale", () => {
    expect(accessDecision("new", "new", "old")).toBe("unlock");
  });
});

describe("dashboardAccessGate", () => {
  const url = "https://strata.example/dashboard/leads";

  it("returns null (continue) when no key is configured", () => {
    delete process.env.DASHBOARD_ACCESS_KEY;
    expect(dashboardAccessGate(new NextRequest(url))).toBeNull();
  });

  it("404s a request with no key or cookie", () => {
    process.env.DASHBOARD_ACCESS_KEY = "s3cret";
    const res = dashboardAccessGate(new NextRequest(url));
    expect(res?.status).toBe(404);
  });

  it("404s a request with a wrong ?key", () => {
    process.env.DASHBOARD_ACCESS_KEY = "s3cret";
    const res = dashboardAccessGate(new NextRequest(`${url}?key=nope`));
    expect(res?.status).toBe(404);
  });

  it("redirects and sets the cookie on a correct ?key, stripping it from the URL", () => {
    process.env.DASHBOARD_ACCESS_KEY = "s3cret";
    const res = dashboardAccessGate(new NextRequest(`${url}?key=s3cret`));
    expect(res).not.toBeNull();
    expect([307, 308]).toContain(res!.status);
    expect(res!.headers.get("location")).toBe(url); // no ?key in the clean URL
    const setCookie = res!.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain("dash_key=s3cret");
    expect(setCookie.toLowerCase()).toContain("httponly");
  });

  it("returns null (continue) when the cookie already matches", () => {
    process.env.DASHBOARD_ACCESS_KEY = "s3cret";
    const withCookie = new NextRequest(url, {
      headers: { cookie: "dash_key=s3cret" },
    });
    expect(dashboardAccessGate(withCookie)).toBeNull();
  });
});
