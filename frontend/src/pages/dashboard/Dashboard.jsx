import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyProjects } from "../../api/projects";
import { getMyApplications } from "../../api/applications";
import { getOverview } from "../../api/analytics";

function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [projects, setProjects] = useState([]);
  const [applications, setApplications] =
    useState([]);

  const [overview, setOverview] =
    useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          projectData,
          applicationData,
          overviewData,
        ] = await Promise.all([
          getMyProjects(),
          getMyApplications(),
          getOverview(),
        ]);

        setProjects(projectData);
        setApplications(applicationData);
        setOverview(overviewData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-slate-900">
          Welcome Back
        </h1>

        <p className="text-gray-600 mt-2">
          Your Next Teammate Is One Swipe Away.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-5">

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-sm text-gray-500">
            My Projects
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {projects.length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-sm text-gray-500">
            My Applications
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {applications.length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-sm text-gray-500">
            Platform Projects
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {overview?.total_projects}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-sm text-gray-500">
            Opportunities
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {overview?.total_opportunities}
          </h2>
        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-5">

        <Link
          to="/create-project"
          className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
        >
          <h3 className="font-semibold">
            Create Project
          </h3>

          <p className="text-gray-500 mt-2">
            Start a new collaboration.
          </p>
        </Link>

        <Link
          to="/discover"
          className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
        >
          <h3 className="font-semibold">
            Discover Projects
          </h3>

          <p className="text-gray-500 mt-2">
            Explore active projects.
          </p>
        </Link>

        <Link
          to="/applications"
          className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
        >
          <h3 className="font-semibold">
            My Applications
          </h3>

          <p className="text-gray-500 mt-2">
            Track your applications.
          </p>
        </Link>

      </div>

      <div className="bg-white p-6 rounded-2xl shadow">

        <h2 className="text-xl font-bold mb-4">
          Top Skills On BuildMate
        </h2>

        <div className="flex flex-wrap gap-3">

          {overview?.top_skills?.map(
            (skill) => (
              <span
                key={skill}
                className="px-4 py-2 rounded-full bg-orange-100 text-orange-700"
              >
                {skill}
              </span>
            )
          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;