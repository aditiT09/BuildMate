import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import {
  createProject,
  getProjectById,
  updateProject,
} from "../../api/projects";
import { getSkills } from "../../api/userSkills";
import { addProjectSkill } from "../../api/projectSkills";

export default function CreateProject() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    description: "",
    timeline: "",
    project_type: "",
  });

  const [loading, setLoading] = useState(false);

  // State Management
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");

  useEffect(() => {
    loadSkills();

    if (id) {
      loadProject();
    }
    // eslint-disable-next-line
  }, [id]);

  // Clean Readability Helper for API property fallback variations
  const getSkillName = (skill) => skill?.name || skill?.skill_name || "";

  const loadSkills = async () => {
    try {
      const skills = await getSkills();
      setAllSkills(skills);
    } catch (error) {
      console.error(error);
    }
  };

  const loadProject = async () => {
    try {
      const project = await getProjectById(id);

      setForm({
        title: project.title,
        description: project.description,
        timeline: project.timeline,
        project_type: project.project_type,
      });
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "Failed to load project.");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let project;

      if (id) {
        project = await updateProject(id, form);
        alert("Project updated successfully!");
      } else {
        project = await createProject(form);

        // Execute skill associations concurrently instead of sequentially
        if (selectedSkills.length > 0) {
          await Promise.all(
            selectedSkills.map((skill) =>
              addProjectSkill(project.id, skill.id)
            )
          );
        }

        alert("Project created successfully!");
      }

      navigate(`/projects/${project.id}`);
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.detail ||
          `Failed to ${id ? "update" : "create"} project`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-[#24120C] mb-3">
            {id ? "Edit Project" : "Create Project"}
          </h1>

          <p className="text-[#4A372D] text-lg">
            {id
              ? "Refine your idea and keep your team updated."
              : "Publish an idea and find teammates to help build it."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-[#FDFBF8] border border-[#D9D0C8] rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#24120C] mb-6">
              Project Details
            </h2>

            {/* Title */}
            <div className="mb-5">
              <label className="block mb-2 font-medium text-[#24120C]">
                Project Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="AI Resume Builder"
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#D9D0C8] bg-white p-4 focus:outline-none focus:ring-2 focus:ring-[#C4622D] focus:border-[#C4622D] transition"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="block mb-2 font-medium text-[#24120C]">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Tell potential teammates what you're building, why it matters, and what help you're looking for..."
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#D9D0C8] bg-white p-4 min-h-[180px] focus:outline-none focus:ring-2 focus:ring-[#C4622D] focus:border-[#C4622D] transition"
                required
              />
            </div>

            {/* Timeline */}
            <div className="mb-5">
              <label className="block mb-2 font-medium text-[#24120C]">
                Timeline
              </label>
              <input
                type="text"
                name="timeline"
                placeholder="8 weeks"
                value={form.timeline}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#D9D0C8] bg-white p-4 focus:outline-none focus:ring-2 focus:ring-[#C4622D] focus:border-[#C4622D] transition"
                required
              />
            </div>

            {/* Project Type */}
            <div className="mb-8">
              <label className="block mb-2 font-medium text-[#24120C]">
                Project Type
              </label>
              <input
                type="text"
                name="project_type"
                placeholder="Web App, AI, Mobile App..."
                value={form.project_type}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#D9D0C8] bg-white p-4 focus:outline-none focus:ring-2 focus:ring-[#C4622D] focus:border-[#C4622D] transition"
                required
              />
            </div>

            {/* Required Skills Section */}
            <div className="mb-8 border-t border-[#D9D0C8] pt-8">
              <label className="block mb-2 font-medium text-[#24120C]">
                Required Skills
              </label>

              <p className="text-sm text-[#4A372D] mb-3">
                Add project skills to improve teammate recommendations.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full sm:flex-1 rounded-xl border border-[#D9D0C8] bg-white p-4"
                >
                  <option value="">Select Skill</option>
                  {allSkills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {getSkillName(skill)}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="px-6 py-4 bg-[#C4622D] text-white hover:bg-[#8B3A1A] rounded-xl font-semibold transition"
                  onClick={() => {
                    if (!selectedSkill) return;

                    const skill = allSkills.find(
                      (s) => s.id === Number(selectedSkill)
                    );

                    if (skill) {
                      // Fix: Functional update to prevent closure stale state bugs
                      setSelectedSkills((prev) => {
                        if (!prev.some((s) => s.id === skill.id)) {
                          return [...prev, skill];
                        }
                        return prev;
                      });
                    }

                    setSelectedSkill("");
                  }}
                >
                  Add Skill
                </button>
              </div>

              {/* Tag style dynamic layout representation */}
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex justify-between items-center bg-[#F4F1EE] border border-[#D9D0C8] rounded-full px-4 py-2"
                  >
                    <span className="text-sm font-medium text-[#24120C] mr-2">
                      {getSkillName(skill)}
                    </span>

                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800 text-xs font-bold pl-1"
                      // Fix: Functional update state filter wrapper
                      onClick={() =>
                        setSelectedSkills((prev) =>
                          prev.filter((s) => s.id !== skill.id)
                        )
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#C4622D] hover:bg-[#8B3A1A] text-white px-8 py-4 rounded-2xl text-lg font-semibold transition disabled:opacity-50"
            >
              {loading
                ? id
                  ? "Saving..."
                  : "Publishing..."
                : id
                ? "Save Changes"
                : "+ Publish Project"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}