import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import CreateOpportunity from "./CreateOpportunity";

import { createOpportunity, getOpportunity, updateOpportunity } from "../../api/opportunities";
import { getSkills } from "../../api/userSkills";
import { useAuth } from "../../hooks/useAuth";

vi.mock("../../api/opportunities");
vi.mock("../../api/userSkills");
vi.mock("../../hooks/useAuth");

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockSkills = [
  { id: 101, name: "React" },
  { id: 102, name: "Node.js" },
  { id: 103, name: "Python" },
];

const mockOpportunityData = {
  id: 50,
  role: "ML Engineer",
  seats: 3,
  status: "open",
  project_id: 1,
  skills: [
    { skill: { id: 103, name: "Python" } },
  ],
};

function renderCreationPage() {
  return render(
    <MemoryRouter initialEntries={["/projects/1/opportunities/new"]}>
      <Routes>
        <Route path="/projects/:id/opportunities/new" element={<CreateOpportunity />} />
      </Routes>
    </MemoryRouter>
  );
}

function renderEditPage() {
  return render(
    <MemoryRouter initialEntries={["/projects/1/opportunities/50/edit"]}>
      <Routes>
        <Route path="/projects/:id/opportunities/:opportunityId/edit" element={<CreateOpportunity />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.resetAllMocks();

  useAuth.mockReturnValue({
    user: { id: 2, name: "Alice" },
  });

  getSkills.mockResolvedValue(mockSkills);
  createOpportunity.mockResolvedValue({ id: 50 });
  getOpportunity.mockResolvedValue(mockOpportunityData);
  updateOpportunity.mockResolvedValue({});

  vi.spyOn(window, "alert").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CreateOpportunity - Creation Mode", () => {
  it("renders page header and fields in creation mode", async () => {
    renderCreationPage();

    expect(screen.getByText("open up a spot")).toBeInTheDocument();
    expect(screen.getByLabelText(/what role are you after/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("...or type your own role")).toBeInTheDocument();
    expect(screen.getByText("1 seat")).toBeInTheDocument();
    expect(screen.getByText("open")).toBeInTheDocument();
    expect(screen.getByText("closed")).toBeInTheDocument();
  });

  it("handles preset chip selections and custom input", async () => {
    renderCreationPage();

    const frontendChip = screen.getByRole("button", { name: /frontend dev/i });
    await userEvent.click(frontendChip);

    const input = screen.getByPlaceholderText("...or type your own role");
    expect(input.value).toBe("Frontend Dev");

    // Custom typing
    await userEvent.clear(input);
    await userEvent.type(input, "Fullstack Architect");
    expect(input.value).toBe("Fullstack Architect");
  });

  it("handles stepping seats up and down", async () => {
    renderCreationPage();

    expect(screen.getByText("1 seat")).toBeInTheDocument();

    const plusBtn = screen.getByRole("button", { name: "+" });
    const minusBtn = screen.getByRole("button", { name: "−" });

    // Step up
    await userEvent.click(plusBtn);
    expect(screen.getByText("2 seats")).toBeInTheDocument();

    await userEvent.click(plusBtn);
    expect(screen.getByText("3 seats")).toBeInTheDocument();

    // Step down
    await userEvent.click(minusBtn);
    expect(screen.getByText("2 seats")).toBeInTheDocument();

    // Floor of 1 seat
    await userEvent.click(minusBtn);
    await userEvent.click(minusBtn);
    expect(screen.getByText("1 seat")).toBeInTheDocument();
  });

  it("handles status card selection", async () => {
    renderCreationPage();

    const closedBtn = screen.getByRole("button", { name: /closed/i });
    expect(closedBtn).not.toHaveClass("on");

    await userEvent.click(closedBtn);
    expect(closedBtn).toHaveClass("on");
  });

  it("handles searching and selecting skills", async () => {
    renderCreationPage();

    const skillsInput = screen.getByPlaceholderText(/search required skill/i);
    await userEvent.type(skillsInput, "Rea");

    const suggestion = await screen.findByText("React");
    await userEvent.click(suggestion);

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(skillsInput.value).toBe("");
  });

  it("handles removing selected skills", async () => {
    renderCreationPage();

    const skillsInput = screen.getByPlaceholderText(/search required skill/i);
    await userEvent.type(skillsInput, "Rea");

    const suggestion = await screen.findByText("React");
    await userEvent.click(suggestion);

    const tag = screen.getByText("React").closest("span");
    const removeBtn = within(tag).getByRole("button");
    await userEvent.click(removeBtn);

    expect(screen.queryByText("React")).not.toBeInTheDocument();
  });

  it("submits the form successfully and creates role", async () => {
    renderCreationPage();

    const input = screen.getByPlaceholderText("...or type your own role");
    await userEvent.type(input, "Backend Engineer");

    const plusBtn = screen.getByRole("button", { name: "+" });
    await userEvent.click(plusBtn);

    const skillsInput = screen.getByPlaceholderText(/search required skill/i);
    await fireEvent.change(skillsInput, { target: { value: "Node" } });
    const suggestion = await screen.findByText("Node.js");
    await userEvent.click(suggestion);

    const submitBtn = screen.getByRole("button", { name: /post this role/i });
    await userEvent.click(submitBtn);

    expect(createOpportunity).toHaveBeenCalledWith({
      role: "Backend Engineer",
      seats: 2,
      status: "open",
      project_id: 1,
      required_skills: [102],
    });

    expect(window.alert).toHaveBeenCalledWith("Role created successfully!");
    expect(mockNavigate).toHaveBeenCalledWith("/projects/1");
  });

  it("handles create errors gracefully", async () => {
    createOpportunity.mockRejectedValueOnce({
      response: {
        data: {
          detail: "Invalid project ID",
        },
      },
    });

    renderCreationPage();

    const input = screen.getByPlaceholderText("...or type your own role");
    await userEvent.type(input, "Backend Engineer");

    const submitBtn = screen.getByRole("button", { name: /post this role/i });
    await userEvent.click(submitBtn);

    expect(window.alert).toHaveBeenCalledWith("Invalid project ID");
  });
});

describe("CreateOpportunity - Edit Mode", () => {
  it("pre-fills form with opportunity details and submits updates", async () => {
    renderEditPage();

    expect(screen.getByText("loading role details...")).toBeInTheDocument();

    // Verify populated values
    const input = await screen.findByPlaceholderText("...or type your own role");
    expect(input.value).toBe("ML Engineer");
    expect(screen.getByText("3 seats")).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();

    // Edit role text and submit
    await userEvent.clear(input);
    await userEvent.type(input, "Senior ML Practitioner");

    const submitBtn = screen.getByRole("button", { name: /save changes/i });
    await userEvent.click(submitBtn);

    expect(updateOpportunity).toHaveBeenCalledWith("50", {
      role: "Senior ML Practitioner",
      seats: 3,
      status: "open",
      project_id: 1,
      required_skills: [103],
    });

    expect(window.alert).toHaveBeenCalledWith("Role updated successfully!");
    expect(mockNavigate).toHaveBeenCalledWith("/projects/1");
  });
});
