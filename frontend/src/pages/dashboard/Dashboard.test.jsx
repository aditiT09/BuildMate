import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Dashboard from "./Dashboard";

import { getMyProjects } from "../../api/projects";
import { getMyApplications, getOpportunityApplications } from "../../api/applications";
import { getProjectOpportunities } from "../../api/opportunities";
import { getOverview } from "../../api/analytics";
import { getMyProfile } from "../../api/profile";
import { getCurrentUser } from "../../api/users";
import { useAuth } from "../../hooks/useAuth";

vi.mock("../../api/projects");
vi.mock("../../api/applications");
vi.mock("../../api/opportunities");
vi.mock("../../api/analytics");
vi.mock("../../api/profile");
vi.mock("../../api/users");
vi.mock("../../hooks/useAuth");

vi.mock("../../components/ui/AnimCount", () => ({
  default: ({ target }) => target,
}));

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
    description: "Collaboration platform",
    project_type: "Web App",
    timeline: "3 Months",
  },
  {
    id: 2,
    title: "EcoTrack",
    description: "Carbon footprint tracer",
    project_type: "Mobile App",
    timeline: "2 Weeks",
  },
];

const mockApplications = [
  {
    id: 10,
    status: "pending",
    opportunity_id: 101,
    opportunity: {
      role: "Frontend Engineer",
      project: {
        id: 1,
        title: "BuildMate",
      },
    },
  },
  {
    id: 11,
    status: "accepted",
    opportunity_id: 102,
    opportunity: {
      role: "Backend Engineer",
      project: {
        id: 2,
        title: "EcoTrack",
      },
    },
  },
];

const mockOpportunities = {
  1: [
    { id: 101, role: "Frontend Engineer", project_id: 1, seats: 2, status: "open" }
  ],
  2: [
    { id: 102, role: "Backend Engineer", project_id: 2, seats: 1, status: "open" }
  ],
};

const mockIncomingApplications = {
  101: [
    {
      id: 201,
      status: "pending",
      user: { id: 3, name: "Bob Builder" },
      opportunity_id: 101,
    }
  ],
  102: [],
};

function renderPage() {
  return render(
    <MemoryRouter>
      <Dashboard />
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

  getMyProjects.mockResolvedValue(mockProjects);
  getMyApplications.mockResolvedValue(mockApplications);
  getOverview.mockResolvedValue({
    total_projects: 10,
    top_skills: [
      { name: "React", count: 5 },
      { name: "Node.js", count: 3 },
    ],
  });
  getMyProfile.mockResolvedValue({ full_name: "Alice Builder" });
  getCurrentUser.mockResolvedValue({ activity_score: 85, reliability_score: 92 });

  getProjectOpportunities.mockImplementation(async (projectId) => {
    return mockOpportunities[projectId] || [];
  });
  getOpportunityApplications.mockImplementation(async (oppId) => {
    return mockIncomingApplications[oppId] || [];
  });

  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Dashboard", () => {
  it("renders loading skeletons initially", async () => {
    let resolveProjects;
    getMyProjects.mockImplementationOnce(() => new Promise((resolve) => {
      resolveProjects = resolve;
    }));

    renderPage();

    expect(screen.queryByRole("heading", { name: "BuildMate" })).not.toBeInTheDocument();

    resolveProjects(mockProjects);
    
    expect(await screen.findByRole("heading", { name: "BuildMate" })).toBeInTheDocument();
  });

  it("renders correct time-based greetings", () => {
    // Morning (9 AM)
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 28, 9, 0, 0));
    renderPage();
    expect(screen.getByText(/good morning/i)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("renders correct afternoon greeting", () => {
    // Afternoon (2 PM)
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 28, 14, 0, 0));
    renderPage();
    expect(screen.getByText(/good afternoon/i)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("renders correct evening greeting", () => {
    // Evening (7 PM)
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 28, 19, 0, 0));
    renderPage();
    expect(screen.getByText(/good evening/i)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("displays user stats and profile details", async () => {
    renderPage();

    expect(await screen.findByText("Alice.")).toBeInTheDocument();
    
    // Activity and reliability scores
    expect(screen.getByText("Activity")).toBeInTheDocument();
    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.getByText("Reliability")).toBeInTheDocument();
    expect(screen.getByText("92")).toBeInTheDocument();

    // Stat cards count
    const projectsCard = screen.getAllByRole("link", { name: /my projects/i })[0];
    expect(within(projectsCard).getByText("2")).toBeInTheDocument();

    const appsCard = screen.getAllByRole("link", { name: /applications/i })[0];
    expect(within(appsCard).getByText("2")).toBeInTheDocument();

    const liveCard = screen.getAllByRole("link", { name: /live projects/i })[0];
    expect(within(liveCard).getByText("10")).toBeInTheDocument();
  });

  it("renders trending skills list", async () => {
    renderPage();

    expect(await screen.findByText("React")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
    expect(screen.getByText("5 builders")).toBeInTheDocument();
    expect(screen.getByText("3 builders")).toBeInTheDocument();
  });

  it("renders application breakdown chart", async () => {
    renderPage();

    expect(await screen.findByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Accepted")).toBeInTheDocument();
    expect(screen.getByText("Rejected")).toBeInTheDocument();
  });

  it("renders user projects shelf list", async () => {
    renderPage();

    expect(await screen.findByRole("heading", { name: "BuildMate" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "EcoTrack" })).toBeInTheDocument();

    expect(screen.getByText("Collaboration platform")).toBeInTheDocument();
    expect(screen.getByText("Carbon footprint tracer")).toBeInTheDocument();
  });

  it("renders recent user applications list", async () => {
    renderPage();

    const recentAppsCard = await screen.findByText("Recent Applications");
    const container = recentAppsCard.closest(".dash-card");
    
    expect(within(container).getByText("Frontend Engineer")).toBeInTheDocument();
    expect(within(container).getByText("Backend Engineer")).toBeInTheDocument();
  });

  it("renders incoming applications for candidate review", async () => {
    renderPage();

    expect(await screen.findByText(/Bob Builder applied for/)).toBeInTheDocument();

    const incomingSection = screen.getByText("incoming!").closest(".dash-card");
    expect(within(incomingSection).getByText("Frontend Engineer")).toBeInTheDocument();
    expect(within(incomingSection).getByText("Project: BuildMate")).toBeInTheDocument();

    const reviewLink = within(incomingSection).getByRole("link", { name: /review →/i });
    expect(reviewLink).toHaveAttribute("href", "/opportunities/101/applicants");
  });

  it("renders empty states when there is no data", async () => {
    getMyProjects.mockResolvedValueOnce([]);
    getMyApplications.mockResolvedValueOnce([]);
    getOverview.mockResolvedValueOnce({ total_projects: 0, top_skills: [] });

    renderPage();

    expect(await screen.findByText("no projects? bestie, let's fix that")).toBeInTheDocument();
    expect(screen.getByText("zero applications? the audacity")).toBeInTheDocument();
    expect(screen.getByText("no new knocks on the door")).toBeInTheDocument();
    expect(screen.getByText("No badges yet.")).toBeInTheDocument();
  });

  it("navigates to dashboard subpages when links/buttons are clicked", async () => {
    renderPage();

    // Profile link
    const profileLink = await screen.findByText("AB");
    expect(profileLink.closest("a")).toHaveAttribute("href", "/profile");

    // Stat cards links
    const projectsLinks = screen.getAllByRole("link", { name: /my projects/i });
    projectsLinks.forEach(link => {
      expect(link).toHaveAttribute("href", "/my-projects");
    });

    const appsLinks = screen.getAllByRole("link", { name: /applications/i });
    appsLinks.forEach(link => {
      expect(link).toHaveAttribute("href", "/applications");
    });

    const liveLinks = screen.getAllByRole("link", { name: /live projects/i });
    liveLinks.forEach(link => {
      expect(link).toHaveAttribute("href", "/discover");
    });

    // New project button
    const newProjectBtn = screen.getByRole("button", { name: /\+ new project/i });
    expect(newProjectBtn.closest("a")).toHaveAttribute("href", "/create-project");
  });
});
