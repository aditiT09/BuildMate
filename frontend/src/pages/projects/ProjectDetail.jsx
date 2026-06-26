import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GitHubIcon, PlayIcon, PaletteIcon, FolderIcon, ClipboardIcon, MonitorIcon, LinkIcon, UserXIcon, TimelineIcon, PinIcon, TargetIcon, SparklesIcon, PenIcon, HandshakeIcon, TrashIcon, DoorIcon, UserPlusIcon, PaperclipIcon, MailIcon, LightbulbIcon, CelebrationIcon } from "../../components/common/Icons";

import { getProjectById, deleteProject } from "../../api/projects";
import { createApplication } from "../../api/applications";
import { getProjectOpportunities } from "../../api/opportunities";
import { useAuth } from "../../hooks/useAuth";

import Layout from "../../components/layout/Layout";
import LoadingState from "../../components/ui/LoadingState";
import EmptyState from "../../components/ui/EmptyState";
import { getErrorMessage, validateExternalLink } from "../../utils/validation";

import {
  getProjectLinks,
  createProjectLink,
  deleteProjectLink,
} from "../../api/projectLinks";
import {
  getProjectSkills,
} from "../../api/projectSkills";
import { getSkillGap } from "../../api/matching";

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

const BarChartIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} {...props}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const RESOURCE_ICONS = {
  GitHub: <GitHubIcon size={14} />,
  github: <GitHubIcon size={14} />,
  Demo: <PlayIcon size={14} />,
  Figma: <PaletteIcon size={14} />,
  figma: <PaletteIcon size={14} />,
  "Google Drive": <FolderIcon size={14} />,
  Notion: <ClipboardIcon size={14} />,
  Presentation: <MonitorIcon size={14} />,
  Other: <LinkIcon size={14} />,
  other: <LinkIcon size={14} />,
};

const RESOURCE_TYPES = [
  "GitHub",
  "Demo",
  "Figma",
  "Google Drive",
  "Notion",
  "Presentation",
  "Other",
];

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
  const [applyingId, setApplyingId] = useState(null);

  const [links, setLinks] = useState([]);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [resourceForm, setResourceForm] = useState({
    title: "",
    resource_type: "",
    url: "",
  });
  const [addingResource, setAddingResource] = useState(false);
  const [projectSkills, setProjectSkills] = useState([]);
  const [skillGap, setSkillGap] = useState(null);

  const isOwner = !!(user && project && user.id === project.owner_id);

  const loadProject = useCallback(async () => {
    try {
      const data = await getProjectById(id);
      setProject(data);

      const opps = await getProjectOpportunities(id);
      setOpportunities(opps);

      const projectLinks = await getProjectLinks(id);
      setLinks(projectLinks);

      const skills = await getProjectSkills(id);
      setProjectSkills(skills);

      if (user && user.id) {
        try {
          const gap = await getSkillGap(id, user.id);
          setSkillGap(gap);
        } catch (err) {
          console.error("Failed loading skill gap:", err);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    const init = async () => {
      await loadProject();
    };
    init();
  }, [loadProject]);

  const handleAddResource = async () => {
    try {
      setAddingResource(true);
      const title = resourceForm.title.trim();
      const resourceType = resourceForm.resource_type.trim();

      if (!title) {
        alert("Please add a title for this resource.");
        setAddingResource(false);
        return;
      }

      if (!resourceType) {
        alert("Please choose a resource type.");
        setAddingResource(false);
        return;
      }

      const normalizedUrl = validateExternalLink(resourceForm.url);
      if (!normalizedUrl) {
        alert("Please enter a valid URL (e.g., https://github.com/user or github.com)");
        setAddingResource(false);
        return;
      }
      const payload = {
        title,
        resource_type: resourceType,
        url: normalizedUrl,
      };
      const created = await createProjectLink(id, payload);
      setLinks((prev) => [...prev, created]);
      setResourceForm({ title: "", resource_type: "", url: "" });
      setShowResourceForm(false);
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error?.response?.data?.detail) || "Failed to add resource");
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

  const handleApply = async (opportunityId) => {
    try {
      setApplyingId(opportunityId);
      await createApplication(opportunityId);
      alert("Application submitted!");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "Failed to apply");
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingState message="loading the goods..." />
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <EmptyState
          icon={<UserXIcon size={40} color={C.muted} />}
          headline="nothing here"
          sub="this project doesn't exist (or got deleted)"
          cta="Back to projects"
          href="/my-projects"
        />
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
                <TimelineIcon size={14} color="currentColor" />
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
            <div style={{
              position: "absolute", top: -14, left: 24,
              color: C.brand, transform: `rotate(${tilt(2)}deg)`,
              display: "flex",
            }}><PinIcon size={24} color="currentColor" /></div>
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
              {project.description || "no description yet — owner's keeping it mysterious"}
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
                margin: "0 0 14px",
              }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <TargetIcon size={14} color={C.brand} /> skills they're looking for
                </span>
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

          {/* SKILL GAP ANALYSIS */}
          {!isOwner && skillGap && (
            <div className="pd-fade" style={{
              background: C.surface,
              border: `1.5px solid ${C.border}`,
              borderRadius: 22,
              padding: "26px 28px",
              marginBottom: 28,
              position: "relative",
              transform: `rotate(${tilt(4)}deg)`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <p style={{
                  fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 800,
                  color: C.brand, textTransform: "uppercase", letterSpacing: "0.14em",
                  margin: 0,
                }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <BarChartIcon size={14} color={C.brand} /> your matching stats
                  </span>
                </p>
                <span style={{
                  fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 15,
                  color: skillGap.match_percentage >= 70 ? "#2E7D32" : C.brand,
                }}>
                  {skillGap.match_percentage}% overlap
                </span>
              </div>

              {/* Progress bar */}
              <div style={{
                width: "100%", background: C.sand, borderRadius: 999,
                height: 8, overflow: "hidden", marginBottom: 20,
              }}>
                <div style={{
                  height: "100%", borderRadius: 999,
                  width: `${skillGap.match_percentage}%`,
                  background: skillGap.match_percentage >= 70 ? "#2E7D32" : C.brand,
                  transition: "width 0.8s ease",
                }} />
              </div>

              {/* Recommendations */}
              {skillGap.recommendations && skillGap.recommendations.length > 0 ? (
                <div>
                  <p style={{
                    fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 700,
                    color: C.dark, marginBottom: 8,
                  }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <LightbulbIcon size={14} color={C.brand} /> priority gaps to learn:
                    </span>
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {skillGap.recommendations.map((rec) => (
                      <div key={rec.skill_name} style={{
                        background: C.bg, border: `1.5px solid ${C.border}`,
                        borderRadius: 14, padding: "10px 14px",
                        display: "flex", alignItems: "flex-start", gap: 10,
                      }}>
                        <TargetIcon size={16} color={C.brand} />
                        <div>
                          <p style={{ fontWeight: 700, fontSize: 13, color: C.dark, margin: 0 }}>
                            {rec.skill_name}
                          </p>
                          <p style={{ fontSize: 11, color: C.muted, margin: "2px 0 0" }}>
                            {rec.reason}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p style={{
                  fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "#2E7D32",
                  margin: 0, fontStyle: "italic",
                }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#2E7D32" }}>
                    <CelebrationIcon size={14} color="currentColor" /> you have all the required skills for this project! You're ready to ship.
                  </span>
                </p>
              )}
            </div>
          )}

          {/* ACTION ROW — owner buttons */}
          {isOwner && (
            <div className="pd-fade" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
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
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <SparklesIcon size={14} color="currentColor" /> open a role
                </span>
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
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <PenIcon size={14} color="currentColor" /> edit
                </span>
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
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <HandshakeIcon size={14} color="currentColor" /> matches
                </span>
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
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  delete <TrashIcon size={14} color="currentColor" />
                </span>
              </button>
            </div>
          )}

          {/* VISITOR: OPEN ROLES */}
          {!isOwner && opportunities.length > 0 && (
            <div className="pd-fade" style={{ marginBottom: 36 }}>
              <h2 style={{
                fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 22,
                color: C.dark, marginBottom: 16,
              }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <DoorIcon size={20} color={C.dark} /> open roles
                </span>
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {opportunities.map((opportunity) => (
                  <div
                    key={opportunity.id}
                    style={{
                      background: C.surface, border: `1.5px solid ${C.border}`,
                      borderRadius: 18, padding: "18px 22px",
                      display: "flex", justifyContent: "space-between",
                      alignItems: "center", flexWrap: "wrap", gap: 12,
                    }}
                  >
                    <div>
                      <p style={{
                        fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 16,
                        color: C.dark, margin: 0,
                      }}>
                        {opportunity.role}
                      </p>
                      {opportunity.seats != null && (
                        <p style={{
                          fontFamily: '"DM Sans", sans-serif', fontSize: 12,
                          color: C.muted, margin: "3px 0 0",
                        }}>
                          {opportunity.seats} seat{opportunity.seats !== 1 ? "s" : ""}
                        </p>
                      )}
                      {opportunity.skills && opportunity.skills.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                          {opportunity.skills.map((s) => (
                            <span
                              key={s.id}
                              style={{
                                background: `${C.brand}12`,
                                color: C.brand,
                                border: `1px solid ${C.brand}20`,
                                borderRadius: 999,
                                padding: "2px 8px",
                                fontFamily: '"DM Sans", sans-serif',
                                fontWeight: 700,
                                fontSize: 11,
                              }}
                            >
                              {s.skill.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      className="pd-btn-prime"
                      onClick={() => handleApply(opportunity.id)}
                      disabled={applyingId === opportunity.id}
                      style={{
                        background: C.brand, color: "white", border: "none",
                        borderRadius: 999, padding: "10px 22px",
                        fontFamily: '"DM Sans", sans-serif', fontWeight: 800, fontSize: 13,
                        cursor: applyingId === opportunity.id ? "wait" : "pointer",
                        transition: "all .18s",
                        opacity: applyingId === opportunity.id ? 0.7 : 1,
                      }}
                    >
                      {applyingId === opportunity.id ? "sending..." : (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <UserPlusIcon size={13} color="currentColor" /> apply
                        </span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VISITOR: no open roles */}
          {!isOwner && opportunities.length === 0 && (
            <div className="pd-fade" style={{
              marginBottom: 36,
              border: `1.5px dashed ${C.border}`, borderRadius: 18, padding: "26px 20px",
              textAlign: "center", fontFamily: '"DM Sans", sans-serif', color: C.muted, fontSize: 14,
            }}>
              no open roles right now — check back later
            </div>
          )}

          {/* RESOURCES */}
          <div className="pd-fade" style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{
                fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 22,
                color: C.dark, margin: 0,
              }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <PaperclipIcon size={20} color={C.dark} /> stuff you'll need
                </span>
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
                  {RESOURCE_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
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
                empty board so far — nothing pinned yet
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
                      <span style={{ display: "inline-flex", alignItems: "center" }}>
                        {RESOURCE_ICONS[link.resource_type] || <LinkIcon size={16} />}
                      </span>
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
                        href={validateExternalLink(link.url) || "#"} target="_blank" rel="noreferrer"
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

          {/* OWNER: OPEN ROLES / APPLICANTS */}
          {isOwner && opportunities.length > 0 && (
            <div className="pd-fade" style={{ marginTop: 8 }}>
              <h2 style={{
                fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 22,
                color: C.dark, marginBottom: 16,
              }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <MailIcon size={20} color={C.dark} /> who's knocking
                </span>
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {opportunities.map((opportunity) => (
                  <div
                    key={opportunity.id}
                    style={{
                      background: C.surface, border: `1.5px solid ${C.border}`,
                      borderRadius: 16, padding: "20px 22px",
                      display: "flex", flexDirection: "column", gap: 14,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
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
                        {opportunity.skills && opportunity.skills.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                            {opportunity.skills.map((s) => (
                              <span
                                key={s.id}
                                style={{
                                  background: `${C.brand}12`,
                                  color: C.brand,
                                  border: `1px solid ${C.brand}20`,
                                  borderRadius: 999,
                                  padding: "2px 8px",
                                  fontFamily: '"DM Sans", sans-serif',
                                  fontWeight: 700,
                                  fontSize: 11,
                                }}
                              >
                                {s.skill.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => navigate(`/opportunities/${opportunity.id}/edit`)}
                          style={{
                            background: "transparent", color: C.dark2, border: `1.5px solid ${C.border}`,
                            borderRadius: 999, padding: "8px 18px",
                            fontFamily: '"DM Sans", sans-serif', fontWeight: 800, fontSize: 13,
                            cursor: "pointer", transition: "all .15s ease",
                          }}
                        >
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <PenIcon size={12} color="currentColor" /> edit
                          </span>
                        </button>
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
                    </div>

                    {/* Invite Banner */}
                    <div
                      onClick={() => navigate(`/opportunities/${opportunity.id}/invite`)}
                      style={{
                        background: `${C.orange}14`,
                        border: `1.5px dashed ${C.orange}60`,
                        borderRadius: 14,
                        padding: "12px 16px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: 13,
                        fontWeight: 700,
                        color: C.dark2,
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <LightbulbIcon size={14} color={C.brand} /> You can also invite builders to apply for this role
                      </span>
                      <span style={{ color: C.brand }}>invite builders →</span>
                    </div>
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
