import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getProjectById } from "../../api/projects";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const data = await getProjectById(id);
      setProject(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-10">
        Project not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
  <div className="bg-white rounded-3xl shadow-lg p-10">

    <h1 className="text-4xl font-bold text-[#2B1B12] mb-4">
      {project.title}
    </h1>

    <p className="text-xl text-[#4A372D] mb-8">
      {project.description}
    </p>

    <div className="grid md:grid-cols-2 gap-6 mb-10">

      <div className="bg-[#FBF8F2] p-5 rounded-xl">
        <p className="text-sm text-[#8C776A]">
          Project Type
        </p>

        <p className="text-2xl font-semibold">
          {project.project_type}
        </p>
      </div>

      <div className="bg-[#FBF8F2] p-5 rounded-xl">
        <p className="text-sm text-[#8C776A]">
          Timeline
        </p>

        <p className="text-2xl font-semibold">
          {project.timeline}
        </p>
      </div>

    </div>

    <div className="flex gap-4 mt-8">

      <button className="bg-[#E35336] text-white px-6 py-3 rounded-xl">
        Apply
      </button>

      <button
  onClick={() => navigate(`/projects/${id}/matches`)}
  className="border border-[#A0522D] text-[#A0522D] px-6 py-3 rounded-xl hover:bg-[#FBF8F2]"
>
  View Matches
</button>

    </div>

  </div>
</div>
  );
}