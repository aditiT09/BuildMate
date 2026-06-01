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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          Create Project
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <textarea
            name="description"
            placeholder="Project Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            rows={5}
            required
          />

          <input
            type="text"
            name="timeline"
            placeholder="Timeline (e.g. 8 weeks)"
            value={form.timeline}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="text"
            name="project_type"
            placeholder="Project Type (Web App, AI, Mobile App...)"
            value={form.project_type}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-[#E35336] text-white px-6 py-3 rounded-xl"
          >
            {loading
              ? "Creating..."
              : "Create Project"}
          </button>
        </form>
      </div>
    </Layout>
  );
}