import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getProjectById } from "../../api/projects";
import { createApplication } from "../../api/applications";
import { getProjectOpportunities } from "../../api/opportunities";
import { useAuth } from "../../context/AuthContext";

import Layout from "../../components/layout/Layout";
import {
  getProjectLinks,
  createProjectLink,
  deleteProjectLink,
} from "../../api/projectLinks";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState([]);
  const [applying, setApplying] = useState(false);

  const [links, setLinks] = useState([]);
  const [showResourceForm, setShowResourceForm] = useState(false);

  const [resourceForm, setResourceForm] = useState({
    title: "",
    resource_type: "",
    url: "",
  });

  const [addingResource, setAddingResource] = useState(false);

  const isOwner = user?.id === project?.owner_id;

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const data = await getProjectById(id);
      setProject(data);

      const opps = await getProjectOpportunities(id);
      setOpportunities(opps);
      
      const projectLinks = await getProjectLinks(id);
      setLinks(projectLinks);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddResource = async () => {
    try {
      setAddingResource(true);

      const created = await createProjectLink(id, resourceForm);

      setLinks((prev) => [...prev, created]);

      setResourceForm({
        title: "",
        resource_type: "",
        url: "",
      });

      setShowResourceForm(false);
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.detail || "Failed to add resource"
      );
    } finally {
      setAddingResource(false);
    }
  };

  const handleDeleteResource = async (linkId) => {
    if (!window.confirm("Delete this resource?")) {
      return;
    }

    try {
      await deleteProjectLink(id, linkId);

      setLinks((prev) => prev.filter((link) => link.id !== linkId));
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.detail || "Failed to delete resource"
      );
    }
  };

  const handleApply = async () => {
    try {
      setApplying(true);

      if (opportunities.length === 0) {
        alert("No open opportunities");
        return;
      }

      await createApplication(opportunities[0].id);

      alert("Application submitted!");
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.detail || "Failed to apply"
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-10">Loading project...</div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="p-10">Project not found.</div>
      </Layout>
    );
  }

  console.log("Current User:", user);
  console.log("Project:", project);
  console.log("Project Owner:", project?.owner_id);
  console.log("Is Owner:", isOwner);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-10">
          <h1 className="text-4xl font-bold text-[#2B1B12] mb-4">
            {project.title}
          </h1>

          <p className="text-xl text-[#4A372D] mb-8">
            {project.description}
          </p>
<div className="mb-6">
  <p className="text-sm text-[#8C776A]">
    Created by
  </p>

  <button
    onClick={() =>
      navigate(`/profile/${project.owner_id}`)
    }
    className="text-[#C4622D] font-semibold hover:underline"
  >
    View Creator Profile →
  </button>
</div>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-[#FBF8F2] p-5 rounded-xl">
              <p className="text-sm text-[#8C776A]">Project Type</p>
              <p className="text-2xl font-semibold">
                {project.project_type}
              </p>
            </div>

            <div className="bg-[#FBF8F2] p-5 rounded-xl">
              <p className="text-sm text-[#8C776A]">Timeline</p>
              <p className="text-2xl font-semibold">{project.timeline}</p>
            </div>
          </div>

          {/* Project Resources */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-[#2B1B12] mb-4">
              Project Resources
            </h2>

            {isOwner && (
              <>
                <button
                  type="button"
                  className="mb-4 bg-[#A0522D] text-white px-4 py-2 rounded-xl text-sm font-semibold"
                  onClick={() => setShowResourceForm(!showResourceForm)}
                >
                  {showResourceForm ? "Cancel" : "+ Add Resource"}
                </button>

                {showResourceForm && (
                  <div className="mb-6 p-4 border rounded-xl bg-gray-50 flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="Title"
                      className="border p-2 rounded"
                      value={resourceForm.title}
                      onChange={(e) =>
                        setResourceForm({
                          ...resourceForm,
                          title: e.target.value,
                        })
                      }
                    />

                    <select
                      className="border p-2 rounded"
                      value={resourceForm.resource_type}
                      onChange={(e) =>
                        setResourceForm({
                          ...resourceForm,
                          resource_type: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Type</option>
                      <option value="GitHub">GitHub</option>
                      <option value="Demo">Demo</option>
                      <option value="Figma">Figma</option>
                      <option value="Google Drive">Google Drive</option>
                      <option value="Notion">Notion</option>
                      <option value="Presentation">Presentation</option>
                      <option value="Other">Other</option>
                    </select>

                    <input
                      type="text"
                      placeholder="URL"
                      className="border p-2 rounded"
                      value={resourceForm.url}
                      onChange={(e) =>
                        setResourceForm({
                          ...resourceForm,
                          url: e.target.value,
                        })
                      }
                    />

                    <button
                      type="button"
                      disabled={addingResource}
                      className="bg-green-600 text-white px-4 py-2 rounded font-semibold self-start"
                      onClick={handleAddResource}
                    >
                      {addingResource ? "Adding..." : "Add"}
                    </button>
                  </div>
                )}
              </>
            )}

            {links.length === 0 ? (
              <p className="text-[#8C776A]">No resources added yet.</p>
            ) : (
              <div className="space-y-3">
                {links.map((link) => (
                  <div
                    key={link.id}
                    className="bg-[#FBF8F2] rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{link.title}</p>
                      <p className="text-sm text-[#8C776A]">
                        {link.resource_type}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#C4622D] font-semibold"
                      >
                        Open →
                      </a>
                      
                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => handleDeleteResource(link.id)}
                          className="text-red-600 text-sm font-semibold hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            {isOwner ? (
              <>
                <button
                  onClick={() =>
                    navigate(`/projects/${id}/create-opportunity`)
                  }
                  className="border border-green-600 text-green-600 px-6 py-3 rounded-xl font-semibold"
                >
                  Create Opportunity
                </button>

                <button
                  onClick={() => navigate(`/projects/${id}/matches`)}
                  className="border border-[#A0522D] text-[#A0522D] px-6 py-3 rounded-xl font-semibold"
                >
                  View Matches
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="bg-[#E35336] text-white px-6 py-3 rounded-xl font-semibold"
                >
                  {applying ? "Applying..." : "Apply"}
                </button>

                <button
                  onClick={() => navigate(`/projects/${id}/matches`)}
                  className="border border-[#A0522D] text-[#A0522D] px-6 py-3 rounded-xl font-semibold"
                >
                  View Matches
                </button>
              </>
            )}
          </div>

          {/* Owner-Specific Opportunities List */}
          {isOwner && opportunities.length > 0 && (
            <div className="mt-10 border-t pt-10">
              <h2 className="text-2xl font-bold mb-4">Opportunities</h2>

              <div className="space-y-3">
                {opportunities.map((opportunity) => (
                  <div
                    key={opportunity.id}
                    className="border rounded-xl p-4 flex justify-between items-center"
                  >
                    <h3 className="font-semibold">{opportunity.role}</h3>

                    <button
                      onClick={() =>
                        navigate(
                          `/opportunities/${opportunity.id}/applicants`
                        )
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded font-semibold"
                    >
                      View Applicants
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}