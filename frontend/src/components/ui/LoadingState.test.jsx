import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LoadingState from "./LoadingState";

describe("LoadingState", () => {
  it("renders default loading message", () => {
    render(<LoadingState />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders custom loading message", () => {
    render(<LoadingState message="Fetching projects..." />);

    expect(
      screen.getByText("Fetching projects...")
    ).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    const { container } = render(<LoadingState />);

    const wrapper = container.firstChild;

    expect(wrapper).toHaveAttribute("aria-busy", "true");
    expect(wrapper).toHaveAttribute("aria-live", "polite");
  });

  it("renders spinner", () => {
    const { container } = render(<LoadingState />);

    const spinner = container.querySelector("div > div");

    expect(spinner).toBeInTheDocument();
  });
});