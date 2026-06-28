import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Profile from "./Profile";

import { getMyProfile, saveProfile } from "../../api/profile";
import { getMySkills, getSkills, addSkill, removeSkill } from "../../api/userSkills";
import { getMyProjects } from "../../api/projects";
import { getMyApplications } from "../../api/applications";
import { getCurrentUser } from "../../api/users";
import { useAuth } from "../../hooks/useAuth";

vi.mock("../../api/profile");
vi.mock("../../api/userSkills");
vi.mock("../../api/projects");
vi.mock("../../api/applications");
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

const mockProfile = {
  full_name: "Alice Builder",
  bio: "Passionate developer building BuildMate",
  college: "MIT",
  degree: "Computer Science",
  github: "github.com/alice",
  linkedin: "linkedin.com/in/alice",
  portfolio: "alice.dev",
  avatar: "https://example.com/avatar.jpg",
  availability: "Available now",
};

const mockMySkills = [
  { id: 10, skill_id: 101, name: "React" },
  { id: 11, skill_id: 102, name: "Node.js" },
];

const mockAllSkills = [
  { id: 101, name: "React" },
  { id: 102, name: "Node.js" },
  { id: 103, name: "Python" },
  { id: 104, name: "Docker" },
];

const mockProjects = [
  { id: 1, title: "BuildMate", project_type: "Web App" },
];

function renderPage() {
  return render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.resetAllMocks();

  useAuth.mockReturnValue({
    user: { id: 2, name: "Alice" },
  });

  getMyProfile.mockResolvedValue(mockProfile);
  getMySkills.mockResolvedValue(mockMySkills);
  getSkills.mockResolvedValue(mockAllSkills);
  getMyProjects.mockResolvedValue(mockProjects);
  getMyApplications.mockResolvedValue([]);
  getCurrentUser.mockResolvedValue({ activity_score: 85, reliability_score: 92 });
  saveProfile.mockResolvedValue(mockProfile);
  addSkill.mockResolvedValue({});
  removeSkill.mockResolvedValue({});

  const clocks = new Map();
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
    const elapsed = clocks.get(cb) || 0;
    const nextElapsed = elapsed + 300;
    clocks.set(cb, nextElapsed);
    return setTimeout(() => cb(nextElapsed), 0);
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
    clearTimeout(id);
  });

  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Profile Page", () => {
  it("renders loading skeletons initially", async () => {
    let resolveProfile;
    getMyProfile.mockImplementationOnce(() => new Promise((resolve) => {
      resolveProfile = resolve;
    }));

    renderPage();

    expect(screen.queryByText("Alice Builder")).not.toBeInTheDocument();

    resolveProfile(mockProfile);
    
    expect(await screen.findByText("Alice Builder")).toBeInTheDocument();
  });

  it("renders profile details and Overview tab content", async () => {
    renderPage();

    expect(await screen.findByText("Alice Builder")).toBeInTheDocument();
    
    // Left Sidebar checks
    expect(screen.getByText("Available now")).toBeInTheDocument();
    expect(screen.getByText(/MIT · Computer Science/)).toBeInTheDocument();
    expect(await screen.findByText("85")).toBeInTheDocument(); // Activity Score
    expect(await screen.findByText("92")).toBeInTheDocument(); // Reliability Score
    
    // Overview tab contents
    expect(screen.getByText("Profile completeness")).toBeInTheDocument();
    expect(screen.getByText(`"Passionate developer building BuildMate"`)).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
    expect(screen.getAllByText("BuildMate").length).toBe(2);
  });

  it("handles profile editing flow in Edit tab", async () => {
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByText("Alice Builder")).toBeInTheDocument();

    // Click Edit tab
    const editTab = screen.getAllByRole("button", { name: /^edit$/i })[0];
    await user.click(editTab);

    // Verify fields populated
    const nameInput = screen.getByLabelText(/full name/i);
    expect(nameInput.value).toBe("Alice Builder");

    const collegeInput = screen.getByLabelText(/^college$/i);
    expect(collegeInput.value).toBe("MIT");

    // Modify fields
    fireEvent.change(nameInput, { target: { value: "Alice Developer" } });
    fireEvent.change(collegeInput, { target: { value: "Stanford" } });

    // Click Save
    const saveBtn = screen.getByRole("button", { name: /save changes/i });
    await user.click(saveBtn);

    expect(saveProfile).toHaveBeenCalledWith({
      full_name: "Alice Developer",
      bio: "Passionate developer building BuildMate",
      college: "Stanford",
      degree: "Computer Science",
      github: "github.com/alice",
      linkedin: "linkedin.com/in/alice",
      portfolio: "alice.dev",
      avatar: "https://example.com/avatar.jpg",
      availability: "Available now",
    });

    expect(await screen.findByText("Profile saved")).toBeInTheDocument();
  });

  it("handles presets and cancels editing in Edit tab", async () => {
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByText("Alice Builder")).toBeInTheDocument();

    // Click Edit tab
    const editTab = screen.getAllByRole("button", { name: /^edit$/i })[0];
    await user.click(editTab);

    // Choose avatar preset
    const presetImg = screen.getAllByRole("img")[1]; // first preset avatar img
    await user.click(presetImg);

    const avatarInput = screen.getByLabelText(/avatar url/i);
    expect(avatarInput.value).toBe(presetImg.src);

    // Cancel edit
    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelBtn);

    // Check we are back in overview
    expect(screen.queryByLabelText(/full name/i)).not.toBeInTheDocument();
  });

  it("handles adding and removing skills in Skills tab", async () => {
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByText("Alice Builder")).toBeInTheDocument();

    // Click Skills tab
    const skillsTab = screen.getByRole("button", { name: /^skills$/i });
    await user.click(skillsTab);

    // Check current skills shown
    expect(screen.getByText("React")).toBeInTheDocument();

    // Search and add Python (Python id: 103)
    const searchInput = screen.getByPlaceholderText(/search skills/i);
    await user.type(searchInput, "Pyth");

    const addPythonBtn = await screen.findByRole("button", { name: /python/i });
    
    // Mock getMySkills return updated skills list
    getMySkills.mockResolvedValueOnce([
      ...mockMySkills,
      { id: 12, skill_id: 103, name: "Python" },
    ]);

    await user.click(addPythonBtn);

    expect(addSkill).toHaveBeenCalledWith(103);
    expect(await screen.findByText("Skill added")).toBeInTheDocument();

    // Remove React (React user skill id: 10)
    const reactTag = screen.getByText("React").closest("span");
    const removeBtn = within(reactTag).getByRole("button");
    await user.click(removeBtn);

    expect(removeSkill).toHaveBeenCalledWith(10);
    expect(await screen.findByText("Skill removed")).toBeInTheDocument();
  });
});
