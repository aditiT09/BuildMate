import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";

import ProtectedRoute from "../components/layout/ProtectedRoute";

import ProjectSwipe from "../pages/discover/ProjectSwipe";
import ProjectDetail from "../pages/projects/ProjectDetail";
import MatchResults from "../pages/matching/MatchResults";
import MyApplications from "../pages/applications/MyApplications";
import CreateProject from "../pages/projects/CreateProject";
import CreateOpportunity from "../pages/opportunities/CreateOpportunity";
import InviteBuilders from "../pages/opportunities/InviteBuilders";
import OpportunityApplicants
from "../pages/applications/OpportunityApplicants";
import MyProjects from "../pages/projects/MyProjects";
import LandingPage from "../pages/landingpage/LandingPage";
import Profile from "../pages/profile/Profile";
import PublicProfile from
"../pages/profile/PublicProfile";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<Login />}

        />
      

        <Route
          path="/register"
          element={<Register />}
        />
    <Route
  path="/create-project"
  element={
    <ProtectedRoute>
      <CreateProject />
    </ProtectedRoute>
  }
/>
<Route
  path="/applications"
  element={
    <ProtectedRoute>
      <MyApplications />
    </ProtectedRoute>
  }
/>
<Route
  path="/projects/:id/create-opportunity"
  element={
    <ProtectedRoute>
      <CreateOpportunity />
    </ProtectedRoute>
  }
/>
<Route
  path="/opportunities/:opportunityId/edit"
  element={
    <ProtectedRoute>
      <CreateOpportunity />
    </ProtectedRoute>
  }
/>
<Route
  path="/opportunities/:opportunityId/invite"
  element={
    <ProtectedRoute>
      <InviteBuilders />
    </ProtectedRoute>
  }
/>
<Route
  path="/opportunities/:opportunityId/applicants"
  element={
    <ProtectedRoute>
      <OpportunityApplicants />
    </ProtectedRoute>
  }
/>
       <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

        <Route
          path="/discover"
          element={
            <ProtectedRoute>
              <ProjectSwipe />
            </ProtectedRoute>
          }
        />
        <Route
  path="/projects/:id"
  element={
    <ProtectedRoute>
      <ProjectDetail />
    </ProtectedRoute>
  }
/>
<Route
  path="/projects/:id/edit"
  element={
    <ProtectedRoute>
      <CreateProject />
    </ProtectedRoute>
  }
/>

   <Route
  path="/profile/:userId"
  element={
    <ProtectedRoute>
      <PublicProfile />
    </ProtectedRoute>
  }
/>
 
        <Route
  path="/projects/:id/matches"
  element={
    <ProtectedRoute>
      <MatchResults />
    </ProtectedRoute>
  }
/>


<Route
  path="/my-projects"
  element={
    <ProtectedRoute>
      <MyProjects />
    </ProtectedRoute>
  }
/>
<Route
  path="/"
  element={<LandingPage />}
/>
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;