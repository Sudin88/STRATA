import { describe, it, expect, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSpamGuard } from "@/components/ui/spam-guard";

/*
 * The guard leans on Date.now() for its timing signal, so these run on fake
 * timers to control "how long the form has been open" deterministically.
 */
describe("useSpamGuard", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("flags a submit that lands within the min fill time as a bot", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useSpamGuard());
    // The mount effect just recorded the start time; ~0ms have elapsed.
    expect(result.current.isLikelyBot()).toBe(true);
  });

  it("clears a real user once enough time has passed", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useSpamGuard());
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.isLikelyBot()).toBe(false);
  });

  it("flags a filled honeypot as a bot regardless of timing", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useSpamGuard());
    act(() => {
      vi.advanceTimersByTime(5000);
      result.current.setTrap("http://spam.example");
    });
    expect(result.current.isLikelyBot()).toBe(true);
  });
});
