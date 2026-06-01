import { useEffect, useState } from "react";
import { getProjects } from "../../api/projects";
import ProjectCard from "../../components/features/ProjectCard";

export default function ProjectSwipe() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading Projects...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-[#2B1B12] mb-2">
          Discover Projects
        </h1>

        <p className="text-[#4A372D] mb-8">
          Find exciting student projects and join teams.
        </p>

        <div className="max-w-4xl mx-auto space-y-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>
      </div>
    </div>
  );
}