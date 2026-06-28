import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Register from "./Register";
import { registerUser } from "../../api/users";

// --------------------
// Mocks
// --------------------

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../api/users", () => ({
  registerUser: vi.fn(),
}));

describe("Register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders registration form", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /create account/i,
      })
    ).toBeInTheDocument();
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const password = screen.getByLabelText(/password/i);

    expect(password).toHaveAttribute("type", "password");

    const toggleButton = screen
      .getAllByRole("button")
      .find((button) => button.getAttribute("type") === "button");

    await user.click(toggleButton);

    expect(password).toHaveAttribute("type", "text");

    await user.click(toggleButton);

    expect(password).toHaveAttribute("type", "password");
  });

  it("shows password hint while typing", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const password = screen.getByLabelText(/password/i);

    expect(
      screen.queryByText(/8\+ characters/i)
    ).not.toBeInTheDocument();

    await user.type(password, "abc");

    expect(screen.getByText(/8\+ characters/i)).toBeInTheDocument();

    expect(screen.getByText(/uppercase/i)).toBeInTheDocument();

    expect(screen.getByText(/lowercase/i)).toBeInTheDocument();

    expect(screen.getByText(/number/i)).toBeInTheDocument();
  });

  it("shows validation error for weak password", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    await user.type(
      screen.getByLabelText(/full name/i),
      "John Doe"
    );

    await user.type(
      screen.getByLabelText(/email address/i),
      "john@test.com"
    );

    await user.type(
      screen.getByLabelText(/password/i),
      "password"
    );

    await user.click(
      screen.getByRole("button", {
        name: /create account/i,
      })
    );

    expect(
      screen.getByText(
        /password must contain uppercase, lowercase, a number, and be at least 8 characters/i
      )
    ).toBeInTheDocument();

    expect(registerUser).not.toHaveBeenCalled();
  });

  it("registers successfully", async () => {
    registerUser.mockResolvedValue({});

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    await user.type(
      screen.getByLabelText(/full name/i),
      "John Doe"
    );

    await user.type(
      screen.getByLabelText(/email address/i),
      "John@Test.com"
    );

    await user.type(
      screen.getByLabelText(/password/i),
      "Password123"
    );

    await user.click(
      screen.getByRole("button", {
        name: /create account/i,
      })
    );

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@test.com",
        password: "Password123",
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("shows duplicate email error", async () => {
    registerUser.mockRejectedValue({
      response: {
        status: 409,
      },
    });

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    await user.type(
      screen.getByLabelText(/full name/i),
      "John Doe"
    );

    await user.type(
      screen.getByLabelText(/email address/i),
      "john@test.com"
    );

    await user.type(
      screen.getByLabelText(/password/i),
      "Password123"
    );

    await user.click(
      screen.getByRole("button", {
        name: /create account/i,
      })
    );

    expect(
      await screen.findByText(/email already registered/i)
    ).toBeInTheDocument();
  });

  it("shows invalid email error", async () => {
    registerUser.mockRejectedValue({
      response: {
        status: 422,
      },
    });

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    await user.type(
      screen.getByLabelText(/full name/i),
      "John Doe"
    );

    await user.type(
      screen.getByLabelText(/email address/i),
      "john@test.com"
    );

    await user.type(
      screen.getByLabelText(/password/i),
      "Password123"
    );

    await user.click(
      screen.getByRole("button", {
        name: /create account/i,
      })
    );

    expect(
      await screen.findByText(/please enter a valid email address/i)
    ).toBeInTheDocument();
  });

  it("disables submit button while registering", async () => {
    let resolvePromise;

    registerUser.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
    );

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    await user.type(
      screen.getByLabelText(/full name/i),
      "John Doe"
    );

    await user.type(
      screen.getByLabelText(/email address/i),
      "john@test.com"
    );

    await user.type(
      screen.getByLabelText(/password/i),
      "Password123"
    );

    await user.click(
      screen.getByRole("button", {
        name: /create account/i,
      })
    );

    const button = screen.getByRole("button", {
      name: /creating account/i,
    });

    expect(button).toBeDisabled();

    resolvePromise({});

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});