import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorState from "./ErrorState";

describe("ErrorState", () => {
  it("renders default error message", () => {
    render(<ErrorState />);

    expect(
      screen.getByText("Something went wrong")
    ).toBeInTheDocument();

    expect(
      screen.getByText("An error occurred")
    ).toBeInTheDocument();
  });

  it("renders custom error message", () => {
    render(
      <ErrorState message="Failed to load projects." />
    );

    expect(
      screen.getByText("Failed to load projects.")
    ).toBeInTheDocument();
  });

  it("has alert accessibility role", () => {
    render(<ErrorState />);

    expect(
      screen.getByRole("alert")
    ).toBeInTheDocument();
  });

  it("shows retry button when onRetry is provided", () => {
    const onRetry = vi.fn();

    render(<ErrorState onRetry={onRetry} />);

    expect(
      screen.getByRole("button", {
        name: /try again/i,
      })
    ).toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(<ErrorState onRetry={onRetry} />);

    await user.click(
      screen.getByRole("button", {
        name: /try again/i,
      })
    );

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("does not render retry button when onRetry is not provided", () => {
    render(<ErrorState />);

    expect(
      screen.queryByRole("button", {
        name: /try again/i,
      })
    ).not.toBeInTheDocument();
  });
});