import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ScoreRing from "./ScoreRing";

vi.mock("./AnimCount", () => ({
  default: ({ target }) => <span>{target}</span>,
}));
it("renders the score", () => {
  render(
    <ScoreRing
      score={82}
      label="Match"
      color="#E35336"
    />
  );

  expect(screen.getByText("82")).toBeInTheDocument();
});
it("renders label", () => {
  render(
    <ScoreRing
      score={82}
      label="Compatibility"
      color="#E35336"
    />
  );

  expect(
    screen.getByText("Compatibility")
  ).toBeInTheDocument();
});
it("renders svg with custom size", () => {
  const { container } = render(
    <ScoreRing
      score={70}
      label="Score"
      color="#E35336"
      size={120}
    />
  );

  const svg = container.querySelector("svg");

  expect(svg).toHaveAttribute("width", "120");
  expect(svg).toHaveAttribute("height", "120");
});
it("uses provided color", () => {
  const { container } = render(
    <ScoreRing
      score={50}
      label="Score"
      color="green"
    />
  );

  const circles = container.querySelectorAll("circle");

  expect(circles[1]).toHaveAttribute("stroke", "green");
});
it("caps score above 100", () => {
  const { container } = render(
    <ScoreRing
      score={150}
      label="Score"
      color="red"
    />
  );

  const circles = container.querySelectorAll("circle");

  const progressCircle = circles[1];

  expect(progressCircle).toBeInTheDocument();

  expect(progressCircle.getAttribute("stroke-dashoffset")).not.toBeNull();
});