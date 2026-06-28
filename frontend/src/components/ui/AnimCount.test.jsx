import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import AnimCount from "./AnimCount";

describe("AnimCount", () => {
  let rafSpy;

  beforeEach(() => {
    vi.useFakeTimers();

    rafSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb) => {
        return setTimeout(() => cb(performance.now()), 16);
      });
  });

  afterEach(() => {
    rafSpy.mockRestore();
    vi.useRealTimers();
  });

  it("starts at 0", () => {
    render(<AnimCount target={50} />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("animates to the target value", () => {
    render(<AnimCount target={50} duration={100} />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("updates when the target changes", () => {
    const { rerender } = render(
      <AnimCount target={20} duration={100} />
    );

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByText("20")).toBeInTheDocument();

    rerender(
      <AnimCount target={80} duration={100} />
    );

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByText("80")).toBeInTheDocument();
  });
});