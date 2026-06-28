import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import IncomingDashboard from "./IncomingDashboard";

import { getMyProjects } from "../../api/projects";
import { getProjectOpportunities } from "../../api/opportunities";
import { getOpportunityApplications } from "../../api/applications";
import userEvent from "@testing-library/user-event";

// ----------------------------
// Mocks
// ----------------------------

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../api/projects", () => ({
  getMyProjects: vi.fn(),
}));

vi.mock("../../api/opportunities", () => ({
  getProjectOpportunities: vi.fn(),
}));

vi.mock("../../api/applications", () => ({
  getOpportunityApplications: vi.fn(),
}));

// Layout is already tested separately
vi.mock("../../components/layout/Layout", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

// Icons aren't relevant to page behavior
vi.mock("../../components/common/Icons", () => ({
  FolderIcon: () => <div>FolderIcon</div>,
  UsersIcon: () => <div>UsersIcon</div>,
}));

describe("IncomingDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading projects state", () => {
    getMyProjects.mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <MemoryRouter>
        <IncomingDashboard />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/loading projects/i)
    ).toBeInTheDocument();
  });

  it("shows empty projects state", async () => {
    getMyProjects.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <IncomingDashboard />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/no projects found/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /create a project/i,
      })
    ).toBeInTheDocument();
  });

  it("renders project list after loading", async () => {
    getMyProjects.mockResolvedValue([
      {
        id: 1,
        title: "BuildMate",
        description: "Student collaboration",
        project_type: "Web",
      },
    ]);

    getProjectOpportunities.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <IncomingDashboard />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("BuildMate")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Student collaboration")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Web")
    ).toBeInTheDocument();
  });

  it("automatically loads opportunities for first project", async () => {
    getMyProjects.mockResolvedValue([
      {
        id: 1,
        title: "BuildMate",
        description: "Test",
        project_type: "Web",
      },
    ]);

    getProjectOpportunities.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <IncomingDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        getProjectOpportunities
      ).toHaveBeenCalledWith(1);
    });
  });

  it("shows loading opportunities state", async () => {
    getMyProjects.mockResolvedValue([
      {
        id: 1,
        title: "BuildMate",
        description: "Student collaboration",
        project_type: "Web",
      },
    ]);

    getProjectOpportunities.mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <MemoryRouter>
        <IncomingDashboard />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/loading roles and application counts/i)
    ).toBeInTheDocument();
  });

  it("shows empty opportunities state", async () => {
    getMyProjects.mockResolvedValue([
      {
        id: 1,
        title: "BuildMate",
        description: "Student collaboration",
        project_type: "Web",
      },
    ]);

    getProjectOpportunities.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <IncomingDashboard />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/no roles opened yet/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /open a role/i,
      })
    ).toBeInTheDocument();
  });

  it("renders opportunities", async () => {
    getMyProjects.mockResolvedValue([
      {
        id: 1,
        title: "BuildMate",
        description: "Student collaboration",
        project_type: "Web",
      },
    ]);

    getProjectOpportunities.mockResolvedValue([
      {
        id: 101,
        role: "Frontend Developer",
        description: "React + Vite",
        status: "open",
        skills: [],
      },
    ]);

    getOpportunityApplications.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <IncomingDashboard />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("Frontend Developer")
    ).toBeInTheDocument();

    expect(
      screen.getByText("React + Vite")
    ).toBeInTheDocument();

    expect(
      screen.getByText("open")
    ).toBeInTheDocument();
  });

  it("loads applicant counts", async () => {
    getMyProjects.mockResolvedValue([
      {
        id: 1,
        title: "BuildMate",
        description: "Student collaboration",
        project_type: "Web",
      },
    ]);

    getProjectOpportunities.mockResolvedValue([
      {
        id: 102,
        role: "Frontend Developer",
        description: "",
        status: "open",
        skills: [],
      },
    ]);

    getOpportunityApplications.mockResolvedValue([
      {},
      {},
      {},
    ]);

    render(
      <MemoryRouter>
        <IncomingDashboard />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("3")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Applicants")
    ).toBeInTheDocument();
  });

  it("loads application counts for every opportunity", async () => {
    getMyProjects.mockResolvedValue([
      {
        id: 1,
        title: "BuildMate",
        description: "",
        project_type: "Web",
      },
    ]);

    getProjectOpportunities.mockResolvedValue([
      {
        id: 201,
        role: "Frontend",
        status: "open",
        skills: [],
      },
      {
        id: 202,
        role: "Backend",
        status: "open",
        skills: [],
      },
    ]);

    getOpportunityApplications
      .mockResolvedValueOnce([{}, {}])
      .mockResolvedValueOnce([{}]);

    render(
      <MemoryRouter>
        <IncomingDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        getOpportunityApplications
      ).toHaveBeenCalledTimes(2);
    });

    // Verify the exact IDs were called in order
    expect(
      getOpportunityApplications.mock.calls
    ).toEqual([[201], [202]]);
  });

  it("renders opportunity skills", async () => {
    getMyProjects.mockResolvedValue([
      {
        id: 1,
        title: "BuildMate",
        description: "",
        project_type: "Web",
      },
    ]);

    getProjectOpportunities.mockResolvedValue([
      {
        id: 103,
        role: "Frontend",
        status: "open",
        description: "",
        skills: [
          {
            id: 1,
            name: "React",
          },
          {
            id: 2,
            name: "Vite",
          },
        ],
      },
    ]);

    getOpportunityApplications.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <IncomingDashboard />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("React")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Vite")
    ).toBeInTheDocument();
  });

  it("selects another project and loads its opportunities", async () => {
    const user = userEvent.setup();

    getMyProjects.mockResolvedValue([
      {
        id: 1,
        title: "Project A",
        description: "",
        project_type: "Web",
      },
      {
        id: 2,
        title: "Project B",
        description: "",
        project_type: "Mobile",
      },
    ]);

    getProjectOpportunities
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <IncomingDashboard />
      </MemoryRouter>
    );

    expect(await screen.findByText("Project B")).toBeInTheDocument();

    await user.click(screen.getByText("Project B"));

    await waitFor(() => {
      expect(getProjectOpportunities).toHaveBeenLastCalledWith(2);
    });
  });

  it("navigates to applicant list when applicant card is clicked", async () => {
    const user = userEvent.setup();

    getMyProjects.mockResolvedValue([
      {
        id: 1,
        title: "BuildMate",
        description: "",
        project_type: "Web",
      },
    ]);

    getProjectOpportunities.mockResolvedValue([
      {
        id: 104,
        role: "Frontend Developer",
        description: "",
        status: "open",
        skills: [],
      },
    ]);

    getOpportunityApplications.mockResolvedValue([{}, {}]);

    render(
      <MemoryRouter>
        <IncomingDashboard />
      </MemoryRouter>
    );

    const applicantsCard = await screen.findByText("Applicants");

    await user.click(applicantsCard);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/opportunities/104/applicants"
    );
  });

  it("shows singular applicant label", async () => {
    getMyProjects.mockResolvedValue([
      {
        id: 1,
        title: "BuildMate",
        description: "",
        project_type: "Web",
      },
    ]);

    getProjectOpportunities.mockResolvedValue([
      {
        id: 105,
        role: "Frontend",
        description: "",
        status: "open",
        skills: [],
      },
    ]);

    getOpportunityApplications.mockResolvedValue([{}]);

    render(
      <MemoryRouter>
        <IncomingDashboard />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("Applicant")
    ).toBeInTheDocument();
  });

  it("handles project loading failure", async () => {
    getMyProjects.mockRejectedValue(new Error("Server Error"));

    render(
      <MemoryRouter>
        <IncomingDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.queryByText(/loading projects/i)
      ).not.toBeInTheDocument();
    });
  });

  it("handles opportunity loading failure", async () => {
    getMyProjects.mockResolvedValue([
      {
        id: 1,
        title: "BuildMate",
        description: "",
        project_type: "Web",
      },
    ]);

    getProjectOpportunities.mockRejectedValue(
      new Error("Server Error")
    );

    render(
      <MemoryRouter>
        <IncomingDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getProjectOpportunities).toHaveBeenCalled();
    });
  });

  it("handles failed application count requests", async () => {
    getMyProjects.mockResolvedValue([
      {
        id: 1,
        title: "BuildMate",
        description: "",
        project_type: "Web",
      },
    ]);

    getProjectOpportunities.mockResolvedValue([
      {
        id: 106,
        role: "Frontend",
        description: "",
        status: "open",
        skills: [],
      },
    ]);

    getOpportunityApplications.mockRejectedValue(
      new Error("Network Error")
    );

    render(
      <MemoryRouter>
        <IncomingDashboard />
      </MemoryRouter>
    );

    expect(await screen.findByText("0")).toBeInTheDocument();
  });
});
