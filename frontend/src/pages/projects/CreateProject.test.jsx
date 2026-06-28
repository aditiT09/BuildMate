import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import CreateProject from "./CreateProject";

import {
  createProject,
  getProjectById,
  updateProject,
} from "../../api/projects";
import { getSkills } from "../../api/userSkills";
import {
  addProjectSkill,
  getProjectSkills,
  removeProjectSkill,
} from "../../api/projectSkills";
import { useAuth } from "../../hooks/useAuth";

vi.mock("../../api/projects");
vi.mock("../../api/userSkills");
vi.mock("../../api/projectSkills");
vi.mock("../../hooks/useAuth");

const mockNavigate = vi.fn();
let mockId = undefined;

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({
      id: mockId,
    }),
  };
});

const mockSkillsList = [
  { id: 1, name: "React" },
  { id: 2, name: "Node.js" },
  { id: 3, name: "TypeScript" },
  { id: 4, name: "Python" },
];

const mockProjectData = {
  id: 123,
  title: "Campus Carpool",
  description: "A student collaboration app for carpooling around campus.",
  timeline: "6 weeks",
  project_type: "Web App",
};

const mockProjectSkills = [
  { id: 1, name: "React" },
  { id: 3, name: "TypeScript" },
];

function renderPage() {
  return render(
    <MemoryRouter>
      <CreateProject />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  mockId = undefined;

  useAuth.mockReturnValue({
    user: {
      id: 2,
      name: "Alice",
      email: "alice@example.com",
    },
    logout: vi.fn(),
  });

  getSkills.mockResolvedValue(mockSkillsList);
  createProject.mockResolvedValue({ id: 123 });
  updateProject.mockResolvedValue({ id: 123 });
  getProjectById.mockResolvedValue(mockProjectData);
  getProjectSkills.mockResolvedValue(mockProjectSkills);
  addProjectSkill.mockResolvedValue({});
  removeProjectSkill.mockResolvedValue({});

  vi.spyOn(window, "alert").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CreateProject - Creation Mode", () => {
  it("renders page header and fields in creation mode", async () => {
    renderPage();
    
    expect(screen.getByText("new drop")).toBeInTheDocument();
    expect(screen.getByText("put your idea out there")).toBeInTheDocument();
    expect(screen.getByLabelText(/what's it called\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/what's the pitch\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/how long's the grind\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/what kind of project\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/skills required/i)).toBeInTheDocument();
    
    expect(screen.getByRole("button", { name: /publish it/i })).toBeInTheDocument();
  });

  it("handles form inputs correctly", async () => {
    const user = userEvent.setup();
    renderPage();

    const titleInput = screen.getByLabelText(/what's it called\?/i);
    await user.type(titleInput, "My Awesome Project");
    expect(titleInput.value).toBe("My Awesome Project");

    const descInput = screen.getByLabelText(/what's the pitch\?/i);
    await user.type(descInput, "This is a long description of at least twenty characters.");
    expect(descInput.value).toBe("This is a long description of at least twenty characters.");

    const timelineInput = screen.getByLabelText(/how long's the grind\?/i);
    await user.type(timelineInput, "3 months");
    expect(timelineInput.value).toBe("3 months");
  });

  it("handles selecting preset chips for project type", async () => {
    const user = userEvent.setup();
    renderPage();

    const chip = screen.getByRole("button", { name: /web app/i });
    await user.click(chip);

    const customTypeInput = screen.getByLabelText(/what kind of project\?/i);
    expect(customTypeInput.value).toBe("Web App");
  });

  it("handles searching and selecting skills", async () => {
    const user = userEvent.setup();
    renderPage();

    const searchInput = screen.getByPlaceholderText(/search required skill/i);
    await user.type(searchInput, "Rea");

    const suggestion = await screen.findByText("React");
    expect(suggestion).toBeInTheDocument();

    await user.click(suggestion);
    
    expect(screen.queryByText("React", { selector: ".cp-suggest-item" })).not.toBeInTheDocument();
    expect(screen.getByText("React", { selector: ".cp-skill-tag" })).toBeInTheDocument();
  });

  it("handles adding skills by pressing Enter", async () => {
    const user = userEvent.setup();
    renderPage();

    const searchInput = screen.getByPlaceholderText(/search required skill/i);
    await user.type(searchInput, "Type");
    await user.keyboard("{Enter}");

    expect(screen.getByText("TypeScript", { selector: ".cp-skill-tag" })).toBeInTheDocument();
  });

  it("shows 'No matching skills found' if skill query has no matches", async () => {
    const user = userEvent.setup();
    renderPage();

    const searchInput = screen.getByPlaceholderText(/search required skill/i);
    await user.type(searchInput, "unknownskill");

    expect(await screen.findByText("No matching skills found")).toBeInTheDocument();
  });

  it("handles removing a selected skill", async () => {
    const user = userEvent.setup();
    renderPage();

    const searchInput = screen.getByPlaceholderText(/search required skill/i);
    await user.type(searchInput, "React");
    await user.click(await screen.findByText("React"));

    const skillTag = screen.getByText("React").closest(".cp-skill-tag");
    expect(skillTag).toBeInTheDocument();

    const removeBtn = within(skillTag).getByRole("button");
    await user.click(removeBtn);

    expect(screen.queryByText("React", { selector: ".cp-skill-tag" })).not.toBeInTheDocument();
  });

  it("submits the form successfully and calls APIs in creation mode", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/what's it called\?/i), "BuildMate Test");
    await user.type(screen.getByLabelText(/what's the pitch\?/i), "Test project with 20+ characters.");
    await user.type(screen.getByLabelText(/how long's the grind\?/i), "2 months");
    await user.click(screen.getByRole("button", { name: /AI \/ ML/i }));

    // Add React skill
    await user.type(screen.getByPlaceholderText(/search required skill/i), "React");
    await user.click(await screen.findByText("React"));

    const submitBtn = screen.getByRole("button", { name: /publish it/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(createProject).toHaveBeenCalledWith({
        title: "BuildMate Test",
        description: "Test project with 20+ characters.",
        timeline: "2 months",
        project_type: "AI / ML",
      });
    });

    await waitFor(() => {
      expect(addProjectSkill).toHaveBeenCalledWith(123, 1);
    });

    expect(window.alert).toHaveBeenCalledWith("Project created successfully!");
    expect(mockNavigate).toHaveBeenCalledWith("/projects/123");
  });

  it("validates form inputs before submission", async () => {
    const user = userEvent.setup();
    renderPage();

    const titleInput = screen.getByLabelText(/what's it called\?/i);
    const descInput = screen.getByLabelText(/what's the pitch\?/i);
    const timelineInput = screen.getByLabelText(/how long's the grind\?/i);
    const typeInput = screen.getByLabelText(/what kind of project\?/i);
    const submitBtn = screen.getByRole("button", { name: /publish it/i });

    // Fill all fields validly first
    fireEvent.change(titleInput, { target: { value: "Valid Title" } });
    fireEvent.change(descInput, { target: { value: "This is a valid project description of at least twenty characters." } });
    fireEvent.change(timelineInput, { target: { value: "6 weeks" } });
    fireEvent.change(typeInput, { target: { value: "Web App" } });

    // 1. Test Title too short
    fireEvent.change(titleInput, { target: { value: "ab" } }); // length 2
    await user.click(submitBtn);
    expect(window.alert).toHaveBeenCalledWith("Project title must be at least 3 characters.");
    vi.mocked(window.alert).mockClear();

    // Restore title to valid
    fireEvent.change(titleInput, { target: { value: "Valid Title" } });

    // 2. Test Description too short
    fireEvent.change(descInput, { target: { value: "1234567890123456789" } }); // length 19
    await user.click(submitBtn);
    expect(window.alert).toHaveBeenCalledWith("Project description must be at least 20 characters.");
    vi.mocked(window.alert).mockClear();

    // Restore description to valid
    fireEvent.change(descInput, { target: { value: "This is a valid project description of at least twenty characters." } });

    // 3. Test Timeline too short
    fireEvent.change(timelineInput, { target: { value: "1" } }); // length 1
    await user.click(submitBtn);
    expect(window.alert).toHaveBeenCalledWith("Timeline must be at least 2 characters.");
    vi.mocked(window.alert).mockClear();

    // Restore timeline to valid
    fireEvent.change(timelineInput, { target: { value: "6 weeks" } });

    // 4. Test Project Type too short
    fireEvent.change(typeInput, { target: { value: "a" } }); // length 1
    await user.click(submitBtn);
    expect(window.alert).toHaveBeenCalledWith("Please choose or enter a project type.");
  });

  it("handles form submit API failure gracefully", async () => {
    createProject.mockRejectedValueOnce({
      response: {
        data: {
          detail: "Validation failed on server",
        },
      },
    });

    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/what's it called\?/i), "BuildMate Test");
    await user.type(screen.getByLabelText(/what's the pitch\?/i), "Test project with 20+ characters.");
    await user.type(screen.getByLabelText(/how long's the grind\?/i), "2 months");
    await user.click(screen.getByRole("button", { name: /AI \/ ML/i }));

    const submitBtn = screen.getByRole("button", { name: /publish it/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Validation failed on server");
    });
  });
});

describe("CreateProject - Edit Mode", () => {
  beforeEach(() => {
    mockId = "123";
  });

  it("renders loading draft state initially", async () => {
    renderPage();
    expect(screen.getByText(/pulling up your draft/i)).toBeInTheDocument();
  });

  it("pre-fills form with project details after load", async () => {
    renderPage();

    expect(await screen.findByText("tweak your project")).toBeInTheDocument();

    expect(screen.getByLabelText(/what's it called\?/i).value).toBe("Campus Carpool");
    expect(screen.getByLabelText(/what's the pitch\?/i).value).toBe("A student collaboration app for carpooling around campus.");
    expect(screen.getByLabelText(/how long's the grind\?/i).value).toBe("6 weeks");
    expect(screen.getByLabelText(/what kind of project\?/i).value).toBe("Web App");

    expect(screen.getByText("React", { selector: ".cp-skill-tag" })).toBeInTheDocument();
    expect(screen.getByText("TypeScript", { selector: ".cp-skill-tag" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });

  it("submits the form successfully in edit mode and updates skills correctly", async () => {
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByText("tweak your project")).toBeInTheDocument();

    const reactSkillTag = screen.getByText("React").closest(".cp-skill-tag");
    const removeReactBtn = within(reactSkillTag).getByRole("button");
    await user.click(removeReactBtn);

    const searchInput = screen.getByPlaceholderText(/search required skill/i);
    await user.type(searchInput, "Python");
    await user.click(await screen.findByText("Python"));

    const submitBtn = screen.getByRole("button", { name: /save changes/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(updateProject).toHaveBeenCalledWith("123", {
        title: "Campus Carpool",
        description: "A student collaboration app for carpooling around campus.",
        timeline: "6 weeks",
        project_type: "Web App",
      });
    });

    await waitFor(() => {
      expect(addProjectSkill).toHaveBeenCalledWith("123", 4);
    });
    await waitFor(() => {
      expect(removeProjectSkill).toHaveBeenCalledWith("123", 1);
    });

    expect(window.alert).toHaveBeenCalledWith("Project updated successfully!");
    expect(mockNavigate).toHaveBeenCalledWith("/projects/123");
  });

  it("handles loading project failures gracefully", async () => {
    getProjectById.mockRejectedValueOnce({
      response: {
        data: {
          detail: "Project not found",
        },
      },
    });

    renderPage();

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Project not found");
    });
  });
});

describe("CreateProject - Navigation", () => {
  it("navigates back when clicking the back button", async () => {
    const user = userEvent.setup();
    renderPage();

    const backBtn = screen.getByRole("button", { name: /back/i });
    await user.click(backBtn);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
