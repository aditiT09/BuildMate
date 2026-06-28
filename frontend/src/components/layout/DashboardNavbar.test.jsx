import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import DashboardNavbar from "./DashboardNavbar";

const mockNavigate = vi.fn();
const mockLogout = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      pathname: "/dashboard",
    }),
  };
});

vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({
    user: {
      name: "John Doe",
      email: "john@test.com",
    },
    logout: mockLogout,
  }),
}));

describe("DashboardNavbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders BuildMate logo", () => {
    render(
      <MemoryRouter>
        <DashboardNavbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/buildmate/i)).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(
      <MemoryRouter>
        <DashboardNavbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/discover/i)).toBeInTheDocument();
    expect(screen.getByText(/my projects/i)).toBeInTheDocument();
    expect(screen.getByText(/applications/i)).toBeInTheDocument();
  });

  it("shows user initials", () => {
    render(
      <MemoryRouter>
        <DashboardNavbar />
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: "JD" })).toBeInTheDocument();
  });

  it("opens profile dropdown", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <DashboardNavbar />
      </MemoryRouter>
    );

    await user.click(
      screen.getByRole("button", {
        name: "JD",
      })
    );

    expect(screen.getByText("john@test.com")).toBeInTheDocument();

    expect(screen.getAllByText("Profile")[0]).toBeInTheDocument();
  });

  it("logs out successfully", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <DashboardNavbar />
      </MemoryRouter>
    );

    await user.click(
      screen.getByRole("button", {
        name: "JD",
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: /log out/i,
      })
    );

    expect(mockLogout).toHaveBeenCalled();

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});