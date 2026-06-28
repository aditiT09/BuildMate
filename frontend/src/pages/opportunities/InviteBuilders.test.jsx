import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import InviteBuilders from "./InviteBuilders";

import { getOpportunity } from "../../api/opportunities";
import { getOpportunityMatches } from "../../api/matching";
import { createInvitation, getSentInvitations, cancelInvitation } from "../../api/invitations";
import { useAuth } from "../../hooks/useAuth";

vi.mock("../../api/opportunities");
vi.mock("../../api/matching");
vi.mock("../../api/invitations");
vi.mock("../../hooks/useAuth");

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockOpportunity = {
  id: 10,
  role: "ML Engineer",
  seats: 1,
  status: "open",
  project_id: 1,
};

const mockMatches = [
  {
    user_id: 201,
    name: "Bob Builder",
    bio: "AI Researcher",
    skill_match: 80,
    user_skills: ["Python", "TensorFlow", "React"],
    matching_skills: ["Python", "TensorFlow"],
  },
  {
    user_id: 202,
    name: "Charlie coder",
    bio: "Fullstack dev",
    skill_match: 40,
    user_skills: ["React", "CSS"],
    matching_skills: ["React"],
  },
];

const mockSentInvitations = [
  { id: 1, opportunity_id: 10, user_id: 202 },
];

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/opportunities/10/invite"]}>
      <Routes>
        <Route path="/opportunities/:opportunityId/invite" element={<InviteBuilders />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.resetAllMocks();

  useAuth.mockReturnValue({
    user: { id: 2, name: "Alice" },
  });

  getOpportunity.mockResolvedValue(mockOpportunity);
  getOpportunityMatches.mockResolvedValue(mockMatches);
  getSentInvitations.mockResolvedValue(mockSentInvitations);
  createInvitation.mockResolvedValue({});
  cancelInvitation.mockResolvedValue({});

  vi.spyOn(window, "alert").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("InviteBuilders", () => {
  it("renders loading state initially", async () => {
    let resolveMatches;
    const matchesPromise = new Promise((resolve) => {
      resolveMatches = resolve;
    });
    getOpportunityMatches.mockImplementationOnce(() => matchesPromise);

    renderPage();

    expect(screen.getByText("scouting matching builders...")).toBeInTheDocument();

    await waitFor(() => expect(getOpportunityMatches).toHaveBeenCalled());
    resolveMatches(mockMatches);
    
    expect(await screen.findByRole("heading", { name: /invite builders for ML Engineer/i })).toBeInTheDocument();
  });

  it("renders recommended matching builders details", async () => {
    renderPage();

    expect(await screen.findByRole("heading", { name: /invite builders for ML Engineer/i })).toBeInTheDocument();

    expect(screen.getByText("Bob Builder")).toBeInTheDocument();
    expect(screen.getByText("AI Researcher")).toBeInTheDocument();
    expect(screen.getByText("80% overlap")).toBeInTheDocument();
    
    expect(screen.getByText("Charlie coder")).toBeInTheDocument();
    expect(screen.getByText("Fullstack dev")).toBeInTheDocument();
    expect(screen.getByText("40% overlap")).toBeInTheDocument();

    expect(screen.getByText("TensorFlow")).toBeInTheDocument();
    expect(screen.getByText("CSS")).toBeInTheDocument();
  });

  it("handles sending an invitation", async () => {
    const user = userEvent.setup();
    renderPage();

    const inviteBtn = await screen.findByRole("button", { name: /^invite$/i });
    await user.click(inviteBtn);

    expect(createInvitation).toHaveBeenCalledWith({
      user_id: 201,
      opportunity_id: 10,
    });
    expect(window.alert).toHaveBeenCalledWith("Invitation sent successfully!");
    
    expect(screen.getAllByRole("button", { name: /cancel invite/i })).toHaveLength(2);
  });

  it("handles cancelling an invitation", async () => {
    const user = userEvent.setup();
    renderPage();

    const cancelBtn = await screen.findByRole("button", { name: /cancel invite/i });
    await user.click(cancelBtn);

    expect(cancelInvitation).toHaveBeenCalledWith(10, 202);
    expect(window.alert).toHaveBeenCalledWith("Invitation cancelled.");
    
    expect(await screen.findAllByRole("button", { name: /^invite$/i })).toHaveLength(2);
  });

  it("renders empty state when no builders match", async () => {
    getOpportunityMatches.mockResolvedValueOnce([]);

    renderPage();

    expect(await screen.findByText("no matching builders found")).toBeInTheDocument();
    expect(screen.getByText("try modifying the role's required tech stack to find a match!")).toBeInTheDocument();
  });
});
