import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import { createOpportunity } from "../../api/opportunities";

export default function CreateOpportunity() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    role: "",
    seats: 1,
    status: "open",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "seats"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createOpportunity({
        ...form,
        project_id: Number(id),
      });

      alert("Opportunity created!");

      navigate(`/projects/${id}`);
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.detail ||
        "Failed to create opportunity"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Create Opportunity
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="text"
            name="role"
            placeholder="Role"
            value={form.role}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          <input
            type="number"
            name="seats"
            placeholder="Seats"
            value={form.seats}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            min="1"
            required
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          >
            <option value="open">
              Open
            </option>

            <option value="closed">
              Closed
            </option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#E35336] text-white px-6 py-3 rounded-xl"
          >
            {loading
              ? "Creating..."
              : "Create Opportunity"}
          </button>
        </form>

      </div>
    </Layout>
  );
}