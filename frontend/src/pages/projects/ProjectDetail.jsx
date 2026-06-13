import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getProjectById, deleteProject } from "../../api/projects";
import { createApplication } from "../../api/applications";
import { getProjectOpportunities } from "../../api/opportunities";
import { useAuth } from "../../context/AuthContext";

import Layout from "../../components/layout/Layout";
import {
  getProjectLinks,
  createProjectLink,
  deleteProjectLink,
} from "../../api/projectLinks";
import {
  getProjectSkills,
} from "../../api/projectSkills";

const C = {
  brand:   "#E35336",
  brandDk: "#B8391F",
  orange:  "#F4A460",
  dark:    "#2B1B12",
  dark2:   "#4A372D",
  muted:   "#8C776A",
  border:  "#E9DDD0",
  bg:      "#FFF8F0",
  surface: "#FDFBF7",
  sand:    "#F5EDE0",
};

const RESOURCE_ICONS = {
  GitHub: "🐙",
  Demo: "🎬",
  Figma: "🎨",
  "Google Drive": "📁",
  Notion: "🗒️",
  Presentation: "📽️",
  Other: "🔗",
};

const tilt = (n) => {
  const seq = [-1.6, 1.2, -0.8, 1.8, -1.2, 0.9];
  return seq[n % seq.length];
};

const STYLES = `
  @keyframes floatIn { from { opacity:0; transform: translateY(10px) } to { opacity:1; transform: translateY(0) } }
  @keyframes wiggle { 0%,100% { transform: rotate(0deg) } 50% { transform: rotate(2deg) } }
  .pd-fade { animation: floatIn .35s ease both; }
  .pd-tape::before {
    content: "";
    position: absolute;
    top: -10px; left: 50%;
    transform: translateX(-50%) rotate(-3deg);
    width: 64px; height: 22px;
    background: repeating-linear-gradient(135deg, #F4A460 0 6px, #EDD5B8 6px 12px);
    opacity: .85;
    border: 1px solid rgba(43,27,18,.08);
  }
  .pd-link:hover { transform: translateX(3px); }
  .pd-link { transition: transform .15s ease; }
  .pd-btn-prime:hover { background:${C.brandDk}; transform: translateY(-2px); }
  .pd-btn-ghost:hover { background:${C.dark}; color:${C.orange}; border-color:${C.dark}; }
  .pd-chip:hover { transform: rotate(0deg) scale(1.04); }
  .pd-res-card:hover { transform: translateY(-3px) rotate(0deg) !important; box-shadow: 0 10px 28px rgba(43,27,18,.10) !important; }
  .pd-skill-chip { transition: transform .15s ease, box-shadow .15s ease; }
  .pd-skill-chip:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(227,83,54,0.15); }
`;

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

  const isOwner = !!(user && project && user.id === project.owner_id);

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
      const skills =
await getProjectSkills(id);

setProjectSkills(skills);
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
      setResourceForm({ title: "", resource_type: "", url: "" });
      setShowResourceForm(false);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "Failed to add resource");
    } finally {
      setAddingResource(false);
    }
  };

  const handleDeleteResource = async (linkId) => {
    if (!window.confirm("Delete this resource?")) return;
    try {
      await deleteProjectLink(id, linkId);
      setLinks((prev) => prev.filter((link) => link.id !== linkId));
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "Failed to delete resource");
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      alert("Project deleted.");
      navigate("/my-projects");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "Failed to delete project.");
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
      alert(error?.response?.data?.detail || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };
  const [projectSkills, setProjectSkills] =
  useState([]);

  if (loading) {
    return (
      <Layout>
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            fontFamily: '"Syne", sans-serif', fontSize: 14, fontWeight: 700,
            color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{
              width: 16, height: 16, borderRadius: "50%",
              border: `2px solid ${C.border}`, borderTopColor: C.brand,
              animation: "spin 0.8s linear infinite",
            }} />
            loading the goods...
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div style={{
          minHeight: "60vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 8,
          fontFamily: '"DM Sans", sans-serif', color: C.dark2,
        }}>
          <span style={{ fontSize: 40 }}>🫥</span>
          <p style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 20, color: C.dark }}>
            nothing here
          </p>
          <p style={{ fontSize: 13, color: C.muted }}>this project doesn't exist (or got deleted)</p>
        </div>
      </Layout>
    );
  }

 

  return (
    <Layout>
      <style>{STYLES}</style>
      <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 80 }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "36px 20px 0" }}>

          {/* breadcrumb / back */}
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 700,
              color: C.muted, marginBottom: 18, padding: 0,
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            ← back
          </button>

          {/* HERO BLOCK */}
          <div className="pd-fade pd-tape" style={{
            position: "relative",
            background: C.dark,
            color: C.bg,
            borderRadius: 28,
            padding: "44px 36px",
            marginBottom: 28,
            boxShadow: "0 14px 40px rgba(43,27,18,0.18)",
            transform: `rotate(${tilt(0)}deg)`,
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: C.orange, color: C.dark,
              padding: "4px 12px", borderRadius: 999,
              fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 800,
              letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: 18,
            }}>
              {project.project_type || "project"}
            </div>

            <h1 style={{
              fontFamily: '"Syne", sans-serif', fontWeight: 800,
              fontSize: "clamp(32px, 6vw, 52px)", lineHeight: 1.05,
              letterSpacing: "-0.02em", margin: 0,
              wordBreak: "break-word",
            }}>
              {project.title}
            </h1>

            {/* FIX: differentiated label for owner vs visitor */}
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 10,
              marginTop: 22, alignItems: "center",
            }}>
              <span style={{
                fontFamily: '"DM Sans", sans-serif', fontSize: 13,
                color: "rgba(255,248,240,0.6)",
              }}>
                {isOwner ? "your project" : "cooked up by"}
              </span>
              <button
                type="button"
                onClick={() => navigate(`/profile/${project.owner_id}`)}
                style={{
                  background: "rgba(244,164,96,0.16)", border: `1px solid rgba(244,164,96,0.35)`,
                  color: C.orange, borderRadius: 999, padding: "5px 14px",
                  fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {isOwner ? "my profile →" : "view creator profile →"}
              </button>
            </div>

            {project.timeline && (
              <div style={{
                marginTop: 26, display: "flex", alignItems: "center", gap: 10,
                fontFamily: '"DM Sans", sans-serif', fontSize: 13,
                color: "rgba(255,248,240,0.75)",
              }}>
                <span style={{ fontSize: 16 }}>⏳</span>
                <span>{project.timeline}</span>
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="pd-fade" style={{
            background: C.surface,
            border: `1.5px solid ${C.border}`,
            borderRadius: 22,
            padding: "28px 30px",
            marginBottom: 28,
            position: "relative",
            transform: `rotate(${tilt(1)}deg)`,
          }}>
            <span style={{
              position: "absolute", top: -14, left: 24,
              fontSize: 28, transform: `rotate(${tilt(2)}deg)`,
            }}>📌</span>
            <p style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 800,
              color: C.muted, textTransform: "uppercase", letterSpacing: "0.14em",
              marginBottom: 12,
            }}>
              the lowdown
            </p>
            <p style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: 16, lineHeight: 1.75,
              color: C.dark2, margin: 0, whiteSpace: "pre-wrap",
            }}>
              {project.description || "no description yet — owner's keeping it mysterious 👀"}
            </p>
          </div>

          {/* REQUIRED SKILLS */}
          {projectSkills.length > 0 && (
            <div className="pd-fade" style={{
              background: C.surface,
              border: `1.5px solid ${C.border}`,
              borderRadius: 22,
              padding: "24px 28px",
              marginBottom: 28,
              position: "relative",
              transform: `rotate(${tilt(3)}deg)`,
            }}>
              <p style={{
                fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 800,
                color: C.muted, textTransform: "uppercase", letterSpacing: "0.14em",
                marginBottom: 14, margin: "0 0 14px",
              }}>
                🎯 skills they're looking for
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {projectSkills.map((skill) => (
                  <span
                    key={skill.id ?? skill.name}
                    className="pd-skill-chip"
                    style={{
                      background: `${C.brand}12`,
                      color: C.brand,
                      border: `1.5px solid ${C.brand}30`,
                      borderRadius: 999,
                      padding: "6px 14px",
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 700,
                      fontSize: 13,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span style={{ fontSize: 11, opacity: 0.7 }}>●</span>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ACTION ROW */}
          <div className="pd-fade" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
            {isOwner ? (
              <>
                <button
                  className="pd-btn-prime"
                  onClick={() => navigate(`/projects/${id}/create-opportunity`)}
                  style={{
                    background: C.brand, color: "white", border: "none",
                    borderRadius: 999, padding: "13px 24px",
                    fontFamily: '"DM Sans", sans-serif', fontWeight: 800, fontSize: 14,
                    cursor: "pointer", transition: "all .18s",
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  ✨ open a role
                </button>
                <button
                  className="pd-btn-ghost"
                  onClick={() => navigate(`/projects/${id}/edit`)}
                  style={{
                    background: "transparent", color: C.dark2, border: `1.5px solid ${C.border}`,
                    borderRadius: 999, padding: "13px 24px",
                    fontFamily: '"DM Sans", sans-serif', fontWeight: 800, fontSize: 14,
                    cursor: "pointer", transition: "all .18s",
                  }}
                >
                  ✏️ edit
                </button>
                <button
                  className="pd-btn-ghost"
                  onClick={() => navigate(`/projects/${id}/matches`)}
                  style={{
                    background: "transparent", color: C.dark2, border: `1.5px solid ${C.border}`,
                    borderRadius: 999, padding: "13px 24px",
                    fontFamily: '"DM Sans", sans-serif', fontWeight: 800, fontSize: 14,
                    cursor: "pointer", transition: "all .18s",
                  }}
                >
                  🤝 matches
                </button>
                <button
                  onClick={handleDeleteProject}
                  style={{
                    background: "transparent", color: C.brand, border: `1.5px solid ${C.brand}33`,
                    borderRadius: 999, padding: "13px 24px",
                    fontFamily: '"DM Sans", sans-serif', fontWeight: 800, fontSize: 14,
                    cursor: "pointer", marginLeft: "auto",
                  }}
                >
                  delete 🗑️
                </button>
              </>
            ) : (
              // FIX: removed "see who fits" button — matches are owner-only
              <button
                className="pd-btn-prime"
                onClick={handleApply}
                disabled={applying}
                style={{
                  background: C.brand, color: "white", border: "none",
                  borderRadius: 999, padding: "14px 28px",
                  fontFamily: '"DM Sans", sans-serif', fontWeight: 800, fontSize: 15,
                  cursor: applying ? "wait" : "pointer", transition: "all .18s",
                  opacity: applying ? 0.7 : 1,
                }}
              >
                {applying ? "sending..." : "🙋 i'm in, let me apply"}
              </button>
            )}
          </div>

          {/* RESOURCES */}
          <div className="pd-fade" style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{
                fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 22,
                color: C.dark, margin: 0,
              }}>
                🧷 stuff you'll need
              </h2>
              {isOwner && (
                <button
                  onClick={() => setShowResourceForm((s) => !s)}
                  style={{
                    background: showResourceForm ? C.dark : C.sand,
                    color: showResourceForm ? C.orange : C.dark,
                    border: "none", borderRadius: 999, padding: "8px 16px",
                    fontFamily: '"DM Sans", sans-serif', fontWeight: 800, fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {showResourceForm ? "nvm, close" : "+ drop a link"}
                </button>
              )}
            </div>

            {showResourceForm && (
              <div className="pd-fade" style={{
                background: C.surface, border: `1.5px dashed ${C.border}`,
                borderRadius: 18, padding: 20, marginBottom: 16,
                display: "flex", flexDirection: "column", gap: 10,
              }}>
                <input
                  type="text"
                  placeholder="what is it called?"
                  value={resourceForm.title}
                  onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                  style={{
                    border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "10px 14px",
                    fontFamily: '"DM Sans", sans-serif', fontSize: 14, background: C.bg, color: C.dark,
                  }}
                />
                <select
                  value={resourceForm.resource_type}
                  onChange={(e) => setResourceForm({ ...resourceForm, resource_type: e.target.value })}
                  style={{
                    border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "10px 14px",
                    fontFamily: '"DM Sans", sans-serif', fontSize: 14, background: C.bg, color: C.dark,
                  }}
                >
                  <option value="">type?</option>
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
                  placeholder="paste the link"
                  value={resourceForm.url}
                  onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })}
                  style={{
                    border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "10px 14px",
                    fontFamily: '"DM Sans", sans-serif', fontSize: 14, background: C.bg, color: C.dark,
                  }}
                />
                <button
                  disabled={addingResource}
                  onClick={handleAddResource}
                  style={{
                    alignSelf: "flex-start", background: C.brand, color: "white", border: "none",
                    borderRadius: 999, padding: "10px 22px",
                    fontFamily: '"DM Sans", sans-serif', fontWeight: 800, fontSize: 13,
                    cursor: addingResource ? "wait" : "pointer", opacity: addingResource ? 0.7 : 1,
                  }}
                >
                  {addingResource ? "adding..." : "pin it"}
                </button>
              </div>
            )}

            {links.length === 0 ? (
              <div style={{
                border: `1.5px dashed ${C.border}`, borderRadius: 18, padding: "26px 20px",
                textAlign: "center", fontFamily: '"DM Sans", sans-serif', color: C.muted, fontSize: 14,
              }}>
                empty board so far — nothing pinned yet 🕸️
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
                {links.map((link, i) => (
                  <div
                    key={link.id}
                    className="pd-res-card"
                    style={{
                      background: C.surface, border: `1.5px solid ${C.border}`,
                      borderRadius: 18, padding: "16px 18px",
                      transform: `rotate(${tilt(i)}deg)`,
                      transition: "all .18s ease",
                      display: "flex", flexDirection: "column", gap: 10,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 20 }}>
                        {RESOURCE_ICONS[link.resource_type] || "🔗"}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <p style={{
                          fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 14,
                          color: C.dark, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {link.title}
                        </p>
                        <p style={{
                          fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: C.muted,
                          margin: 0, textTransform: "uppercase", letterSpacing: "0.06em",
                        }}>
                          {link.resource_type}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <a
                        href={link.url} target="_blank" rel="noreferrer"
                        className="pd-link"
                        style={{
                          fontFamily: '"DM Sans", sans-serif', fontWeight: 800, fontSize: 13,
                          color: C.brand, textDecoration: "none",
                        }}
                      >
                        open →
                      </a>
                      {isOwner && (
                        <button
                          onClick={() => handleDeleteResource(link.id)}
                          style={{
                            background: "none", border: "none", cursor: "pointer",
                            fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 700,
                            color: C.muted,
                          }}
                        >
                          remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* OWNER: OPEN ROLES */}
          {isOwner && opportunities.length > 0 && (
            <div className="pd-fade" style={{ marginTop: 8 }}>
              <h2 style={{
                fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 22,
                color: C.dark, marginBottom: 16,
              }}>
                📬 who's knocking
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {opportunities.map((opportunity) => (
                  <div
                    key={opportunity.id}
                    style={{
                      background: C.surface, border: `1.5px solid ${C.border}`,
                      borderRadius: 16, padding: "16px 20px",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      flexWrap: "wrap", gap: 10,
                    }}
                  >
                    <div>
                      <p style={{
                        fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 16,
                        color: C.dark, margin: 0,
                      }}>
                        {opportunity.role}
                      </p>
                      {(opportunity.seats != null || opportunity.status) && (
                        <p style={{
                          fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: C.muted, margin: "2px 0 0",
                        }}>
                          {opportunity.seats != null ? `${opportunity.seats} seat${opportunity.seats !== 1 ? "s" : ""}` : ""}
                          {opportunity.seats != null && opportunity.status ? " · " : ""}
                          {opportunity.status}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/opportunities/${opportunity.id}/applicants`)}
                      style={{
                        background: C.dark, color: C.orange, border: "none",
                        borderRadius: 999, padding: "9px 18px",
                        fontFamily: '"DM Sans", sans-serif', fontWeight: 800, fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      view applicants
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