import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import OpportunityApplicants from "./OpportunityApplicants";
import userEvent from "@testing-library/user-event";

import {
  getOpportunityApplications,
  acceptApplication,
  rejectApplication,
} from "../../api/applications";


// --------------------
// Mocks
// --------------------

vi.mock("../../components/layout/Layout", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock("../../components/ui/LoadingState", () => ({
  default: ({ message }) => <div>{message}</div>,
}));

vi.mock("../../components/ui/EmptyState", () => ({
  default: ({ headline, sub }) => (
    <div>
      <h2>{headline}</h2>
      <p>{sub}</p>
    </div>
  ),
}));

vi.mock("../../api/applications", () => ({
  getOpportunityApplications: vi.fn(),
  acceptApplication: vi.fn(),
  rejectApplication: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useParams: () => ({
      opportunityId: "5",
    }),
  };
});

describe("OpportunityApplicants", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state", () => {
    getOpportunityApplications.mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <MemoryRouter>
        <OpportunityApplicants />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/loading applicants/i)
    ).toBeInTheDocument();
  });

  it("shows empty state", async () => {
    getOpportunityApplications.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <OpportunityApplicants />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/no applications yet/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /no builders have applied/i
      )
    ).toBeInTheDocument();
  });

  it("loads applicants", async () => {
    getOpportunityApplications.mockResolvedValue([
      {
        id: 1,
        status: "pending",
        user: {
          id: 7,
          name: "John Doe",
          email: "john@test.com",
          bio: "React Developer",
          activity_score: 90,
          reliability_score: 95,
        },
      },
    ]);

    render(
      <MemoryRouter>
        <OpportunityApplicants />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("John Doe")
    ).toBeInTheDocument();

    expect(
      screen.getByText("john@test.com")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/react developer/i)
    ).toBeInTheDocument();
  });

  it("renders applicant scores", async () => {
    getOpportunityApplications.mockResolvedValue([
      {
        id: 1,
        status: "pending",
        user: {
          id: 7,
          name: "John Doe",
          email: "john@test.com",
          bio: "",
          activity_score: 88,
          reliability_score: 93,
        },
      },
    ]);

    render(
      <MemoryRouter>
        <OpportunityApplicants />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("88")
    ).toBeInTheDocument();

    expect(
      screen.getByText("93")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/activity score/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/reliability score/i)
    ).toBeInTheDocument();
  });
});


it("accepts an application", async () => {
  const user = userEvent.setup();

  getOpportunityApplications.mockResolvedValue([
    {
      id: 1,
      status: "pending",
      user: {
        id: 7,
        name: "John Doe",
        email: "john@test.com",
        bio: "",
        activity_score: 90,
        reliability_score: 95,
      },
    },
  ]);

  acceptApplication.mockResolvedValue({});

  render(
    <MemoryRouter>
      <OpportunityApplicants />
    </MemoryRouter>
  );

  const acceptButton = await screen.findByRole("button", {
    name: /accept/i,
  });

  await user.click(acceptButton);

  expect(acceptApplication).toHaveBeenCalledWith(1);

 const initialCalls = getOpportunityApplications.mock.calls.length;

await user.click(acceptButton);

await waitFor(() => {
  expect(getOpportunityApplications.mock.calls.length).toBeGreaterThan(initialCalls);
});
});

it("rejects an application", async () => {
  const user = userEvent.setup();

  getOpportunityApplications.mockResolvedValue([
    {
      id: 2,
      status: "pending",
      user: {
        id: 9,
        name: "Jane Doe",
        email: "jane@test.com",
        bio: "",
        activity_score: 82,
        reliability_score: 91,
      },
    },
  ]);

  rejectApplication.mockResolvedValue({});

  render(
    <MemoryRouter>
      <OpportunityApplicants />
    </MemoryRouter>
  );

  const rejectButton = await screen.findByRole("button", {
    name: /reject/i,
  });

  // Record the number of fetches before clicking
  const initialCalls = getOpportunityApplications.mock.calls.length;

  await user.click(rejectButton);

  expect(rejectApplication).toHaveBeenCalledWith(2);

  // Just verify that a refresh happened
  await waitFor(() => {
    expect(getOpportunityApplications.mock.calls.length)
      .toBeGreaterThan(initialCalls);
  });
});
it("shows action buttons only for pending applications", async () => {
  getOpportunityApplications.mockResolvedValue([
    {
      id: 1,
      status: "pending",
      user: {
        id: 1,
        name: "John",
        email: "john@test.com",
        bio: "",
        activity_score: 80,
        reliability_score: 90,
      },
    },
  ]);

  render(
    <MemoryRouter>
      <OpportunityApplicants />
    </MemoryRouter>
  );

  expect(
    await screen.findByRole("button", {
      name: /accept/i,
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("button", {
      name: /reject/i,
    })
  ).toBeInTheDocument();
});

it("does not show action buttons for accepted applications", async () => {
  getOpportunityApplications.mockResolvedValue([
    {
      id: 1,
      status: "accepted",
      user: {
        id: 1,
        name: "John",
        email: "john@test.com",
        bio: "",
        activity_score: 80,
        reliability_score: 90,
      },
    },
  ]);

  render(
    <MemoryRouter>
      <OpportunityApplicants />
    </MemoryRouter>
  );

  await screen.findByText(/accepted/i);

  expect(
    screen.queryByRole("button", {
      name: /accept/i,
    })
  ).not.toBeInTheDocument();

  expect(
    screen.queryByRole("button", {
      name: /reject/i,
    })
  ).not.toBeInTheDocument();
});

it("does not show action buttons for rejected applications", async () => {
  getOpportunityApplications.mockResolvedValue([
    {
      id: 1,
      status: "rejected",
      user: {
        id: 1,
        name: "John",
        email: "john@test.com",
        bio: "",
        activity_score: 80,
        reliability_score: 90,
      },
    },
  ]);

  render(
    <MemoryRouter>
      <OpportunityApplicants />
    </MemoryRouter>
  );

  await screen.findByText(/rejected/i);

  expect(
    screen.queryByRole("button", {
      name: /accept/i,
    })
  ).not.toBeInTheDocument();

  expect(
    screen.queryByRole("button", {
      name: /reject/i,
    })
  ).not.toBeInTheDocument();
});

it("renders profile link", async () => {
  getOpportunityApplications.mockResolvedValue([
    {
      id: 1,
      status: "pending",
      user: {
        id: 7,
        name: "John Doe",
        email: "john@test.com",
        bio: "",
        activity_score: 90,
        reliability_score: 95,
      },
    },
  ]);

  render(
    <MemoryRouter>
      <OpportunityApplicants />
    </MemoryRouter>
  );

  const link = await screen.findByRole("link", {
    name: /view full profile/i,
  });

  expect(link).toHaveAttribute(
    "href",
    "/profile/7"
  );
});

it("renders back link", async () => {
  getOpportunityApplications.mockResolvedValue([]);

  render(
    <MemoryRouter>
      <OpportunityApplicants />
    </MemoryRouter>
  );

  const backLink = await screen.findByRole("link", {
    name: /back to incoming/i,
  });

  expect(backLink).toHaveAttribute(
    "href",
    "/incoming"
  );
});

it("shows fallback bio when bio is empty", async () => {
  getOpportunityApplications.mockResolvedValue([
    {
      id: 1,
      status: "pending",
      user: {
        id: 1,
        name: "John",
        email: "john@test.com",
        bio: "",
        activity_score: 80,
        reliability_score: 90,
      },
    },
  ]);

  render(
    <MemoryRouter>
      <OpportunityApplicants />
    </MemoryRouter>
  );

  expect(
    await screen.findByText(/no bio provided/i)
  ).toBeInTheDocument();
});

it("renders applicant status badge", async () => {
  getOpportunityApplications.mockResolvedValue([
    {
      id: 1,
      status: "pending",
      user: {
        id: 1,
        name: "John",
        email: "john@test.com",
        bio: "",
        activity_score: 80,
        reliability_score: 90,
      },
    },
  ]);

  render(
    <MemoryRouter>
      <OpportunityApplicants />
    </MemoryRouter>
  );

  expect(
    await screen.findByText(/pending/i)
  ).toBeInTheDocument();
});