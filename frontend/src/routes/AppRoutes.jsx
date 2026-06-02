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
import OpportunityApplicants
from "../pages/applications/OpportunityApplicants";
import MyProjects from "../pages/projects/MyProjects";
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
  path="/opportunities/:opportunityId/applicants"
  element={
    <ProtectedRoute>
      <OpportunityApplicants />
    </ProtectedRoute>
  }
/>
        <Route
          path="/"
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

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;