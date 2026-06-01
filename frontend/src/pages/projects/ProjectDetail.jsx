import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getProjectById } from "../../api/projects";
import { createApplication } from "../../api/applications";
import { getProjectOpportunities } from "../../api/opportunities";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState([]);
  const [applying, setApplying] = useState(false);
  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
  try {
    const data = await getProjectById(id);

    setProject(data);

    const opps =
      await getProjectOpportunities(id);

    setOpportunities(opps);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
const handleApply = async () => {
  try {
    setApplying(true);

    if (opportunities.length === 0) {
      alert("No open opportunities");
      return;
    }

    await createApplication(
      opportunities[0].id
    );

    alert("Application submitted!");
  } catch (error) {
    console.error(error);

    alert(
      error?.response?.data?.detail ||
      "Failed to apply"
    );
  } finally {
    setApplying(false);
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
  <Layout>
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

          <button
            onClick={handleApply}
            disabled={applying}
            className="bg-[#E35336] text-white px-6 py-3 rounded-xl"
          >
            {applying ? "Applying..." : "Apply"}
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
  </Layout>
);
}