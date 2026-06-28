import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import MyProjects from "./MyProjects";
import { getMyProjects } from "../../api/projects";
import { useAuth } from "../../hooks/useAuth";

vi.mock("../../api/projects");
vi.mock("../../hooks/useAuth");

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockProjectsData = [
  {
    id: 1,
    title: "BuildMate",
    description: "Student collaboration platform",
    project_type: "Web App",
    timeline: "3 Months",
  },
  {
    id: 2,
    title: "Campus Ride",
    description: "Student carpooling app",
    project_type: "Mobile App",
    timeline: "2 Weeks",
  },
];

function renderPage() {
  return render(
    <MemoryRouter>
      <MyProjects />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.resetAllMocks();

  useAuth.mockReturnValue({
    user: {
      id: 2,
      name: "Alice",
      email: "alice@example.com",
    },
    logout: vi.fn(),
  });

  getMyProjects.mockResolvedValue(mockProjectsData);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("MyProjects", () => {
  it("renders loading state initially", async () => {
    renderPage();

    expect(screen.getByText(/digging up your projects/i)).toBeInTheDocument();
    
    // Wait for loading to finish
    await screen.findByRole("heading", { name: "BuildMate" });
  });

  it("renders error state when API fails", async () => {
    getMyProjects.mockRejectedValueOnce({
      response: {
        data: {
          detail: "Database offline",
        },
      },
    });

    renderPage();

    expect(await screen.findByText("Database offline")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("retries fetching projects when clicking retry button in error state", async () => {
    const user = userEvent.setup();
    
    getMyProjects
      .mockRejectedValueOnce(new Error("API Error"))
      .mockResolvedValueOnce(mockProjectsData);

    renderPage();

    const retryBtn = await screen.findByRole("button", { name: /try again/i });
    await user.click(retryBtn);

    expect(getMyProjects).toHaveBeenCalledTimes(2);
    expect(await screen.findByRole("heading", { name: "BuildMate" })).toBeInTheDocument();
  });

  it("renders empty state when user has no projects", async () => {
    getMyProjects.mockResolvedValueOnce([]);

    renderPage();

    expect(await screen.findByText("shelf's empty")).toBeInTheDocument();
    expect(screen.getByText(/you haven't posted anything yet/i)).toBeInTheDocument();
    
    const startProjectBtn = screen.getByRole("link", { name: /\+ post your first project/i });
    expect(startProjectBtn).toBeInTheDocument();
  });

  it("renders projects shelf list when projects exist", async () => {
    renderPage();

    expect(await screen.findByRole("heading", { name: "BuildMate" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Campus Ride" })).toBeInTheDocument();

    expect(screen.getByText("Student collaboration platform")).toBeInTheDocument();
    expect(screen.getByText("Student carpooling app")).toBeInTheDocument();

    expect(screen.getByText("Web App")).toBeInTheDocument();
    expect(screen.getByText("Mobile App")).toBeInTheDocument();

    expect(screen.getByText("3 Months")).toBeInTheDocument();
    expect(screen.getByText("2 Weeks")).toBeInTheDocument();
  });

  it("navigates to create project page when clicking new project button", async () => {
    const user = userEvent.setup();
    renderPage();

    // Wait for projects shelf to render
    await screen.findByRole("heading", { name: "BuildMate" });

    const newProjectBtn = screen.getByRole("button", { name: /\+ new project/i });
    await user.click(newProjectBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/create-project");
  });

  it("navigates to create project page when clicking post first project CTA in empty state", async () => {
    getMyProjects.mockResolvedValueOnce([]);
    renderPage();

    const postFirstBtn = await screen.findByRole("link", { name: /\+ post your first project/i });
    expect(postFirstBtn).toHaveAttribute("href", "/create-project");
  });

  it("navigates to project detail page when clicking a project card", async () => {
    const user = userEvent.setup();
    renderPage();

    const projectCard = await screen.findByRole("heading", { name: "BuildMate" });
    await user.click(projectCard);

    expect(mockNavigate).toHaveBeenCalledWith("/projects/1");
  });
});
