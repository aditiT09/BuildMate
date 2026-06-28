import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import userEvent from "@testing-library/user-event";
import api from "../../api/axios";
// Mock navigation
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useAuth
const mockLogin = vi.fn();

vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

describe("Login", () => {
  it("renders login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(
      screen.getByLabelText(/email address/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/password/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /sign in/i,
      })
    ).toBeInTheDocument();
  });
});

it("toggles password visibility", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  const password = screen.getByLabelText(/password/i);

  expect(password).toHaveAttribute("type", "password");

  const buttons = screen.getAllByRole("button");
  const toggleButton = buttons.find(
    (button) => button.getAttribute("type") === "button"
  );

  await user.click(toggleButton);

  expect(password).toHaveAttribute("type", "text");
});

vi.mock("../../api/axios", () => ({
  default: {
    post: vi.fn(),
  },
}));
it("logs in successfully", async () => {
  api.post.mockResolvedValue({
    data: {
      access_token: "jwt-token",
    },
  });

  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  await user.type(
    screen.getByLabelText(/email address/i),
    "test@example.com"
  );

  await user.type(
    screen.getByLabelText(/password/i),
    "password123"
  );

  await user.click(
    screen.getByRole("button", {
      name: /sign in/i,
    })
  );

  expect(api.post).toHaveBeenCalled();

  expect(mockLogin).toHaveBeenCalledWith("jwt-token");

  expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
});
it("shows login error", async () => {
  api.post.mockRejectedValue({
    response: {
      data: {
        detail: "Invalid credentials",
      },
    },
  });

  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  await user.type(
    screen.getByLabelText(/email address/i),
    "wrong@test.com"
  );

  await user.type(
    screen.getByLabelText(/password/i),
    "wrongpass"
  );

  await user.click(
    screen.getByRole("button", {
      name: /sign in/i,
    })
  );

  expect(
    await screen.findByText(/invalid credentials/i)
  ).toBeInTheDocument();
});