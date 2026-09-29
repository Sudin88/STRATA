import { describe, it, expect } from "vitest";
import { validateFeedback, EMPTY_FEEDBACK } from "@/lib/feedback";

describe("validateFeedback", () => {
  it("flags name, rating and feedback on an empty submission", () => {
    const errors = validateFeedback(EMPTY_FEEDBACK);
    expect(errors.name).toBeDefined();
    expect(errors.rating).toBeDefined();
    expect(errors.feedback).toBeDefined();
  });

  it("passes a fully valid submission", () => {
    const errors = validateFeedback({
      ...EMPTY_FEEDBACK,
      name: "Ada Lovelace",
      rating: 5,
      feedback: "They were a genuine pleasure to work with.",
    });
    expect(errors).toEqual({});
  });

  it("requires a name that isn't just whitespace", () => {
    expect(validateFeedback({ ...EMPTY_FEEDBACK, name: "   " }).name).toBeDefined();
  });

  it("treats email as optional but validates its format when given", () => {
    const base = {
      ...EMPTY_FEEDBACK,
      name: "A. Person",
      rating: 4,
      feedback: "A perfectly sufficient sentence of feedback.",
    };
    expect(validateFeedback({ ...base, email: "" }).email).toBeUndefined();
    expect(validateFeedback({ ...base, email: "nope" }).email).toBeDefined();
    expect(validateFeedback({ ...base, email: "a@b.com" }).email).toBeUndefined();
  });

  it("requires a rating between 1 and 5", () => {
    for (const rating of [0, -1, 6, 2.5]) {
      expect(validateFeedback({ ...EMPTY_FEEDBACK, rating }).rating).toBeDefined();
    }
    for (const rating of [1, 3, 5]) {
      expect(
        validateFeedback({
          ...EMPTY_FEEDBACK,
          name: "A. Person",
          rating,
          feedback: "A perfectly sufficient sentence of feedback.",
        }).rating
      ).toBeUndefined();
    }
  });

  it("requires feedback of at least a short sentence", () => {
    expect(
      validateFeedback({ ...EMPTY_FEEDBACK, feedback: "too short" }).feedback
    ).toBeDefined();
    expect(
      validateFeedback({ ...EMPTY_FEEDBACK, feedback: "          " }).feedback
    ).toBeDefined();
    expect(
      validateFeedback({
        ...EMPTY_FEEDBACK,
        feedback: "This is long enough to pass.",
      }).feedback
    ).toBeUndefined();
  });
});
