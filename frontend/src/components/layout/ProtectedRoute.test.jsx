import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Mock the useAuth hook
vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../../hooks/useAuth";

describe("ProtectedRoute", () => {
  it("shows loading screen while authentication is loading", () => {
    useAuth.mockReturnValue({
      token: null,
      loading: true,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText(/Authenticating/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Protected Content/i)
    ).not.toBeInTheDocument();
  });

  it("renders children when authenticated", () => {
    useAuth.mockReturnValue({
      token: "fake-jwt-token",
      loading: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to login when unauthenticated", () => {
    useAuth.mockReturnValue({
      token: null,
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(
      screen.queryByText("Protected Content")
    ).not.toBeInTheDocument();
  });
});