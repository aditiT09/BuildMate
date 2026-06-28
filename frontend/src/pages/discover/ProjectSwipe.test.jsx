import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import ProjectSwipe from "./ProjectSwipe";

import { getProjects } from "../../api/projects";
import { getProjectOpportunities } from "../../api/opportunities";
import { createApplication, getMyApplications } from "../../api/applications";
import { useAuth } from "../../hooks/useAuth";

vi.mock("../../api/projects");
vi.mock("../../api/opportunities");
vi.mock("../../api/applications");
vi.mock("../../hooks/useAuth");

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockProjects = [
  {
    id: 1,
    title: "BuildMate",
    description: "Student collaboration platform for developers",
    project_type: "Web App",
    timeline: "3 Months",
  },
  {
    id: 2,
    title: "EcoTrack",
    description: "Mobile app to trace carbon footprints daily",
    project_type: "Mobile App",
    timeline: "2 Months",
  },
  {
    id: 3,
    title: "SmartFinance",
    description: "AI-driven wealth management advice",
    project_type: "AI / ML",
    timeline: "6 Months",
  },
];

const mockOpportunities = [
  {
    id: 101,
    role: "Frontend Engineer",
    seats: 2,
    status: "open",
  },
  {
    id: 102,
    role: "Backend Architect",
    seats: 1,
    status: "closed",
  },
];

const mockMyApplications = [
  { opportunity_id: 999 },
];

function renderPage() {
  return render(
    <MemoryRouter>
      <ProjectSwipe />
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

  getProjects.mockResolvedValue(mockProjects);
  getMyApplications.mockResolvedValue(mockMyApplications);
  getProjectOpportunities.mockResolvedValue(mockOpportunities);
  createApplication.mockResolvedValue({});

  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ProjectSwipe", () => {
  it("renders loading skeletons initially", async () => {
    let resolveProjects;
    getProjects.mockImplementationOnce(() => new Promise((resolve) => {
      resolveProjects = resolve;
    }));

    renderPage();

    expect(screen.queryByRole("heading", { name: "BuildMate" })).not.toBeInTheDocument();

    resolveProjects(mockProjects);
    
    expect(await screen.findByRole("heading", { name: "BuildMate" })).toBeInTheDocument();
  });

  it("renders discover header and project cards", async () => {
    renderPage();

    expect(await screen.findByRole("heading", { name: "Find your next build." })).toBeInTheDocument();
    
    expect(screen.getByRole("heading", { name: "BuildMate" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "EcoTrack" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "SmartFinance" })).toBeInTheDocument();

    expect(screen.getByText("Student collaboration platform for developers")).toBeInTheDocument();
    expect(screen.getByText("Mobile app to trace carbon footprints daily")).toBeInTheDocument();
    expect(screen.getByText("AI-driven wealth management advice")).toBeInTheDocument();
  });

  it("filters project cards based on text search input", async () => {
    renderPage();

    expect(await screen.findByRole("heading", { name: "BuildMate" })).toBeInTheDocument();
    
    const searchInput = screen.getByPlaceholderText(/search projects/i);
    
    fireEvent.change(searchInput, { target: { value: "carbon" } });
    
    expect(screen.getByRole("heading", { name: "EcoTrack" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "BuildMate" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "SmartFinance" })).not.toBeInTheDocument();

    const searchContainer = searchInput.closest("div");
    const clearBtn = within(searchContainer).getByRole("button");
    await userEvent.click(clearBtn);

    expect(screen.getByRole("heading", { name: "BuildMate" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "EcoTrack" })).toBeInTheDocument();
  });

  it("filters project cards based on category filter pills", async () => {
    renderPage();

    expect(await screen.findByRole("heading", { name: "BuildMate" })).toBeInTheDocument();

    const mobilePill = screen.getByRole("button", { name: /mobile app/i });
    await userEvent.click(mobilePill);

    expect(screen.getByRole("heading", { name: "EcoTrack" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "BuildMate" })).not.toBeInTheDocument();

    const allPill = screen.getByRole("button", { name: /all/i });
    await userEvent.click(allPill);

    expect(screen.getByRole("heading", { name: "BuildMate" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "EcoTrack" })).toBeInTheDocument();
  });

  it("renders empty state when no projects match search filters", async () => {
    renderPage();

    expect(await screen.findByRole("heading", { name: "BuildMate" })).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/search projects/i);
    fireEvent.change(searchInput, { target: { value: "noprojectmatches" } });

    expect(await screen.findByText("no results, bestie")).toBeInTheDocument();

    const clearBtn = screen.getByRole("button", { name: /clear filters/i });
    await userEvent.click(clearBtn);

    expect(screen.getByRole("heading", { name: "BuildMate" })).toBeInTheDocument();
    expect(searchInput.value).toBe("");
  });

  it("toggles the liked heart state on a card", async () => {
    const user = userEvent.setup();
    renderPage();

    const card = await screen.findByRole("heading", { name: "BuildMate" });
    const cardContainer = card.closest(".pin");

    const likeBtn = within(cardContainer).getByRole("button", { name: "" });
    
    const heartSvg = likeBtn.querySelector("svg");
    expect(heartSvg).toHaveAttribute("fill", "none");

    await user.click(likeBtn);
    expect(heartSvg).toHaveAttribute("fill", "#E35336");

    await user.click(likeBtn);
    expect(heartSvg).toHaveAttribute("fill", "none");
  });

  it("toggles roles drawer, fetches opportunities, and submits application", async () => {
    const user = userEvent.setup();
    renderPage();

    const card = await screen.findByRole("heading", { name: "BuildMate" });
    const cardContainer = card.closest(".pin");

    const rolesBtn = within(cardContainer).getByRole("button", { name: /roles/i });
    await user.click(rolesBtn);

    expect(getProjectOpportunities).toHaveBeenCalledWith(1);

    expect(await screen.findByText("Frontend Engineer")).toBeInTheDocument();
    expect(screen.getByText("Backend Architect")).toBeInTheDocument();
    
    const frontendRow = screen.getByText("Frontend Engineer").parentElement.parentElement;
    const applyBtn = within(frontendRow).getByRole("button", { name: /apply/i });
    expect(applyBtn).toBeEnabled();

    const backendRow = screen.getByText("Backend Architect").parentElement.parentElement;
    const disabledApplyBtn = within(backendRow).getByRole("button", { name: /apply/i });
    expect(disabledApplyBtn).toBeDisabled();

    await user.click(applyBtn);

    expect(createApplication).toHaveBeenCalledWith(101);
    
    expect(await screen.findByRole("button", { name: /applied/i })).toBeDisabled();
    expect(await screen.findByText("Applied! You're in the game")).toBeInTheDocument();
  });

  it("handles application errors by displaying error toast", async () => {
    createApplication.mockRejectedValueOnce({
      response: {
        data: {
          detail: "You already applied to this role",
        },
      },
    });

    const user = userEvent.setup();
    renderPage();

    const card = await screen.findByRole("heading", { name: "BuildMate" });
    const cardContainer = card.closest(".pin");

    const rolesBtn = within(cardContainer).getByRole("button", { name: /roles/i });
    await user.click(rolesBtn);

    const frontendRow = await screen.findByText("Frontend Engineer");
    const applyBtn = within(frontendRow.parentElement.parentElement).getByRole("button", { name: /apply/i });
    await user.click(applyBtn);

    expect(await screen.findByText("You already applied to this role")).toBeInTheDocument();
  });

  it("navigates to project detail view when clicking View button on card", async () => {
    renderPage();

    const card = await screen.findByRole("heading", { name: "BuildMate" });
    const cardContainer = card.closest(".pin");

    const viewLink = within(cardContainer).getByRole("link", { name: /view/i });
    expect(viewLink).toHaveAttribute("href", "/projects/1");
  });

  it("navigates to create project view when clicking Post a Project button in header", async () => {
    renderPage();

    const postBtnLink = await screen.findByRole("link", { name: /\+ post a project/i });
    expect(postBtnLink).toHaveAttribute("href", "/create-project");
  });
});
