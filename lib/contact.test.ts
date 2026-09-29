import { describe, it, expect } from "vitest";
import { validate, EMPTY } from "@/lib/contact";

describe("validate", () => {
  it("flags every required field on an empty submission", () => {
    const errors = validate(EMPTY);
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.service).toBeDefined();
    expect(errors.details).toBeDefined();
  });

  it("passes a fully valid submission", () => {
    const errors = validate({
      ...EMPTY,
      name: "Ada Lovelace",
      email: "ada@example.com",
      service: "SEO",
      details: "We need help ranking our new product pages.",
    });
    expect(errors).toEqual({});
  });

  it("rejects malformed email addresses", () => {
    for (const email of ["nope", "a@b", "a@b.", "@b.com", "a b@c.com", ""]) {
      expect(validate({ ...EMPTY, email }).email).toBeDefined();
    }
  });

  it("requires a name that isn't just whitespace", () => {
    expect(validate({ ...EMPTY, name: "   " }).name).toBeDefined();
  });

  it("requires a details message of at least a sentence", () => {
    expect(validate({ ...EMPTY, details: "too short" }).details).toBeDefined();
    expect(
      validate({ ...EMPTY, details: "          " }).details
    ).toBeDefined();
    expect(
      validate({ ...EMPTY, details: "This is long enough to pass." }).details
    ).toBeUndefined();
  });

  it("does not require the optional company, website or budget fields", () => {
    const errors = validate({
      name: "A. Person",
      email: "person@example.com",
      service: "SEO",
      details: "A sufficiently descriptive project brief goes here.",
      company: "",
      website: "",
      budget: "",
    });
    expect(errors).toEqual({});
  });
});
