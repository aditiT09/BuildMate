import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { getProfile } from "../../api/profile";
import { getProjects } from "../../api/projects";
import { validateExternalLink } from "../../utils/validation";

const C = {
  brand:    "#E35336",
  brandDk:  "#B8391F",
  orange:   "#F4A460",
  bg:       "#FFF8F0",
  surface:  "#FDFBF7",
  dark:     "#2B1B12",
  dark2:    "#4A372D",
  muted:    "#6E5A4E",
  border:   "#E9DDD0",
  sand:     "#F5EDE0",
  sandDk:   "#EDD5B8",
  cream:    "#FBF5EE",
  accent1:  "#D4A882",
  success:  "#2E7D32",
  warn:     "#D48A2D",
};

const STYLES = `
  @keyframes floatUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .pp-fade { animation: floatUp 0.45s ease both; }
  .pp-card { transition: all 0.2s ease; border: 2px solid #2B1B12; border-radius: 24px; padding: 28px; background: #FDFBF7; box-shadow: 6px 6px 0px #2B1B12; }
  .pp-card:hover { transform: translateY(-3px); box-shadow: 10px 10px 0px #2B1B12; }
  .pp-link-btn { transition: all 0.15s ease; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
  .pp-link-btn:hover { transform: translate(-2px, -2px); box-shadow: 4px 4px 0px #2B1B12 !important; background: #F5EDE0 !important; }
  .proj-row { transition: all 0.18s ease; border: 1px solid #E9DDD0; border-radius: 12px; background: #FBF5EE; cursor: pointer; padding: 12px 14px; display: flex; align-items: center; gap: 12px; }
  .proj-row:hover { border-color: #E35336 !important; background: #FEE8E3 !important; }
  @media(max-width:768px){
    .profile-grid { grid-template-columns: 1fr !important; }
  }
`;

// Inline SVG Icons
const Icon = ({ d, size = 16, color = "currentColor", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    style={{ display: "inline-block", flexShrink: 0, verticalAlign: "middle" }}>
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  user:       "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  wrench:     "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  github:     "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
  linkedin:   ["M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z", "M2 9h4v12H2z", "M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"],
  globe:      ["M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z", "M2 12h20", "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"],
  arrowUpRight:"M7 17L17 7 M7 7h10v10",
  chevronRight:"M9 18l6-6-6-6",
  layers:     ["M12 2L2 7l10 5 10-5-10-5z", "M2 17l10 5 10-5", "M2 12l10 5 10-5"],
  book:       ["M4 19.5A2.5 2.5 0 0 1 6.5 17H20", "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"],
  zap:        "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
};

const Ic = ({ name, size = 15, color = "currentColor", sw = 2 }) =>
  ICONS[name] ? <Icon d={ICONS[name]} size={size} color={color} strokeWidth={sw} /> : null;

// Score Counter Animation Helper
function AnimCount({ target, duration = 1200 }) {
  const [val, setVal] = useState(0);
  const prevTargetRef = useRef(0);

  useEffect(() => {
    const startVal = prevTargetRef.current;
    prevTargetRef.current = target;
    
    let start = null;
    const diff = target - startVal;

    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(startVal + progress * diff));
      if (progress < 1) requestAnimationFrame(step);
    };
    
    requestAnimationFrame(step);
  }, [target, duration]);

  return <>{val}</>;
}

// Circular Score Ring
function ScoreRing({ score = 50, label, color, size = 80 }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(score, 100) / 100;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.sandDk} strokeWidth={7} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          style={{ transition: "stroke-dashoffset 1.5s ease" }}
        />
        <text x={size / 2} y={size / 2 + 5} textAnchor="middle" fill={C.dark}
          style={{ fontSize: 16, fontWeight: 800, transform: "rotate(90deg)", transformOrigin: `${size / 2}px ${size / 2}px`, fontFamily: '"Syne", sans-serif' }}>
          <AnimCount target={score} />
        </text>
      </svg>
      <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: '"DM Sans", sans-serif' }}>{label}</span>
    </div>
  );
}

// Card Wrapper
function Card({ children, delay = 0, style = {} }) {
  return (
    <div className="pp-card pp-fade" style={{ animationDelay: `${delay}s`, ...style }}>
      {children}
    </div>
  );
}

export default function PublicProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProfileAndProjects = useCallback(async () => {
    try {
      setLoading(true);
      const [profData, projsData] = await Promise.all([
        getProfile(userId),
        getProjects({ owner_id: userId }).catch(() => []),
      ]);
      setProfile(profData);
      setProjects(projsData);
    } catch (error) {
      if (error.response?.status === 404) {
        setProfile(null);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const init = async () => {
      await loadProfileAndProjects();
    };
    init();
  }, [loadProfileAndProjects]);

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
            fetching builder details...
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <span style={{ fontSize: 44 }}>🧐</span>
          <h2 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 22, color: C.dark }}>
            Profile Not Found
          </h2>
          <p style={{ fontFamily: '"DM Sans", sans-serif', color: C.muted, fontSize: 14 }}>
            This user hasn't cooked up a profile yet.
          </p>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: C.brand, color: "white", border: "none",
              borderRadius: 999, padding: "10px 24px",
              fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: 13,
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
        </div>
      </Layout>
    );
  }

  const displayName = profile.full_name || "Unnamed Builder";
  const initials = displayName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  // Parse comma-separated skills
  const skillsArray = profile.skills
    ? profile.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <Layout>
      <style>{STYLES}</style>
      <div style={{ background: C.bg, minHeight: "100vh", padding: "32px 20px 80px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 700,
              color: C.muted, marginBottom: 24, padding: 0,
              display: "flex", alignitems: "center", gap: 6,
            }}
          >
            ← back
          </button>

          {/* Grid Layout */}
          <div className="profile-grid" style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "start" }}>
            
            {/* LEFT SIDEBAR */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              
              {/* Profile Card */}
              <Card delay={0.05} style={{ textAlign: "center", padding: "36px 20px" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Avatar"
                      style={{
                        width: 96, height: 96, borderRadius: "50%",
                        border: `2px solid ${C.dark}`, objectFit: "cover",
                        background: C.sand,
                      }}
                    />
                  ) : (
                    <div style={{
                      width: 96, height: 96, borderRadius: "50%",
                      border: `2px solid ${C.dark}`, background: C.brand,
                      color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 32,
                    }}>
                      {initials}
                    </div>
                  )}
                </div>

                <h2 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 20, color: C.dark, marginBottom: 4, lineHeight: 1.2 }}>
                  {displayName}
                </h2>

                {profile.availability && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "#E8F5E9", color: C.success,
                    border: "1px solid #C8E6C9", padding: "4px 14px",
                    borderRadius: 9999, fontSize: 11, fontWeight: 700,
                    fontFamily: '"DM Sans", sans-serif', letterSpacing: ".06em",
                    marginTop: 8,
                  }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.success, display: "inline-block" }} />
                    {profile.availability}
                  </span>
                )}

                {profile.college && (
                  <p style={{
                    fontSize: 12, color: C.muted, marginTop: 14,
                    fontFamily: '"DM Sans", sans-serif', lineHeight: 1.5,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                  }}>
                    <Ic name="book" size={12} color={C.muted} /> {profile.college}{profile.degree && ` · ${profile.degree}`}
                  </p>
                )}
              </Card>

              {/* Scores Card */}
              <Card delay={0.1} style={{ padding: "20px 24px" }}>
                <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", color: C.muted, fontFamily: '"DM Sans", sans-serif', marginBottom: 16, textAlign: "center" }}>
                  Builder Scores
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
                  <ScoreRing score={profile.activity_score ?? 50} label="Activity" color={C.brand} size={86} />
                  <ScoreRing score={profile.reliability_score ?? 50} label="Reliability" color={C.orange} size={86} />
                </div>
                <p style={{ fontSize: 11, color: C.muted, textAlign: "center", marginTop: 12, fontFamily: '"DM Sans", sans-serif', fontStyle: "italic", lineHeight: 1.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                  <Ic name="zap" size={11} color={C.muted} /> Platform integrity verified
                </p>
              </Card>

              {/* External Connections Card */}
              {(validateExternalLink(profile.github) || validateExternalLink(profile.linkedin) || validateExternalLink(profile.portfolio)) && (
                <Card delay={0.15} style={{ padding: "20px 24px" }}>
                  <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", color: C.muted, fontFamily: '"DM Sans", sans-serif', marginBottom: 12 }}>
                    Links
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {validateExternalLink(profile.github) && (
                      <a
                        href={validateExternalLink(profile.github)}
                        target="_blank"
                        rel="noreferrer"
                        className="pp-link-btn"
                        style={{
                          textDecoration: "none",
                          background: C.cream,
                          color: C.dark,
                          border: `1.5px solid ${C.border}`,
                          borderRadius: 12,
                          padding: "10px 14px",
                          fontFamily: '"DM Sans", sans-serif',
                          fontWeight: 700,
                          fontSize: 13,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Ic name="github" size={16} color={C.brand} /> GitHub
                        </span>
                        <Ic name="arrowUpRight" size={12} color={C.brand} />
                      </a>
                    )}

                    {validateExternalLink(profile.linkedin) && (
                      <a
                        href={validateExternalLink(profile.linkedin)}
                        target="_blank"
                        rel="noreferrer"
                        className="pp-link-btn"
                        style={{
                          textDecoration: "none",
                          background: C.cream,
                          color: C.dark,
                          border: `1.5px solid ${C.border}`,
                          borderRadius: 12,
                          padding: "10px 14px",
                          fontFamily: '"DM Sans", sans-serif',
                          fontWeight: 700,
                          fontSize: 13,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Ic name="linkedin" size={16} color={C.brand} /> LinkedIn
                        </span>
                        <Ic name="arrowUpRight" size={12} color={C.brand} />
                      </a>
                    )}

                    {validateExternalLink(profile.portfolio) && (
                      <a
                        href={validateExternalLink(profile.portfolio)}
                        target="_blank"
                        rel="noreferrer"
                        className="pp-link-btn"
                        style={{
                          textDecoration: "none",
                          background: C.cream,
                          color: C.dark,
                          border: `1.5px solid ${C.border}`,
                          borderRadius: 12,
                          padding: "10px 14px",
                          fontFamily: '"DM Sans", sans-serif',
                          fontWeight: 700,
                          fontSize: 13,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Ic name="globe" size={16} color={C.brand} /> Portfolio
                        </span>
                        <Ic name="arrowUpRight" size={12} color={C.brand} />
                      </a>
                    )}
                  </div>
                </Card>
              )}
            </div>

            {/* RIGHT MAIN DETAILS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              
              {/* About Bio Card */}
              <Card delay={0.12}>
                <h3 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 16, color: C.dark, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
                  <Ic name="user" size={16} color={C.brand} /> About Builder
                </h3>
                <p style={{
                  fontFamily: '"DM Sans", sans-serif', fontSize: 15, lineHeight: 1.8,
                  color: C.dark2, fontStyle: "italic", borderLeft: `3px solid ${C.brand}`,
                  paddingLeft: 16, margin: 0, whiteSpace: "pre-line",
                }}>
                  {profile.bio ? `"${profile.bio}"` : "No bio added yet — keeping it mysterious 👀"}
                </p>
              </Card>

              {/* Skills Card */}
              {skillsArray.length > 0 && (
                <Card delay={0.18}>
                  <h3 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 16, color: C.dark, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
                    <Ic name="wrench" size={16} color={C.brand} /> Tech Stack & Skills
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {skillsArray.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          background: "#FEE8E3",
                          color: "#B8391F",
                          border: `1.5px solid ${C.border}`,
                          borderRadius: 9999,
                          padding: "6px 16px",
                          fontFamily: '"DM Sans", sans-serif',
                          fontWeight: 700,
                          fontSize: 13,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </Card>
              )}

              {/* Projects Card */}
              <Card delay={0.24}>
                <h3 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 16, color: C.dark, margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
                  <Ic name="layers" size={16} color={C.brand} /> Projects Built ({projects.length})
                </h3>
                {projects.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <p style={{ fontFamily: '"DM Sans", sans-serif', color: C.muted, fontSize: 13, margin: 0 }}>
                      No public projects added by this builder yet.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {projects.map((proj) => (
                      <Link key={proj.id} to={`/projects/${proj.id}`} style={{ textDecoration: "none" }}>
                        <div className="proj-row">
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: C.sandDk, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Ic name="layers" size={18} color={C.dark2} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 14, color: C.dark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
                              {proj.title}
                            </p>
                            {proj.project_type && (
                              <p style={{ fontSize: 11, color: C.muted, fontFamily: '"DM Sans", sans-serif', margin: 0 }}>
                                {proj.project_type}
                              </p>
                            )}
                          </div>
                          <Ic name="chevronRight" size={14} color={C.muted} />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </Card>

            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
}