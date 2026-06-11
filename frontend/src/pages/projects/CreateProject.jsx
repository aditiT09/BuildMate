import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import { createProject } from "../../api/projects";

export default function CreateProject() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    timeline: "",
    project_type: "",
  });

  const [loading, setLoading] = useState(false);

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

      const project = await createProject(form);

      alert("Project created successfully!");

      navigate(`/projects/${project.id}`);
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.detail ||
          "Failed to create project"
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
            Create Project
          </h1>

          <p className="text-[#4A372D] text-lg">
            Publish an idea and find teammates to help build it.
          </p>
        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
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
                className="
                  w-full
                  rounded-xl
                  border
                  border-[#D9D0C8]
                  bg-white
                  p-4
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#C4622D]
                  focus:border-[#C4622D]
                  transition
                "
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
                className="
                  w-full
                  rounded-xl
                  border
                  border-[#D9D0C8]
                  bg-white
                  p-4
                  min-h-[180px]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#C4622D]
                  focus:border-[#C4622D]
                  transition
                "
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
                className="
                  w-full
                  rounded-xl
                  border
                  border-[#D9D0C8]
                  bg-white
                  p-4
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#C4622D]
                  focus:border-[#C4622D]
                  transition
                "
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
                className="
                  w-full
                  rounded-xl
                  border
                  border-[#D9D0C8]
                  bg-white
                  p-4
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#C4622D]
                  focus:border-[#C4622D]
                  transition
                "
                required
              />
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="
                bg-[#C4622D]
                hover:bg-[#8B3A1A]
                text-white
                px-8
                py-4
                rounded-2xl
                text-lg
                font-semibold
                transition
                disabled:opacity-50
              "
            >
              {loading
                ? "Publishing..."
                : "+ Publish Project"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}