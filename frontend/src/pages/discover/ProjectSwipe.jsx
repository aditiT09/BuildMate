import { useEffect, useState } from "react";
import { getProjects } from "../../api/projects";
import ProjectCard from "../../components/features/ProjectCard";
import Layout from "../../components/layout/Layout";

export default function ProjectSwipe() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
 const filteredProjects = projects.filter((project) => {
  const query = search.toLowerCase();

  return (
    project.title?.toLowerCase().includes(query) ||
    project.description?.toLowerCase().includes(query) ||
    project.project_type?.toLowerCase().includes(query)
  );
});

  if (loading) {
    return (
      <Layout>
        <div className="p-10 text-center">
          Loading Projects...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#F5F5DC]">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold text-[#2B1B12] mb-2">
            Discover Projects
          </h1>

          <p className="text-[#4A372D] mb-8">
            Find exciting student projects and join teams.
          </p>
          <div className="mb-8">
  <input
    type="text"
    placeholder="Search projects..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="
      w-full
      p-4
      rounded-xl
      border
      border-gray-300
      focus:outline-none
      focus:ring-2
      focus:ring-orange-400
    "
  />
</div>

          <div className="max-w-4xl mx-auto space-y-6">

  {filteredProjects.length === 0 ? (

    <div className="bg-white rounded-xl p-8 text-center shadow">
      No matching projects found.
    </div>

  ) : (

    filteredProjects.map((project) => (
      <ProjectCard
        key={project.id}
        project={project}
      />
    ))

  )}

          </div>
        </div>
      </div>
    </Layout>
  );
}