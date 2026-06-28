import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import ProjectDetail from "./ProjectDetail";

import {
  getProjectById,
  deleteProject,
} from "../../api/projects";

import {
  getProjectOpportunities,
} from "../../api/opportunities";

import {
  getMyApplications,
  createApplication,
} from "../../api/applications";

import {
  getProjectLinks,
  createProjectLink,
  deleteProjectLink,
} from "../../api/projectLinks";

import { getProjectSkills } from "../../api/projectSkills";
import { getSkillGap } from "../../api/matching";

import { useAuth } from "../../hooks/useAuth";

vi.mock("../../api/projects");
vi.mock("../../api/opportunities");
vi.mock("../../api/applications");
vi.mock("../../api/projectLinks");
vi.mock("../../api/projectSkills");
vi.mock("../../api/matching");
vi.mock("../../hooks/useAuth");

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({
      id: "1",
    }),
  };
});

const mockProject = {
  id: 1,
  owner_id: 99,
  title: "BuildMate",
  description: "Student collaboration platform",
  timeline: "3 Months",
  project_type: "Web App",
};

const mockOpportunities = [
  {
    id: 1,
    role: "Frontend Developer",
    seats: 2,
    status: "Open",
    skills: [],
  },
];

const mockLinks = [];

const mockSkills = [
  {
    id: 1,
    name: "React",
  },
];

const mockGap = {
  match_percentage: 80,
  recommendations: [],
};

function renderPage() {
  return render(
    <MemoryRouter>
      <ProjectDetail />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();

  useAuth.mockReturnValue({
    user: {
      id: 2,
      name: "Alice",
    },
  });

  getProjectById.mockResolvedValue(mockProject);

  getProjectOpportunities.mockResolvedValue(
    mockOpportunities
  );

  getProjectLinks.mockResolvedValue(mockLinks);

  getProjectSkills.mockResolvedValue(mockSkills);

  getSkillGap.mockResolvedValue(mockGap);

  getMyApplications.mockResolvedValue([]);

  createApplication.mockResolvedValue({});

  createProjectLink.mockResolvedValue({});

  deleteProjectLink.mockResolvedValue({});

  deleteProject.mockResolvedValue({});
});

describe("ProjectDetail", () => {
  it("renders loading state initially", async () => {
    renderPage();

    expect(
      screen.getByText(/loading the goods/i)
    ).toBeInTheDocument();

    await screen.findByText("BuildMate");
  });

  it("renders project title", async () => {
    renderPage();

    expect(
      await screen.findByText("BuildMate")
    ).toBeInTheDocument();
  });

  it("renders project description", async () => {
    renderPage();

    expect(
      await screen.findByText(
        "Student collaboration platform"
      )
    ).toBeInTheDocument();
  });

  it("renders project timeline", async () => {
    renderPage();

    expect(
      await screen.findByText(/3 Months/i)
    ).toBeInTheDocument();
  });

  it("renders project type badge", async () => {
    renderPage();

    expect(
      await screen.findByText(/Web App/i)
    ).toBeInTheDocument();
  });

  it("renders creator profile button", async () => {
    renderPage();

    expect(
      await screen.findByRole("button", {
        name: /view creator profile/i,
      })
    ).toBeInTheDocument();
  });

  it("renders back button", async () => {
    renderPage();

    expect(
      await screen.findByRole("button", {
        name: /back/i,
      })
    ).toBeInTheDocument();
  });

  it("navigates back when clicking back button", async () => {
    const user = userEvent.setup();

    renderPage();

    const backButton = await screen.findByRole(
      "button",
      {
        name: /back/i,
      }
    );

    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("renders fallback description when description is missing", async () => {
    getProjectById.mockResolvedValueOnce({
      ...mockProject,
      description: "",
    });

    renderPage();

    expect(
      await screen.findByText(
        /no description yet/i
      )
    ).toBeInTheDocument();
  });

  it("renders EmptyState when project is not found", async () => {
    getProjectById.mockResolvedValueOnce(null);

    renderPage();

    expect(
      await screen.findByText(/nothing here/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /this project doesn't exist/i
      )
    ).toBeInTheDocument();
  });

  it("shows Open Roles section for visitors", async () => {
    renderPage();

    expect(
      await screen.findByText(/open roles/i)
    ).toBeInTheDocument();
  });

  it("renders opportunity role", async () => {
    renderPage();

    expect(
      await screen.findByText("Frontend Developer")
    ).toBeInTheDocument();
  });

  it("renders seat count", async () => {
    renderPage();

    expect(
      await screen.findByText(/2 seats/i)
    ).toBeInTheDocument();
  });

  it("shows Apply button for visitors", async () => {
    renderPage();

    expect(
      await screen.findByRole("button", {
        name: /apply/i,
      })
    ).toBeInTheDocument();
  });

  it("does not render owner action buttons for visitors", async () => {
    renderPage();

    await screen.findByText("BuildMate");

    expect(
      screen.queryByRole("button", {
        name: /edit/i,
      })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: /matches/i,
      })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: /delete/i,
      })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: /open a role/i,
      })
    ).not.toBeInTheDocument();
  });

  it("renders opportunity skills", async () => {
    getProjectOpportunities.mockResolvedValueOnce([
      {
        id: 1,
        role: "Frontend Developer",
        seats: 2,
        status: "Open",
        skills: [
          {
            id: 1,
            skill: {
              name: "React",
            },
          },
          {
            id: 2,
            skill: {
              name: "TypeScript",
            },
          },
        ],
      },
    ]);

    renderPage();

    const reactElements = await screen.findAllByText("React");
    expect(reactElements.length).toBeGreaterThan(0);

    expect(
      screen.getByText("TypeScript")
    ).toBeInTheDocument();
  });

  it("renders multiple opportunities", async () => {
    getProjectOpportunities.mockResolvedValueOnce([
      {
        id: 1,
        role: "Frontend Developer",
        seats: 2,
        status: "Open",
        skills: [],
      },
      {
        id: 2,
        role: "Backend Developer",
        seats: 1,
        status: "Open",
        skills: [],
      },
    ]);

    renderPage();

    expect(
      await screen.findByText("Frontend Developer")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Backend Developer")
    ).toBeInTheDocument();
  });

  it("shows message when no opportunities exist", async () => {
    getProjectOpportunities.mockResolvedValueOnce([]);

    renderPage();

    expect(
      await screen.findByText(
        /no open roles right now/i
      )
    ).toBeInTheDocument();
  });

  it("navigates to creator profile", async () => {
    const user = userEvent.setup();

    renderPage();

    const profileButton =
      await screen.findByRole("button", {
        name: /view creator profile/i,
      });

    await user.click(profileButton);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/profile/99"
    );
  });

  it("does not show Applied state when user has not applied", async () => {
    getMyApplications.mockResolvedValueOnce([]);

    renderPage();

    expect(
      await screen.findByRole("button", {
        name: /apply/i,
      })
    ).toBeEnabled();
  });

  it("shows Applied state when application already exists", async () => {
    getMyApplications.mockResolvedValueOnce([
      {
        opportunity_id: 1,
      },
    ]);

    renderPage();

    expect(
      await screen.findByText(/applied/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /applied/i,
      })
    ).toBeDisabled();
  });
});

describe("Owner View", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: {
        id: 99,
        name: "Project Owner",
      },
    });
  });

  it("shows 'your project' label", async () => {
    renderPage();

    expect(
      await screen.findByText(/your project/i)
    ).toBeInTheDocument();
  });

  it("renders Create Opportunity button", async () => {
    renderPage();

    expect(
      await screen.findByRole("button", {
        name: /open a role/i,
      })
    ).toBeInTheDocument();
  });

  it("renders Edit button", async () => {
    renderPage();

    const editButtons = await screen.findAllByRole("button", {
      name: /^edit$/i,
    });

    expect(editButtons.length).toBeGreaterThanOrEqual(1);
  });

  it("renders Matches button", async () => {
    renderPage();

    expect(
      await screen.findByRole("button", {
        name: /matches/i,
      })
    ).toBeInTheDocument();
  });

  it("renders Delete Project button", async () => {
    renderPage();

    expect(
      await screen.findByRole("button", {
        name: /delete/i,
      })
    ).toBeInTheDocument();
  });

  it("renders Add Resource button", async () => {
    renderPage();

    expect(
      await screen.findByRole("button", {
        name: /\+ drop a link/i,
      })
    ).toBeInTheDocument();
  });

  it("renders View Applicants button", async () => {
    renderPage();

    expect(
      await screen.findByRole("button", {
        name: /view applicants/i,
      })
    ).toBeInTheDocument();
  });

  it("renders Invite Builders banner", async () => {
    renderPage();

    expect(
      await screen.findByText(
        /You can also invite builders to apply/i
      )
    ).toBeInTheDocument();
  });

  it("does not show Apply buttons to the owner", async () => {
    renderPage();

    await screen.findByText("BuildMate");

    expect(
      screen.queryByRole("button", {
        name: /apply/i,
      })
    ).not.toBeInTheDocument();
  });

  it("shows owner profile button instead of creator profile", async () => {
    renderPage();

    expect(
      await screen.findByRole("button", {
        name: /my profile/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: /view creator profile/i,
      })
    ).not.toBeInTheDocument();
  });

  it("navigates to Create Opportunity page", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(
      await screen.findByRole("button", {
        name: /open a role/i,
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/projects/1/create-opportunity"
    );
  });

  it("navigates to Edit Project page", async () => {
    const user = userEvent.setup();

    renderPage();

    const editButtons = await screen.findAllByRole("button", {
      name: /^edit$/i,
    });

    await user.click(editButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/projects/1/edit"
    );
  });

  it("navigates to Matches page", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(
      await screen.findByRole("button", {
        name: /matches/i,
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/projects/1/matches"
    );
  });

  it("navigates to applicants page", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(
      await screen.findByRole("button", {
        name: /view applicants/i,
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/opportunities/1/applicants"
    );
  });

  it("navigates to invite builders page", async () => {
    const user = userEvent.setup();

    renderPage();

    const inviteBanners = await screen.findAllByText(
      /You can also invite builders to apply/i
    );

    const inviteBannerContainer = inviteBanners[0].closest("div");

    await user.click(inviteBannerContainer);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/opportunities/1/invite"
    );
  });

  it("shows opportunity status", async () => {
    renderPage();

    expect(
      await screen.findByText(/2 seats\s*·\s*Open/i)
    ).toBeInTheDocument();
  });

  it("shows owner opportunity cards", async () => {
    renderPage();

    expect(
      await screen.findByText(
        /who's knocking/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Frontend Developer")
    ).toBeInTheDocument();
  });
});

describe("Skill Gap & Required Skills", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: {
        id: 2,
        name: "Alice",
      },
    });
  });

  it("renders required skills", async () => {
    getProjectSkills.mockResolvedValueOnce([
      { id: 1, name: "React" },
      { id: 2, name: "FastAPI" },
    ]);

    renderPage();

    expect(
      await screen.findByText(/skills they're looking for/i)
    ).toBeInTheDocument();

    const skills = await screen.findAllByText("React");
    expect(skills.length).toBeGreaterThan(0);

    expect(
      screen.getByText("FastAPI")
    ).toBeInTheDocument();
  });

  it("renders multiple required skills", async () => {
    getProjectSkills.mockResolvedValueOnce([
      { id: 1, name: "React" },
      { id: 2, name: "FastAPI" },
      { id: 3, name: "Redis" },
      { id: 4, name: "PostgreSQL" },
    ]);

    renderPage();

    expect(await screen.findByText("Redis")).toBeInTheDocument();

    expect(
      screen.getByText("PostgreSQL")
    ).toBeInTheDocument();
  });

  it("does not render skills section when project has no skills", async () => {
    getProjectSkills.mockResolvedValueOnce([]);

    renderPage();

    await screen.findByText("BuildMate");

    expect(
      screen.queryByText(/skills they're looking for/i)
    ).not.toBeInTheDocument();
  });

  it("renders skill gap percentage", async () => {
    getSkillGap.mockResolvedValueOnce({
      match_percentage: 82,
      recommendations: [],
    });

    renderPage();

    expect(
      await screen.findByText(/82% overlap/i)
    ).toBeInTheDocument();
  });

  it("renders recommendations", async () => {
    getSkillGap.mockResolvedValueOnce({
      match_percentage: 55,
      recommendations: [
        {
          skill_name: "Redis",
          reason: "Needed for caching",
        },
        {
          skill_name: "Docker",
          reason: "Deployment requirement",
        },
      ],
    });

    renderPage();

    expect(await screen.findByText("Redis")).toBeInTheDocument();

    expect(
      screen.getByText("Docker")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Needed for caching")
    ).toBeInTheDocument();
  });

  it("renders success message when there are no recommendations", async () => {
    getSkillGap.mockResolvedValueOnce({
      match_percentage: 100,
      recommendations: [],
    });

    renderPage();

    expect(
      await screen.findByText(
        /you have all the required skills/i
      )
    ).toBeInTheDocument();
  });

  it("renders skill gap section for visitors", async () => {
    renderPage();

    expect(
      await screen.findByText(/your matching stats/i)
    ).toBeInTheDocument();
  });

  it("does not render skill gap section for project owner", async () => {
    useAuth.mockReturnValue({
      user: {
        id: 99,
      },
    });

    renderPage();

    await screen.findByText("BuildMate");

    expect(
      screen.queryByText(/your matching stats/i)
    ).not.toBeInTheDocument();
  });

  it("handles skill gap API failure gracefully", async () => {
    getSkillGap.mockRejectedValueOnce(
      new Error("Network Error")
    );

    renderPage();

    expect(
      await screen.findByText("BuildMate")
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/your matching stats/i)
    ).not.toBeInTheDocument();
  });

  it("renders progress bar using match percentage", async () => {
    getSkillGap.mockResolvedValueOnce({
      match_percentage: 73,
      recommendations: [],
    });

    renderPage();

    expect(
      await screen.findByText(/73% overlap/i)
    ).toBeInTheDocument();

    const progressBars = document.querySelectorAll(
      'div[style*="width: 73%"]'
    );

    expect(progressBars.length).toBeGreaterThan(0);
  });
});

describe("Apply Workflow", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: {
        id: 2,
        name: "Alice",
      },
    });

    getMyApplications.mockResolvedValue([]);
    createApplication.mockResolvedValue({});
  });

  it("submits an application successfully", async () => {
    const user = userEvent.setup();

    renderPage();

    const applyButton = await screen.findByRole("button", {
      name: /apply/i,
    });

    await user.click(applyButton);

    await waitFor(() => {
      expect(createApplication).toHaveBeenCalledWith(1);
    });

    expect(
      await screen.findByRole("button", {
        name: /applied/i,
      })
    ).toBeDisabled();
  });

  it("disables Apply button while submitting", async () => {
    let resolvePromise;

    createApplication.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
    );

    const user = userEvent.setup();

    renderPage();

    const button = await screen.findByRole("button", {
      name: /apply/i,
    });

    await user.click(button);

    expect(
      screen.getByRole("button", {
        name: /sending/i,
      })
    ).toBeDisabled();

    resolvePromise({});

    await waitFor(() =>
      expect(
        screen.getByRole("button", {
          name: /applied/i,
        })
      ).toBeDisabled()
    );
  });

  it("changes Apply button to Applied after success", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(
      await screen.findByRole("button", {
        name: /apply/i,
      })
    );

    expect(
      await screen.findByRole("button", {
        name: /applied/i,
      })
    ).toBeDisabled();
  });

  it("does not allow duplicate applications", async () => {
    getMyApplications.mockResolvedValueOnce([
      {
        opportunity_id: 1,
      },
    ]);

    renderPage();

    const appliedButton =
      await screen.findByRole("button", {
        name: /applied/i,
      });

    expect(appliedButton).toBeDisabled();

    expect(createApplication).not.toHaveBeenCalled();
  });

  it("shows API error when application fails", async () => {
    const alertSpy = vi
      .spyOn(window, "alert")
      .mockImplementation(() => {});

    createApplication.mockRejectedValueOnce({
      response: {
        data: {
          detail: "Already applied",
        },
      },
    });

    const user = userEvent.setup();

    renderPage();

    await user.click(
      await screen.findByRole("button", {
        name: /apply/i,
      })
    );

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalled()
    );

    alertSpy.mockRestore();
  });

  it("renders multiple Apply buttons for multiple opportunities", async () => {
    getProjectOpportunities.mockResolvedValueOnce([
      {
        id: 1,
        role: "Frontend",
        seats: 1,
        status: "Open",
        skills: [],
      },
      {
        id: 2,
        role: "Backend",
        seats: 1,
        status: "Open",
        skills: [],
      },
    ]);

    renderPage();

    const buttons =
      await screen.findAllByRole("button", {
        name: /apply/i,
      });

    expect(buttons).toHaveLength(2);
  });

  it("only updates the clicked opportunity", async () => {
    getProjectOpportunities.mockResolvedValueOnce([
      {
        id: 1,
        role: "Frontend",
        seats: 1,
        status: "Open",
        skills: [],
      },
      {
        id: 2,
        role: "Backend",
        seats: 1,
        status: "Open",
        skills: [],
      },
    ]);

    const user = userEvent.setup();

    renderPage();

    const buttons =
      await screen.findAllByRole("button", {
        name: /apply/i,
      });

    await user.click(buttons[0]);

    expect(createApplication).toHaveBeenCalledWith(1);

    const appliedButtons =
      await screen.findAllByRole("button");

    expect(
      appliedButtons.some((btn) =>
        btn.textContent.toLowerCase().includes("applied")
      )
    ).toBe(true);
  });

  it("re-enables button when request fails", async () => {
    createApplication.mockRejectedValueOnce({
      response: {
        data: {
          detail: "Server error",
        },
      },
    });

    const alertSpy = vi
      .spyOn(window, "alert")
      .mockImplementation(() => {});

    const user = userEvent.setup();

    renderPage();

    const applyButton =
      await screen.findByRole("button", {
        name: /apply/i,
      });

    await user.click(applyButton);

    await waitFor(() =>
      expect(applyButton).toBeEnabled()
    );

    alertSpy.mockRestore();
  });

  it("keeps Apply button enabled after failed request", async () => {
    createApplication.mockRejectedValueOnce(new Error());

    vi.spyOn(window, "alert").mockImplementation(() => {});

    const user = userEvent.setup();

    renderPage();

    const button =
      await screen.findByRole("button", {
        name: /apply/i,
      });

    await user.click(button);

    await waitFor(() =>
      expect(button).toBeEnabled()
    );
  });
});

describe("Resource Board", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: {
        id: 99,
        name: "Owner",
      },
    });

    getProjectById.mockResolvedValue({
      ...mockProject,
      owner_id: 99,
    });

    vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders empty resource state", async () => {
    getProjectLinks.mockResolvedValueOnce([]);

    renderPage();

    expect(
      await screen.findByText(
        /nothing pinned yet/i
      )
    ).toBeInTheDocument();
  });

  it("renders project resources", async () => {
    getProjectLinks.mockResolvedValueOnce([
      {
        id: 1,
        title: "Frontend Repo",
        resource_type: "GitHub",
        url: "https://github.com/test",
      },
      {
        id: 2,
        title: "Figma Design",
        resource_type: "Figma",
        url: "https://figma.com/file/test",
      },
    ]);

    renderPage();

    expect(
      await screen.findByText("Frontend Repo")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Figma Design")
    ).toBeInTheDocument();
  });

  it("opens add resource form", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(
      await screen.findByRole("button", {
        name: /\+ drop a link/i,
      })
    );

    expect(
      screen.getByPlaceholderText(
        /what is it called/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        /paste the link/i
      )
    ).toBeInTheDocument();
  });

  it("closes resource form", async () => {
    const user = userEvent.setup();

    renderPage();

    const toggle =
      await screen.findByRole("button", {
        name: /\+ drop a link/i,
      });

    await user.click(toggle);

    await user.click(
      screen.getByRole("button", {
        name: /close/i,
      })
    );

    expect(
      screen.queryByPlaceholderText(
        /what is it called/i
      )
    ).not.toBeInTheDocument();
  });

  it("validates empty title", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(
      await screen.findByRole("button", {
        name: /\+ drop a link/i,
      })
    );

    await user.selectOptions(
      screen.getByRole("combobox"),
      "GitHub"
    );

    await user.type(
      screen.getByPlaceholderText(/paste the link/i),
      "https://github.com/test"
    );

    await user.click(
      screen.getByRole("button", {
        name: /pin it/i,
      })
    );

    expect(window.alert).toHaveBeenCalled();
  });

  it("validates missing resource type", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(
      await screen.findByRole("button", {
        name: /\+ drop a link/i,
      })
    );

    await user.type(
      screen.getByPlaceholderText(/what is it called/i),
      "Repo"
    );

    await user.type(
      screen.getByPlaceholderText(/paste the link/i),
      "https://github.com/test"
    );

    await user.click(
      screen.getByRole("button", {
        name: /pin it/i,
      })
    );

    expect(window.alert).toHaveBeenCalled();
  });

  it("validates invalid url", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(
      await screen.findByRole("button", {
        name: /\+ drop a link/i,
      })
    );

    await user.type(
      screen.getByPlaceholderText(/what is it called/i),
      "Repo"
    );

    await user.selectOptions(
      screen.getByRole("combobox"),
      "GitHub"
    );

    await user.type(
      screen.getByPlaceholderText(/paste the link/i),
      "abc"
    );

    await user.click(
      screen.getByRole("button", {
        name: /pin it/i,
      })
    );

    expect(window.alert).toHaveBeenCalled();
  });

  it("adds resource successfully", async () => {
    createProjectLink.mockResolvedValueOnce({
      id: 3,
      title: "API Docs",
      resource_type: "Notion",
      url: "https://notion.so/test",
    });

    const user = userEvent.setup();

    renderPage();

    await user.click(
      await screen.findByRole("button", {
        name: /\+ drop a link/i,
      })
    );

    await user.type(
      screen.getByPlaceholderText(/what is it called/i),
      "API Docs"
    );

    await user.selectOptions(
      screen.getByRole("combobox"),
      "Notion"
    );

    await user.type(
      screen.getByPlaceholderText(/paste the link/i),
      "https://notion.so/test"
    );

    await user.click(
      screen.getByRole("button", {
        name: /pin it/i,
      })
    );

    await waitFor(() =>
      expect(createProjectLink).toHaveBeenCalled()
    );

    expect(
      await screen.findByText("API Docs")
    ).toBeInTheDocument();
  });

  it("deletes resource successfully", async () => {
    getProjectLinks.mockResolvedValueOnce([
      {
        id: 1,
        title: "Repo",
        resource_type: "GitHub",
        url: "https://github.com/test",
      },
    ]);

    const user = userEvent.setup();

    renderPage();

    await user.click(
      await screen.findByRole("button", {
        name: /remove/i,
      })
    );

    // useParams returns id as string "1", not number 1
    expect(deleteProjectLink).toHaveBeenCalledWith(
      "1",
      1
    );
  });

  it("handles add resource failure", async () => {
    createProjectLink.mockRejectedValueOnce({
      response: {
        data: {
          detail: "Server error",
        },
      },
    });

    const user = userEvent.setup();

    renderPage();

    await user.click(
      await screen.findByRole("button", {
        name: /\+ drop a link/i,
      })
    );

    await user.type(
      screen.getByPlaceholderText(/what is it called/i),
      "Repo"
    );

    await user.selectOptions(
      screen.getByRole("combobox"),
      "GitHub"
    );

    await user.type(
      screen.getByPlaceholderText(/paste the link/i),
      "https://github.com/test"
    );

    await user.click(
      screen.getByRole("button", {
        name: /pin it/i,
      })
    );

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalled()
    );
  });

  it("handles delete resource failure", async () => {
    deleteProjectLink.mockRejectedValueOnce({
      response: {
        data: {
          detail: "Delete failed",
        },
      },
    });

    getProjectLinks.mockResolvedValueOnce([
      {
        id: 1,
        title: "Repo",
        resource_type: "GitHub",
        url: "https://github.com/test",
      },
    ]);

    const user = userEvent.setup();

    renderPage();

    await user.click(
      await screen.findByRole("button", {
        name: /remove/i,
      })
    );

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalled()
    );
  });
});
describe("Delete Project & Navigation", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: {
        id: 99,
        name: "Owner",
      },
    });

    getProjectById.mockResolvedValue({
      ...mockProject,
      owner_id: 99,
    });

    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("deletes project successfully", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);

    deleteProject.mockResolvedValueOnce({});

    const user = userEvent.setup();

    renderPage();

    await user.click(
      await screen.findByRole("button", {
        name: /delete/i,
      })
    );

    await waitFor(() =>
      expect(deleteProject).toHaveBeenCalledWith("1")
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/my-projects"
    );
  });

  it("does not delete project when confirmation is cancelled", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);

    const user = userEvent.setup();

    renderPage();

    await user.click(
      await screen.findByRole("button", {
        name: /delete/i,
      })
    );

    expect(deleteProject).not.toHaveBeenCalled();
  });

  it("shows alert when delete project fails", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);

    deleteProject.mockRejectedValueOnce({
      response: {
        data: {
          detail: "Delete failed",
        },
      },
    });

    const user = userEvent.setup();

    renderPage();

    await user.click(
      await screen.findByRole("button", {
        name: /delete/i,
      })
    );

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalled()
    );
  });

  it("navigates to edit project page", async () => {
    const user = userEvent.setup();

    renderPage();

    const editButtons =
      await screen.findAllByRole("button", {
        name: /^edit$/i,
      });

    await user.click(editButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/projects/1/edit"
    );
  });

  it("navigates to project matches page", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(
      await screen.findByRole("button", {
        name: /matches/i,
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/projects/1/matches"
    );
  });

  it("navigates to create opportunity page", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(
      await screen.findByRole("button", {
        name: /open a role/i,
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/projects/1/create-opportunity"
    );
  });

  it("navigates to applicants page", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(
      await screen.findByRole("button", {
        name: /view applicants/i,
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/opportunities/1/applicants"
    );
  });

  it("navigates to invite builders page", async () => {
    const user = userEvent.setup();

    renderPage();

    const inviteSections =
      await screen.findAllByText(/invite builders/i);

    await user.click(inviteSections[0]);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/opportunities/1/invite"
    );
  });

  it("shows owner opportunity status", async () => {
    renderPage();

    expect(
      await screen.findByText(/2 seats\s*·\s*Open/i)
    ).toBeInTheDocument();
  });

  it("renders owner opportunity cards", async () => {
    renderPage();

    expect(
      await screen.findByText(/who's knocking/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText("Frontend Developer")
    ).toBeInTheDocument();
  });

  it("renders owner opportunity skills", async () => {
    getProjectOpportunities.mockResolvedValueOnce([
      {
        id: 1,
        role: "Frontend Developer",
        seats: 2,
        status: "Open",
        skills: [
          {
            id: 1,
            skill: {
              name: "React",
            },
          },
        ],
      },
    ]);

    renderPage();

    const reactSkills =
      await screen.findAllByText("React");

    expect(reactSkills.length).toBeGreaterThan(0);
  });
});
describe("Error Handling & Accessibility", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: {
        id: 2,
        name: "Alice",
      },
    });

    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders page when opportunities API fails", async () => {
    getProjectOpportunities.mockRejectedValueOnce(
      new Error("Network Error")
    );

    renderPage();

    expect(
      await screen.findByText("BuildMate")
    ).toBeInTheDocument();
  });

  it("renders page when project links API fails", async () => {
    getProjectLinks.mockRejectedValueOnce(
      new Error("Network Error")
    );

    renderPage();

    expect(
      await screen.findByText("BuildMate")
    ).toBeInTheDocument();
  });

  it("renders page when project skills API fails", async () => {
    getProjectSkills.mockRejectedValueOnce(
      new Error("Network Error")
    );

    renderPage();

    expect(
      await screen.findByText("BuildMate")
    ).toBeInTheDocument();
  });

  it("renders page when applications API fails", async () => {
    getMyApplications.mockRejectedValueOnce(
      new Error("Network Error")
    );

    renderPage();

    expect(
      await screen.findByText("BuildMate")
    ).toBeInTheDocument();
  });

  it("does not crash when optional data is missing", async () => {
    getProjectById.mockResolvedValueOnce({
      ...mockProject,
      description: null,
      timeline: null,
      project_type: null,
    });

    renderPage();

    expect(
      await screen.findByText("BuildMate")
    ).toBeInTheDocument();
  });

  it("renders resource links with correct href", async () => {
    getProjectLinks.mockResolvedValueOnce([
      {
        id: 1,
        title: "GitHub",
        resource_type: "GitHub",
        url: "https://github.com/buildmate",
      },
    ]);

    renderPage();

    await screen.findByText("BuildMate");

    const links = await screen.findAllByRole("link");

    const githubLink = links.find(
      (link) =>
        link.getAttribute("href") ===
        "https://github.com/buildmate"
    );

    expect(githubLink).toBeTruthy();

    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/buildmate"
    );
  });

  it("opens external links in a new tab", async () => {
    getProjectLinks.mockResolvedValueOnce([
      {
        id: 1,
        title: "GitHub",
        resource_type: "GitHub",
        url: "https://github.com/buildmate",
      },
    ]);

    renderPage();

    await screen.findByText("BuildMate");

    const links = await screen.findAllByRole("link");

    const githubLink = links.find(
      (link) =>
        link.getAttribute("href") ===
        "https://github.com/buildmate"
    );

    expect(githubLink).toBeTruthy();

    expect(githubLink).toHaveAttribute("target", "_blank");
  });

  it("back button is keyboard accessible", async () => {
    renderPage();

    const button =
      await screen.findByRole("button", {
        name: /back/i,
      });

    button.focus();

    expect(button).toHaveFocus();
  });

  it("apply button is keyboard accessible", async () => {
    renderPage();

    const button =
      await screen.findByRole("button", {
        name: /apply/i,
      });

    button.focus();

    expect(button).toHaveFocus();
  });

  it("renders loading state with aria-busy", () => {
    renderPage();

    const loading =
      screen.getByText(/loading the goods/i);

    expect(
      loading.closest("[aria-busy='true']")
    ).toBeInTheDocument();
  });

  it("renders accessible buttons", async () => {
    renderPage();

    const buttons =
      await screen.findAllByRole("button");

    expect(buttons.length).toBeGreaterThan(0);
  });

  it("renders accessible links", async () => {
    getProjectLinks.mockResolvedValueOnce([
      {
        id: 1,
        title: "GitHub Repo",
        resource_type: "GitHub",
        url: "https://github.com/test",
      },
    ]);

    renderPage();

    await screen.findByText("BuildMate");

    const links =
      await screen.findAllByRole("link");

    expect(links.length).toBeGreaterThan(0);
  });

  it("does not render duplicate loading states", () => {
    renderPage();

    expect(
      screen.getAllByText(/loading the goods/i)
    ).toHaveLength(1);
  });

  it("renders opportunity cards with accessible buttons", async () => {
    renderPage();

    await screen.findByText("BuildMate");

    const buttons =
      await screen.findAllByRole("button");

    expect(
      buttons.some((button) =>
        button.textContent
          ?.toLowerCase()
          .includes("apply")
      )
    ).toBe(true);
  });

  it("renders page without console errors during successful load", async () => {
    renderPage();

    await screen.findByText("BuildMate");

    expect(console.error).not.toHaveBeenCalled();
  });
});