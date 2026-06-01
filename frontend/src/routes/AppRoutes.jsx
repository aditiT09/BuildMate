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
  path="/create-project"
  element={<CreateProject />}
/>
        <Route
  path="/applications"
  element={<MyApplications />}
/>
        <Route
  path="/projects/:id/matches"
  element={
    <ProtectedRoute>
      <MatchResults />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;