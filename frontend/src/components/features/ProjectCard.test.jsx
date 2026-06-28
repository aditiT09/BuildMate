import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProjectCard from "./ProjectCard";

const mockProject = {
  id: 1,
  title: "BuildMate",
  description: "A platform for students to collaborate on projects.",
  project_type: "Web Development",
  timeline: "3 Months",
};

describe("ProjectCard", () => {
  it("renders project information", () => {
    render(
      <MemoryRouter>
        <ProjectCard project={mockProject} />
      </MemoryRouter>
    );

    expect(
      screen.getByText("BuildMate")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "A platform for students to collaborate on projects."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Web Development")
    ).toBeInTheDocument();

    expect(
      screen.getByText("3 Months")
    ).toBeInTheDocument();
  });

  it("renders timeline label", () => {
    render(
      <MemoryRouter>
        <ProjectCard project={mockProject} />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Timeline")
    ).toBeInTheDocument();
  });

  it("renders View Project button", () => {
    render(
      <MemoryRouter>
        <ProjectCard project={mockProject} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("link", {
        name: /view project/i,
      })
    ).toBeInTheDocument();
  });

  it("links to the correct project page", () => {
    render(
      <MemoryRouter>
        <ProjectCard project={mockProject} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("link", {
        name: /view project/i,
      })
    ).toHaveAttribute("href", "/projects/1");
  });

  it("renders as an article", () => {
    const { container } = render(
      <MemoryRouter>
        <ProjectCard project={mockProject} />
      </MemoryRouter>
    );

    expect(
      container.querySelector("article")
    ).toBeInTheDocument();
  });
});