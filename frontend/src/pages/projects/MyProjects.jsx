import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import { getMyProjects } from "../../api/projects";

function MyProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getMyProjects();
      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">
        My Projects
      </h1>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="block border rounded p-4 hover:bg-gray-50"
            >
              <h2 className="font-semibold text-xl">
                {project.title}
              </h2>

              <p>{project.description}</p>

              <p className="text-sm text-gray-500">
                {project.project_type}
              </p>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default MyProjects;