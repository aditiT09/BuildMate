import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import MyApplications from "./MyApplications";
import userEvent from "@testing-library/user-event";

import {
  getMyApplications,
} from "../../api/applications";

import {
  getReceivedInvitations,
  respondToInvitation,
} from "../../api/invitations";


// -------------------------
// Router
// -------------------------

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// -------------------------
// APIs
// -------------------------

vi.mock("../../api/applications", () => ({
  getMyApplications: vi.fn(),
}));

vi.mock("../../api/invitations", () => ({
  getReceivedInvitations: vi.fn(),
  respondToInvitation: vi.fn(),
}));

// -------------------------
// Layout
// -------------------------

vi.mock("../../components/layout/Layout", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

// -------------------------
// Icons
// -------------------------

vi.mock("../../components/common/Icons", () => ({
  CelebrationIcon: () => <span>CelebrationIcon</span>,
  DeadIcon: () => <span>DeadIcon</span>,
  TimelineIcon: () => <span>TimelineIcon</span>,
  HatIcon: () => <span>HatIcon</span>,
  HopeIcon: () => <span>HopeIcon</span>,
  MailIcon: () => <span>MailIcon</span>,
  MailOpenIcon: () => <span>MailOpenIcon</span>,
  CheckIcon: () => <span>CheckIcon</span>,
}));

describe("MyApplications", () => {
  let alertSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    alertSpy = vi
      .spyOn(window, "alert")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it("shows loading state", () => {
    getMyApplications.mockImplementation(
      () => new Promise(() => {})
    );

    getReceivedInvitations.mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <MemoryRouter>
        <MyApplications />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/checking your inbox/i)
    ).toBeInTheDocument();
  });

  it("shows error state", async () => {
    getMyApplications.mockRejectedValue(
      new Error("Server Error")
    );

    getReceivedInvitations.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <MyApplications />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(
        /couldn't load your applications/i
      )
    ).toBeInTheDocument();
  });

  it("renders retry button after error", async () => {
    getMyApplications.mockRejectedValue(
      new Error("Server Error")
    );

    getReceivedInvitations.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <MyApplications />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("button", {
        name: /try again/i,
      })
    ).toBeInTheDocument();
  });

  it("shows empty state", async () => {
    getMyApplications.mockResolvedValue([]);

    getReceivedInvitations.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <MyApplications />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/nothing here yet/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /you haven't applied to any roles yet/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /browse projects/i,
      })
    ).toBeInTheDocument();
  });

  it("renders applications", async () => {
    getMyApplications.mockResolvedValue([
      {
        id: 1,
        status: "pending",

        opportunity: {
          role: "Frontend Developer",

          description: "React + Vite",

          project: {
            id: 10,
            title: "BuildMate",
          },
        },
      },
    ]);

    getReceivedInvitations.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <MyApplications />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("BuildMate")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Frontend Developer")
    ).toBeInTheDocument();

    expect(
      screen.getByText("React + Vite")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/pending/i)
    ).toBeInTheDocument();
  });

  it("renders pending invitations", async () => {
    getMyApplications.mockResolvedValue([]);

    getReceivedInvitations.mockResolvedValue([
      {
        id: 5,

        status: "pending",

        opportunity: {
          role: "Backend Developer",

          project: {
            title: "AI Builder",
          },
        },
      },
    ]);

    render(
      <MemoryRouter>
        <MyApplications />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(
        /collaboration invites/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("AI Builder")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Backend Developer")
    ).toBeInTheDocument();
  });

  it("accepts an invitation", async () => {
    const user = userEvent.setup();

    getMyApplications.mockResolvedValue([]);

    getReceivedInvitations.mockResolvedValue([
      {
        id: 10,
        status: "pending",
        opportunity: {
          role: "Backend Developer",
          project: {
            title: "AI Builder",
          },
        },
      },
    ]);

    respondToInvitation.mockResolvedValue({});

    render(
      <MemoryRouter>
        <MyApplications />
      </MemoryRouter>
    );

    const acceptButton = await screen.findByRole("button", {
      name: /accept/i,
    });

    const initialCalls = getReceivedInvitations.mock.calls.length;

    await user.click(acceptButton);

    expect(respondToInvitation).toHaveBeenCalledWith(
      10,
      "accepted"
    );

    await waitFor(() => {
      expect(getReceivedInvitations.mock.calls.length)
        .toBeGreaterThan(initialCalls);
    });
  });

  it("declines an invitation", async () => {
    const user = userEvent.setup();

    getMyApplications.mockResolvedValue([]);

    getReceivedInvitations.mockResolvedValue([
      {
        id: 11,
        status: "pending",
        opportunity: {
          role: "Frontend Developer",
          project: {
            title: "BuildMate",
          },
        },
      },
    ]);

    respondToInvitation.mockResolvedValue({});

    render(
      <MemoryRouter>
        <MyApplications />
      </MemoryRouter>
    );

    const declineButton = await screen.findByRole("button", {
      name: /decline/i,
    });

    const initialCalls = getReceivedInvitations.mock.calls.length;

    await user.click(declineButton);

    expect(respondToInvitation).toHaveBeenCalledWith(
      11,
      "rejected"
    );

    await waitFor(() => {
      expect(getReceivedInvitations.mock.calls.length)
        .toBeGreaterThan(initialCalls);
    });
  });

  it("shows alert when accepting invitation fails", async () => {
    const user = userEvent.setup();

    getMyApplications.mockResolvedValue([]);

    getReceivedInvitations.mockResolvedValue([
      {
        id: 1,
        status: "pending",
        opportunity: {
          role: "Backend",
          project: {
            title: "AI Builder",
          },
        },
      },
    ]);

    respondToInvitation.mockRejectedValue({
      response: {
        data: {
          detail: "Invitation already accepted",
        },
      },
    });

    render(
      <MemoryRouter>
        <MyApplications />
      </MemoryRouter>
    );

    await user.click(
      await screen.findByRole("button", {
        name: /accept/i,
      })
    );

    expect(window.alert).toHaveBeenCalledWith(
      "Invitation already accepted"
    );
  });

  it("shows alert when declining invitation fails", async () => {
    const user = userEvent.setup();

    getMyApplications.mockResolvedValue([]);

    getReceivedInvitations.mockResolvedValue([
      {
        id: 2,
        status: "pending",
        opportunity: {
          role: "Frontend",
          project: {
            title: "BuildMate",
          },
        },
      },
    ]);

    respondToInvitation.mockRejectedValue({
      response: {
        data: {
          detail: "Cannot decline invitation",
        },
      },
    });

    render(
      <MemoryRouter>
        <MyApplications />
      </MemoryRouter>
    );

    await user.click(
      await screen.findByRole("button", {
        name: /decline/i,
      })
    );

    expect(window.alert).toHaveBeenCalledWith(
      "Cannot decline invitation"
    );
  });

  it("renders only pending invitations and hides accepted ones", async () => {
    getMyApplications.mockResolvedValue([]);

    getReceivedInvitations.mockResolvedValue([
      {
        id: 101,
        status: "pending",
        opportunity: {
          role: "Backend Developer",
          project: {
            title: "AI Builder",
          },
        },
      },
      {
        id: 102,
        status: "accepted",
        opportunity: {
          role: "Frontend Developer",
          project: {
            title: "BuildMate",
          },
        },
      },
    ]);

    render(
      <MemoryRouter>
        <MyApplications />
      </MemoryRouter>
    );

    // Pending invitation should be visible
    expect(
      await screen.findByText("AI Builder")
    ).toBeInTheDocument();

    // Accepted invitation should be hidden
    expect(
      screen.queryByText("BuildMate")
    ).not.toBeInTheDocument();

    // Only the pending invitation should have action buttons
    const acceptButtons = screen.getAllByRole("button", {
      name: /accept/i,
    });

    expect(acceptButtons).toHaveLength(1);
  });
});
it("retries loading after clicking Try Again", async () => {
  getMyApplications
    .mockRejectedValueOnce(new Error("Server Error"))
    .mockResolvedValueOnce([]);

  getReceivedInvitations.mockResolvedValue([]);

  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <MyApplications />
    </MemoryRouter>
  );

  const retry = await screen.findByRole("button", {
    name: /try again/i,
  });

  // Capture how many calls happened before retry
  const initialCalls = getMyApplications.mock.calls.length;

  await user.click(retry);

  await waitFor(() => {
    expect(getMyApplications.mock.calls.length).toBeGreaterThan(initialCalls);
  });
});

it("navigates to project details", async () => {
  const user = userEvent.setup();

  getMyApplications.mockResolvedValue([
    {
      id: 1,
      status: "pending",
      opportunity: {
        role: "Frontend",
        description: "React",
        project: {
          id: 55,
          title: "BuildMate",
        },
      },
    },
  ]);

  getReceivedInvitations.mockResolvedValue([]);

  render(
    <MemoryRouter>
      <MyApplications />
    </MemoryRouter>
  );

  const projectLink = await screen.findByText(
    /view project/i
  );

  await user.click(projectLink);

  expect(mockNavigate).toHaveBeenCalledWith(
    "/projects/55"
  );
});

it("shows application description", async () => {
  getMyApplications.mockResolvedValue([
    {
      id: 1,
      status: "pending",
      opportunity: {
        role: "Frontend",

        description:
          "Looking for someone experienced with React.",

        project: {
          id: 1,
          title: "BuildMate",
        },
      },
    },
  ]);

  getReceivedInvitations.mockResolvedValue([]);

  render(
    <MemoryRouter>
      <MyApplications />
    </MemoryRouter>
  );

  expect(
    await screen.findByText(
      /looking for someone experienced/i
    )
  ).toBeInTheDocument();
});

it("falls back to untitled project", async () => {
  getMyApplications.mockResolvedValue([
    {
      id: 1,
      status: "pending",
      opportunity: {
        role: "Frontend",
        description: "",
        project: null,
      },
    },
  ]);

  getReceivedInvitations.mockResolvedValue([]);

  render(
    <MemoryRouter>
      <MyApplications />
    </MemoryRouter>
  );

  expect(
    await screen.findByText(
      /untitled project/i
    )
  ).toBeInTheDocument();
});

it("does not render description when missing", async () => {
  getMyApplications.mockResolvedValue([
    {
      id: 1,
      status: "pending",
      opportunity: {
        role: "Frontend",
        description: "",
        project: {
          id: 1,
          title: "BuildMate",
        },
      },
    },
  ]);

  getReceivedInvitations.mockResolvedValue([]);

  render(
    <MemoryRouter>
      <MyApplications />
    </MemoryRouter>
  );

  expect(
    screen.queryByText(
      /looking for someone/i
    )
  ).not.toBeInTheDocument();
});

it("renders accepted application badge", async () => {
  getMyApplications.mockResolvedValue([
    {
      id: 1,
      status: "accepted",
      opportunity: {
        role: "Backend",
        description: "",
        project: {
          id: 1,
          title: "AI Builder",
        },
      },
    },
  ]);

  getReceivedInvitations.mockResolvedValue([]);

  render(
    <MemoryRouter>
      <MyApplications />
    </MemoryRouter>
  );

  expect(
    await screen.findByText(/accepted/i)
  ).toBeInTheDocument();
});

it("renders rejected application badge", async () => {
  getMyApplications.mockResolvedValue([
    {
      id: 1,
      status: "rejected",
      opportunity: {
        role: "Backend",
        description: "",
        project: {
          id: 1,
          title: "AI Builder",
        },
      },
    },
  ]);

  getReceivedInvitations.mockResolvedValue([]);

  render(
    <MemoryRouter>
      <MyApplications />
    </MemoryRouter>
  );

  expect(
    await screen.findByText(/rejected/i)
  ).toBeInTheDocument();
});

it("renders pending application badge", async () => {
  getMyApplications.mockResolvedValue([
    {
      id: 1,
      status: "pending",
      opportunity: {
        role: "Backend",
        description: "",
        project: {
          id: 1,
          title: "AI Builder",
        },
      },
    },
  ]);

  getReceivedInvitations.mockResolvedValue([]);

  render(
    <MemoryRouter>
      <MyApplications />
    </MemoryRouter>
  );

  expect(
    await screen.findByText(/pending/i)
  ).toBeInTheDocument();
});