import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EmptyState from "./EmptyState";

describe("EmptyState", () => {
  it("renders headline and subtitle", () => {
    render(
      <MemoryRouter>
        <EmptyState
          headline="No Projects"
          sub="Create your first project."
        />
      </MemoryRouter>
    );

    expect(
      screen.getByText("No Projects")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Create your first project.")
    ).toBeInTheDocument();
  });

  it("renders custom icon", () => {
    render(
      <MemoryRouter>
        <EmptyState
          icon={<span data-testid="empty-icon">🚀</span>}
          headline="No Projects"
          sub="Nothing here."
        />
      </MemoryRouter>
    );

    expect(
      screen.getByTestId("empty-icon")
    ).toBeInTheDocument();
  });

  it("renders CTA button when cta and href are provided", () => {
    render(
      <MemoryRouter>
        <EmptyState
          headline="No Projects"
          sub="Create one now."
          cta="Create Project"
          href="/projects/create"
        />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", {
      name: /create project/i,
    });

    expect(button).toBeInTheDocument();
  });

  it("renders CTA link with correct destination", () => {
    render(
      <MemoryRouter>
        <EmptyState
          headline="No Projects"
          sub="Create one now."
          cta="Create Project"
          href="/projects/create"
        />
      </MemoryRouter>
    );

    const link = screen.getByRole("link");

    expect(link).toHaveAttribute(
      "href",
      "/projects/create"
    );
  });

  it("does not render CTA when cta is missing", () => {
    render(
      <MemoryRouter>
        <EmptyState
          headline="No Projects"
          sub="Nothing here."
          href="/projects/create"
        />
      </MemoryRouter>
    );

    expect(
      screen.queryByRole("button")
    ).not.toBeInTheDocument();
  });

  it("does not render CTA when href is missing", () => {
    render(
      <MemoryRouter>
        <EmptyState
          headline="No Projects"
          sub="Nothing here."
          cta="Create Project"
        />
      </MemoryRouter>
    );

    expect(
      screen.queryByRole("button")
    ).not.toBeInTheDocument();
  });
});