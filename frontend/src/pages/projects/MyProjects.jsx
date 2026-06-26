import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GlobeIcon, SmartphoneIcon, BotIcon, PaletteIcon, ZapIcon, LockOpenIcon, BookIcon, ClipboardIcon, FolderIcon, TimelineIcon } from "../../components/common/Icons";

import Layout from "../../components/layout/Layout";
import { getMyProjects } from "../../api/projects";
import LoadingState from "../../components/ui/LoadingState";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";

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

const TYPE_ICON = {
  "Web App": <GlobeIcon size={14} />,
  "Mobile App": <SmartphoneIcon size={14} />,
  "AI / ML": <BotIcon size={14} />,
  "Design": <PaletteIcon size={14} />,
  "Hackathon": <ZapIcon size={14} />,
  "Open Source": <LockOpenIcon size={14} />,
};

const tilt = (n) => {
  const seq = [-1.6, 1.2, -0.8, 1.8, -1.2, 0.9];
  return seq[n % seq.length];
};

const STYLES = `
  @keyframes floatIn { from { opacity:0; transform: translateY(10px) } to { opacity:1; transform: translateY(0) } }
  @keyframes spin { to { transform: rotate(360deg) } }
  .mp-fade { animation: floatIn .35s ease both; }
  .mp-card { transition: transform .18s ease, box-shadow .18s ease; cursor: pointer; }
  .mp-card:hover { transform: rotate(0deg) translateY(-4px) !important; box-shadow: 0 14px 32px rgba(43,27,18,0.12) !important; }
  .mp-new:hover { background: ${C.brandDk}; transform: translateY(-2px); }
`;

export default function MyProjects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.detail || "Failed to load your projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await loadProjects();
    };
    init();
  }, [loadProjects]);

  if (loading) {
    return (
      <Layout>
        <LoadingState message="digging up your projects..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorState message={error} onRetry={loadProjects} />
      </Layout>
    );
  }

  return (
    <Layout>
      <style>{STYLES}</style>
      <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 80 }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "36px 20px 0" }}>

          {/* HERO */}
          <div className="mp-fade" style={{
            position: "relative",
            background: C.dark, color: C.bg,
            borderRadius: 28, padding: "40px 36px",
            marginBottom: 28,
            boxShadow: "0 14px 40px rgba(43,27,18,0.18)",
            transform: "rotate(-1deg)",
            display: "flex", flexWrap: "wrap", justifyContent: "space-between",
            alignItems: "center", gap: 20,
          }}>
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: C.orange, color: C.dark,
                padding: "4px 12px", borderRadius: 999,
                fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 800,
                letterSpacing: "0.1em", textTransform: "uppercase",
                marginBottom: 18,
              }}>
                your stuff
              </div>

              <h1 style={{
                fontFamily: '"Syne", sans-serif', fontWeight: 800,
                fontSize: "clamp(28px, 5.5vw, 46px)", lineHeight: 1.08,
                letterSpacing: "-0.02em", margin: 0,
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}>
                your project shelf <BookIcon size={32} color="currentColor" />
              </h1>

              <p style={{
                fontFamily: '"DM Sans", sans-serif', fontSize: 14,
                color: "rgba(255,248,240,0.7)", marginTop: 14, maxWidth: 440, lineHeight: 1.6,
              }}>
                everything you've started lives here. jump back in or start something new.
              </p>
            </div>

            <button
              className="mp-new"
              onClick={() => navigate("/create-project")}
              style={{
                background: C.brand, color: "white", border: "none",
                borderRadius: 999, padding: "13px 24px",
                fontFamily: '"DM Sans", sans-serif', fontWeight: 800, fontSize: 14,
                cursor: "pointer", transition: "all .18s ease",
                whiteSpace: "nowrap",
              }}
            >
              + new project
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="mp-fade" style={{
              border: `1.5px dashed ${C.border}`, borderRadius: 22, padding: "20px 0",
              background: C.surface
            }}>
              <EmptyState
                icon={<ClipboardIcon size={40} color={C.muted} />}
                headline="shelf's empty"
                sub="you haven't posted anything yet. drop your first idea and start building your team"
                cta="+ post your first project"
                href="/create-project"
              />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {projects.map((project, i) => (
                <div
                  key={project.id}
                  className="mp-fade mp-card"
                  onClick={() => navigate(`/projects/${project.id}`)}
                  style={{
                    background: C.surface, border: `1.5px solid ${C.border}`,
                    borderRadius: 20, padding: "22px 24px",
                    transform: `rotate(${tilt(i)}deg)`,
                  }}
                >
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                    gap: 12, flexWrap: "wrap",
                  }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        {project.project_type && (
                          <span style={{
                            background: C.sand, color: C.dark,
                            borderRadius: 999, padding: "4px 12px",
                            fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 800,
                            letterSpacing: "0.06em", textTransform: "uppercase",
                            display: "inline-flex", alignItems: "center", gap: 6,
                          }}>
                            <span style={{ display: "inline-flex", alignItems: "center" }}>{TYPE_ICON[project.project_type] || <FolderIcon size={14} />}</span> {project.project_type}
                          </span>
                        )}
                        {project.timeline && (
                          <span style={{
                            fontFamily: '"DM Sans", sans-serif', fontSize: 12,
                            color: C.muted,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}>
                            <TimelineIcon size={12} color="currentColor" /> {project.timeline}
                          </span>
                        )}
                      </div>

                      <h2 style={{
                        fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 22,
                        color: C.dark, margin: "0 0 6px",
                      }}>
                        {project.title}
                      </h2>

                      <p style={{
                        fontFamily: '"DM Sans", sans-serif', fontSize: 14, color: C.dark2,
                        margin: 0, lineHeight: 1.6,
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}>
                        {project.description || "no description yet."}
                      </p>
                    </div>

                    <span style={{
                      fontFamily: '"DM Sans", sans-serif', fontWeight: 800, fontSize: 13,
                      color: C.brand, whiteSpace: "nowrap", flexShrink: 0,
                    }}>
                      open →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}