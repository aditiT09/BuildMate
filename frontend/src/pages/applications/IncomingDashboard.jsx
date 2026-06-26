import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { getMyProjects } from "../../api/projects";
import { getProjectOpportunities } from "../../api/opportunities";
import { getOpportunityApplications } from "../../api/applications";
import { FolderIcon, UsersIcon } from "../../components/common/Icons";

const C = {
  brand:    "#E35336",
  brandDark:"#B8391F",
  orange:   "#F4A460",
  bg:       "#FFF8F0",
  surface:  "#FDFBF7",
  dark:     "#2B1B12",
  dark2:    "#4A372D",
  muted:    "#8C776A",
  border:   "#E9DDD0",
  sand:     "#F5EDE0",
  sandDark: "#EDD5B8",
  cream:    "#FBF5EE",
  accent1:  "#D4A882",
  success:  "#2E7D32",
  warn:     "#D48A2D",
};

const ClockIcon = ({ color = "currentColor", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const STYLES = `
  @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  
  .incoming-col { max-height: calc(100vh - 180px); overflow-y: auto; }
  .incoming-col::-webkit-scrollbar { width: 6px; }
  .incoming-col::-webkit-scrollbar-track { background: transparent; }
  .incoming-col::-webkit-scrollbar-thumb { background: #EDD5B8; border-radius: 4px; }
  
  .proj-card { transition: all 0.2s ease; cursor: pointer; }
  .proj-card:hover { transform: translateY(-2px); border-color: #E35336 !important; }
  
  .opp-count-card { transition: all 0.2s ease; cursor: pointer; }
  .opp-count-card:hover { transform: scale(1.03); background: #EDD5B8 !important; }
`;

export default function IncomingDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [appCounts, setAppCounts] = useState({});
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingOpps, setLoadingOpps] = useState(false);

  // Fetch initial projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const pd = await getMyProjects();
        setProjects(pd);
        if (pd && pd.length > 0) {
          setSelectedProject(pd[0]);
        }
      } catch (err) {
        // Suppressed console.error in production
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  // Fetch opportunities and application counts when selected project changes
  useEffect(() => {
    if (!selectedProject) return;

    const fetchOpps = async () => {
      setLoadingOpps(true);
      try {
        const oppsData = await getProjectOpportunities(selectedProject.id);
        setOpportunities(oppsData);

        // Fetch application counts in parallel
        const counts = {};
        await Promise.all(
          oppsData.map(async (opp) => {
            try {
              const apps = await getOpportunityApplications(opp.id);
              counts[opp.id] = apps.length;
            } catch (err) {
              counts[opp.id] = 0;
            }
          })
        );
        setAppCounts(counts);
      } catch (err) {
        // Suppressed console.error in production
      } finally {
        setLoadingOpps(false);
      }
    };

    fetchOpps();
  }, [selectedProject]);

  return (
    <Layout>
      <div style={{ minHeight: "100vh", background: C.bg, padding: "28px", fontFamily: '"Manrope", sans-serif' }}>
        <style>{STYLES}</style>

        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          {/* Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 28,
            animation: "slideUp 0.5s ease both"
          }}>
            <div>
              <Link to="/dashboard" style={{
                textDecoration: "none", color: C.brand, fontWeight: 700, fontSize: 14,
                display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 8
              }}>
                ← Back to Dashboard
              </Link>
              <h1 style={{
                fontFamily: '"Cormorant Garamond", serif', fontSize: "clamp(32px, 4vw, 44px)",
                fontWeight: 700, color: C.dark, margin: 0
              }}>
                Incoming Applications
              </h1>
              <p style={{ color: C.muted, fontSize: 14, margin: "4px 0 0 0", fontStyle: "italic" }}>
                Select a project on the left to see the roles and applicant counts.
              </p>
            </div>
          </div>

          {loadingProjects ? (
            <div style={{ textAlign: "center", padding: 60, color: C.muted }}>Loading projects...</div>
          ) : projects.length === 0 ? (
            <div style={{
              background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 24,
              padding: 48, textAlign: "center", animation: "slideUp 0.5s ease both"
            }}>
              <FolderIcon color={C.muted} size={48} style={{ margin: "0 auto 16px auto" }} />
              <h3 style={{ fontFamily: '"Poppins", sans-serif', fontSize: 18, color: C.dark, margin: "0 0 8px 0" }}>
                No projects found
              </h3>
              <p style={{ color: C.muted, fontSize: 14, maxWidth: 360, margin: "0 auto 20px auto", lineHeight: 1.5 }}>
                You need to create a project first before you can view incoming applications for open roles.
              </p>
              <Link to="/create-project" style={{ textDecoration: "none" }}>
                <button style={{
                  background: C.brand, color: "white", border: "none", borderRadius: 9999,
                  padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  fontFamily: '"Manrope", sans-serif', transition: "background 0.2s"
                }}>
                  + Create a Project
                </button>
              </Link>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "350px 1fr",
              gap: 28,
              animation: "slideUp 0.5s ease 0.1s both",
              opacity: 0
            }}>
              {/* Left Column: Projects list */}
              <div className="incoming-col" style={{ display: "flex", flexDirection: "column", gap: 16, paddingRight: 8 }}>
                <p style={{
                  fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                  color: C.brand, margin: "0 0 4px 0"
                }}>
                  My Projects ({projects.length})
                </p>
                {projects.map((p) => {
                  const isSelected = selectedProject?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      className="proj-card"
                      onClick={() => setSelectedProject(p)}
                      id={`proj-select-${p.id}`}
                      style={{
                        background: isSelected ? C.sandDark : C.cream,
                        border: `1.5px solid ${isSelected ? C.brand : C.border}`,
                        borderRadius: 16, padding: "20px",
                        boxShadow: isSelected ? `0 6px 18px ${C.brand}15` : "none",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <FolderIcon color={isSelected ? C.brand : C.muted} size={20} />
                        {p.project_type && (
                          <span style={{
                            fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                            color: isSelected ? C.dark : C.brand, background: isSelected ? "rgba(255,255,255,0.4)" : `${C.brand}12`,
                            padding: "2px 8px", borderRadius: 9999
                          }}>
                            {p.project_type}
                          </span>
                        )}
                      </div>
                      <h4 style={{
                        fontFamily: '"Poppins", sans-serif', fontWeight: 700, fontSize: 15,
                        color: C.dark, margin: "0 0 6px 0", lineHeight: 1.3
                      }}>
                        {p.title}
                      </h4>
                      <p style={{
                        fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.4,
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                      }}>
                        {p.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Middle & Right Columns */}
              <div className="incoming-col" style={{ paddingRight: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <p style={{
                    fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                    color: C.brand, margin: 0
                  }}>
                    Opened Roles &amp; Applicants
                  </p>
                </div>

                {loadingOpps ? (
                  <div style={{ textAlign: "center", padding: 40, color: C.muted }}>Loading roles and application counts...</div>
                ) : opportunities.length === 0 ? (
                  <div style={{
                    background: C.cream, border: `1.5px solid ${C.border}`, borderRadius: 20,
                    padding: 40, textAlign: "center"
                  }}>
                    <UsersIcon color={C.muted} size={40} style={{ margin: "0 auto 12px auto" }} />
                    <h4 style={{ fontFamily: '"Poppins", sans-serif', fontSize: 16, color: C.dark, margin: "0 0 6px 0" }}>
                      No roles opened yet
                    </h4>
                    <p style={{ color: C.muted, fontSize: 13, maxWidth: 320, margin: "0 auto 16px auto", lineHeight: 1.4 }}>
                      Create opportunities/roles for this project to start receiving applications.
                    </p>
                    <Link to={`/projects/${selectedProject?.id}/create-opportunity`} style={{ textDecoration: "none" }}>
                      <button style={{
                        background: "transparent", color: C.brand, border: `1.5px solid ${C.brand}`,
                        borderRadius: 9999, padding: "8px 20px", fontSize: 13, fontWeight: 700,
                        cursor: "pointer", fontFamily: '"Manrope", sans-serif', transition: "all 0.2s"
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.brand; e.currentTarget.style.color = "white"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.brand; }}
                      >
                        + Open a Role
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr 0.8fr",
                    gap: 20,
                    alignContent: "start"
                  }}>
                    {opportunities.map((opp) => {
                      const count = appCounts[opp.id] ?? 0;
                      return (
                        <React.Fragment key={opp.id}>
                          {/* Middle Section: Opportunity Details */}
                          <div style={{
                            background: C.cream, border: `1.5px solid ${C.border}`,
                            borderRadius: 16, padding: "20px", display: "flex", flexDirection: "column",
                            justifyContent: "space-between", minHeight: 140
                          }}>
                            <div>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                <h4 style={{
                                  fontFamily: '"Poppins", sans-serif', fontWeight: 700, fontSize: 16,
                                  color: C.dark, margin: 0, lineHeight: 1.3
                                }}>
                                  {opp.role}
                                </h4>
                                <span style={{
                                  fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                                  color: opp.status === "open" ? C.success : C.brand,
                                  background: opp.status === "open" ? "rgba(46,125,50,0.1)" : `${C.brand}12`,
                                  padding: "2px 8px", borderRadius: 9999
                                }}>
                                  {opp.status}
                                </span>
                              </div>
                              <p style={{
                                fontSize: 12, color: C.muted, margin: "0 0 10px 0", lineHeight: 1.4,
                                display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden"
                              }}>
                                {opp.description || "No description provided."}
                              </p>
                            </div>
                            
                            {opp.skills && opp.skills.length > 0 && (
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                                {opp.skills.map((s, idx) => {
                                  const name = typeof s === "object" && s !== null ? (s.skill?.name || s.name || "") : s;
                                  const key = typeof s === "object" && s !== null ? (s.id || s.skill_id || idx) : idx;
                                  return (
                                    <span key={key} style={{
                                      fontSize: 10, color: C.dark2, background: C.sand,
                                      padding: "2px 6px", borderRadius: 4, fontWeight: 500
                                    }}>{name}</span>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Right Section: Applicant Count & Action Link */}
                          <div
                            className="opp-count-card"
                            id={`opp-count-${opp.id}`}
                            onClick={() => navigate(`/opportunities/${opp.id}/applicants`)}
                            style={{
                              background: C.surface, border: `1.5px solid ${C.border}`,
                              borderRadius: 16, padding: "20px", display: "flex", flexDirection: "column",
                              alignItems: "center", justifyContent: "center", textAlign: "center",
                              cursor: "pointer", minHeight: 140
                            }}
                          >
                            <span style={{
                              fontFamily: '"Melody by W.", "Melody", sans-serif', fontSize: 38,
                              fontWeight: 800, color: C.brand, lineHeight: 1
                            }}>
                              {count}
                            </span>
                            <span style={{
                              fontSize: 12, fontWeight: 700, color: C.dark2,
                              marginTop: 6, textTransform: "uppercase", letterSpacing: "0.05em"
                            }}>
                              {count === 1 ? "Applicant" : "Applicants"}
                            </span>
                            <span style={{
                              fontSize: 11, color: C.muted, marginTop: 4, fontStyle: "italic"
                            }}>
                              Click to view list →
                            </span>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
