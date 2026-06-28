import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import PublicProfile from "./PublicProfile";

import { getProfile } from "../../api/profile";
import { getProjects } from "../../api/projects";
import { useAuth } from "../../hooks/useAuth";

vi.mock("../../api/profile");
vi.mock("../../api/projects");
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

const mockBuilderProfile = {
  id: 10,
  full_name: "Bob Builder",
  bio: "Just keep building things",
  college: "MIT",
  degree: "Aerospace",
  github: "https://github.com/bob",
  linkedin: "https://linkedin.com/in/bob",
  portfolio: "https://bob.dev",
  avatar: "https://example.com/bob.jpg",
  availability: "Available now",
  skills: "Python, TensorFlow, React",
  activity_score: 95,
  reliability_score: 88,
};

const mockBuilderProjects = [
  { id: 101, title: "Autonomous Drone", project_type: "Hardware" },
];

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/profile/10"]}>
      <Routes>
        <Route path="/profile/:userId" element={<PublicProfile />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.resetAllMocks();

  useAuth.mockReturnValue({
    user: { id: 2, name: "Alice" },
  });

  getProfile.mockResolvedValue(mockBuilderProfile);
  getProjects.mockResolvedValue(mockBuilderProjects);

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
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("PublicProfile Page", () => {
  it("renders loader screen initially", async () => {
    let resolveProfile;
    getProfile.mockImplementationOnce(() => new Promise((resolve) => {
      resolveProfile = resolve;
    }));

    renderPage();

    expect(screen.getByText("fetching builder details...")).toBeInTheDocument();

    resolveProfile(mockBuilderProfile);

    expect(await screen.findByText("Bob Builder")).toBeInTheDocument();
  });

  it("renders public builder details", async () => {
    renderPage();

    expect(await screen.findByText("Bob Builder")).toBeInTheDocument();
    
    // Core Card
    expect(screen.getByText("Available now")).toBeInTheDocument();
    expect(screen.getByText(/MIT · Aerospace/)).toBeInTheDocument();

    // About Card
    expect(screen.getByText(`"Just keep building things"`)).toBeInTheDocument();

    // Projects Card
    expect(screen.getByText("Projects Built (1)")).toBeInTheDocument();
    expect(screen.getByText("Autonomous Drone")).toBeInTheDocument();

    // Skills Card
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("TensorFlow")).toBeInTheDocument();

    // Scores
    expect(await screen.findByText("95")).toBeInTheDocument(); // Activity Score
    expect(await screen.findByText("88")).toBeInTheDocument(); // Reliability Score

    // External links
    const githubLink = screen.getByRole("link", { name: /GitHub/i });
    expect(githubLink).toHaveAttribute("href", "https://github.com/bob");
  });

  it("handles profile not found state", async () => {
    const user = userEvent.setup();
    getProfile.mockRejectedValueOnce({
      response: {
        status: 404,
      },
    });

    renderPage();

    expect(await screen.findByText("Profile Not Found")).toBeInTheDocument();
    expect(screen.getByText("This user hasn't cooked up a profile yet.")).toBeInTheDocument();

    const backBtn = screen.getByRole("button", { name: /back/i });
    await user.click(backBtn);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("handles empty details states correctly", async () => {
    getProfile.mockResolvedValueOnce({
      ...mockBuilderProfile,
      bio: "",
      skills: "",
    });
    getProjects.mockResolvedValueOnce([]);

    renderPage();

    expect(await screen.findByText("Bob Builder")).toBeInTheDocument();

    expect(screen.getByText(/No bio added yet/i)).toBeInTheDocument();
    expect(screen.getByText(/No public projects added by this builder/i)).toBeInTheDocument();
    expect(screen.getByText(/No skills listed by this builder/i)).toBeInTheDocument();
  });
});
