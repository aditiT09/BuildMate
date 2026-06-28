import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Layout from "./Layout";

// Mock DashboardNavbar
vi.mock("./DashboardNavbar", () => ({
  default: () => <div data-testid="dashboard-navbar">Navbar</div>,
}));

describe("Layout", () => {
  it("renders the DashboardNavbar", () => {
    render(
      <Layout>
        <div>Page Content</div>
      </Layout>
    );

    expect(
      screen.getByTestId("dashboard-navbar")
    ).toBeInTheDocument();
  });

  it("renders children inside the layout", () => {
    render(
      <Layout>
        <h1>Dashboard Page</h1>
      </Layout>
    );

    expect(
      screen.getByText("Dashboard Page")
    ).toBeInTheDocument();
  });

  it("applies top padding to the main content", () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    const main = screen.getByRole("main");

    expect(main).toHaveStyle({
      paddingTop: "60px",
    });
  });
});