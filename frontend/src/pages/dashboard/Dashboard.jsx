import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getMyProjects } from "../../api/projects";
import { getMyApplications } from "../../api/applications";
import { getOverview } from "../../api/analytics";
import { getMyProfile, getAuthorProfile } from "../../api/profile";
import { getCurrentUser } from "../../api/users";
import { useAuth } from "../../hooks/useAuth";
import ScoreRing from "../../components/ui/ScoreRing";
import EmptyState from "../../components/ui/EmptyState";
import AnimCount from "../../components/ui/AnimCount";
import ProfileCompleteness from "./components/ProfileCompleteness";



// ── Palette ────────────────────────────────────────────
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

// ── SVG Icons ───────────────────────────────────────────
const FolderIcon = ({ color = "currentColor", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const MailIcon = ({ color = "currentColor", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const GlobeIcon = ({ color = "currentColor", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const RocketIcon = ({ color = "currentColor", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <path d="M4.5 16.5c-1.5 1.26-2 3.3-2 3.3s2.04-.5 3.3-2L18.5 5.5a4.24 4.24 0 1 0-6-6L4.5 16.5z" />
    <path d="M12 15l-3-3m5.5 8.5L12 18l-3-3-2.5 2.5a1 1 0 0 0-.2.3l-1.5 4a.5.5 0 0 0 .6.6l4-1.5a1 1 0 0 0 .3-.2l2.5-2.5z" />
  </svg>
);

const AwardIcon = ({ color = "currentColor", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

const LightningIcon = ({ color = "currentColor", size = 20 }) => (

  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const UserIcon = ({ color = "currentColor", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const InfoIcon = ({ color = "currentColor", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const TrendingIcon = ({ color = "currentColor", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const UsersIcon = ({ color = "currentColor", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const TargetIcon = ({ color = "currentColor", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const ClockIcon = ({ color = "currentColor", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const FileTextIcon = ({ color = "currentColor", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

// ── Keyframes injected once ─────────────────────────────
const STYLES = `
  @keyframes countUp   { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
  @keyframes slideLeft { from { opacity:0; transform:translateX(12px) } to { opacity:1; transform:translateX(0) } }
  @keyframes slideUp   { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
  @keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes pulse3    { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
  @keyframes spin360   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes barFill   { from{width:0%} to{width:var(--w)} }
  @keyframes dotBlink  { 0%,100%{opacity:1} 50%{opacity:0.2} }
  @keyframes streakPop { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
  @keyframes gradFlow  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes arrowFlow  { from { stroke-dashoffset: 20; } to { stroke-dashoffset: 0; } }

  .dash-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
  .dash-card:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(43,27,18,0.06); }
  .streak-cell { transition: all 0.15s ease; }
  .streak-cell:hover { transform: scale(1.3); }

  .about-flow {
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 28px;
    margin-top: 28px;
    width: 100%;
  }
  .about-step {
    width: 48%;
    background: #FFF8F0;
    border: 1.5px solid #E9DDD0;
    border-radius: 18px;
    padding: 28px;
    box-shadow: 4px 4px 0px #2B1B12;
    transition: transform 0.22s ease, box-shadow 0.22s ease;
    position: relative;
    z-index: 2;
    box-sizing: border-box;
  }
  .about-step:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 6px 6px 0px #E35336;
  }
  .about-step-1 { align-self: flex-start; }
  .about-step-2 { align-self: flex-end; }
  .about-step-3 { align-self: flex-start; }

  @media (max-width: 991px) {
    .about-step {
      width: 100% !important;
      align-self: center !important;
    }
  }
`;

// ── Skeleton loader ──────────────────────────────────────
function Skeleton({ w = "100%", h = 20, r = 8 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: "linear-gradient(90deg, #f0e6da 25%, #f8f2ec 50%, #f0e6da 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
    }} />
  );
}


// ── Status badge ─────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    pending:  { bg: "#FFF8F0", color: "#D48A2D", dot: "#D48A2D" },
    accepted: { bg: "#F3FAF5", color: "#2E7D32", dot: "#2E7D32" },
    rejected: { bg: "#FFF5F5", color: "#B8391F", dot: "#B8391F" },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "4px 10px", borderRadius: 9999,
      fontSize: 11, fontWeight: 600,
      fontFamily: '"DM Sans", sans-serif',
      display: "inline-flex", alignItems: "center", gap: 6,
      border: `1px solid ${s.dot}20`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
      {status}
    </span>
  );
}

// ── Main Dashboard ──────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects,     setProjects]     = useState([]);
  const [applications, setApplications] = useState([]);
  const [overview,     setOverview]     = useState(null);
  const [profile,      setProfile]      = useState(null);
  const [currentUser,  setCurrentUser]  = useState(null);
  const [authorProfile, setAuthorProfile] = useState(null);
  const [loading,      setLoading]      = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      const [pd, ad, od, prd, curUser, authProf] = await Promise.all([
        getMyProjects(),
        getMyApplications(),
        getOverview(),
        getMyProfile().catch(() => null),
        getCurrentUser().catch(() => null),
        getAuthorProfile().catch(() => null),
      ]);
      setProjects(pd);
      setApplications(ad);
      setOverview(od);
      setProfile(prd);
      setCurrentUser(curUser);
      setAuthorProfile(authProf);
    } catch {
      // Suppressed console.error in production
    } finally {
      setLoading(false);
    }
  }, []);

useEffect(() => {
  const init = async () => {
    await loadDashboard();
  };
  init();
}, [loadDashboard]);
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();


  const displayName = profile?.full_name || user?.name || "Builder";
  const firstName   = displayName.split(" ")[0];
  const isAditi     = user?.email === "adititiwari09@gmail.com";

  const pendingApps  = applications.filter(a => a.status === "pending").length;
  const acceptedApps = applications.filter(a => a.status === "accepted").length;
  const rejectedApps = applications.filter(a => a.status === "rejected").length;


  // ── Layout ───────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: C.bg, paddingTop: 24, fontFamily: '"DM Sans", sans-serif' }}>
      <style>{STYLES}</style>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "16px 28px 32px 28px" }}>

        {/* ══ HEADER BAR ════════════════════════════════ */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
          animation: "slideUp 0.6s ease both",
        }}>
          <span style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 28,
            fontWeight: 800,
            color: C.brand,
            letterSpacing: "-0.01em",
            textTransform: "none",
          }}>
            BuildMate
          </span>

          <Link to="/profile" style={{ textDecoration: "none" }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: C.brand,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: '"Eczar", serif',
              fontWeight: 800,
              fontSize: 14,
              border: `2px solid #FFF8F0`,
              boxShadow: `0 4px 12px rgba(227, 83, 54, 0.25)`,
              cursor: "pointer",
              transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)" }}
            >
              {displayName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
            </div>
          </Link>
        </div>

        {/* ══ HERO HEADER ══════════════════════════════ */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 28, marginBottom: 36,
          animation: "slideUp 0.6s ease both",
        }}>
          <div>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, lineHeight: 0.9, color: C.dark }}>
              <span style={{ fontSize: "clamp(40px, 5vw, 72px)", display: "block" }}>
                {greeting},
              </span>
              <span style={{ fontSize: "clamp(44px, 6vw, 82px)", color: C.brand, display: "block" }}>
                {firstName}.
              </span>
            </h1>
            <p style={{ marginTop: 14, fontSize: 17, color: C.dark2, fontStyle: "italic", fontFamily: '"Cormorant Garamond", serif' }}>
              find your squad and let's cook
            </p>
            {/* GitHub streak callout */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              marginTop: 16, padding: "8px 18px",
              background: "linear-gradient(135deg, #2B1B12 0%, #4A372D 100%)",
              borderRadius: 9999, cursor: "pointer",
              animation: "gradFlow 4s ease infinite",
              backgroundSize: "200% 200%",
            }} onClick={() => navigate("/discover")}>
              <LightningIcon color={C.orange} size={16} />
              <span style={{ color: "#F4A460", fontSize: 13, fontWeight: 600, letterSpacing: "0.03em" }}>
                Stay consistent — keep your GitHub streak alive
              </span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>→</span>
            </div>
          </div>

          {/* Score rings */}
          <div style={{
            background: C.dark, borderRadius: 24, padding: "28px 32px",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 16, minWidth: 220,
            animation: "slideLeft 0.6s ease 0.1s both", opacity: 0,
          }}>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: '"DM Sans", sans-serif' }}>
              Your scores
            </p>
            <div style={{ display: "flex", gap: 20 }}>
              <ScoreRing score={currentUser?.activity_score    ?? user?.activity_score    ?? 50} label="Activity"    color={C.brand}  />
              <ScoreRing score={currentUser?.reliability_score ?? user?.reliability_score ?? 50} label="Reliability" color={C.orange} />
            </div>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, textAlign: "center", lineHeight: 1.5, maxWidth: 160, fontFamily: '"DM Sans", sans-serif' }}>
              Ship more projects to level up your scores.
            </p>
          </div>
        </div>

        {/* ══ STAT CARDS ROW ═══════════════════════════ */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 28, marginBottom: 36,
        }}>
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} style={{
                borderRadius: 20, padding: "28px 28px",
                background: C.surface, border: `1px solid ${C.border}`,
                minHeight: 210, display: "flex", flexDirection: "column",
                justifyContent: "space-between"
              }}>
                <Skeleton h={12} w="60%" r={6} />
                <div style={{ marginTop: 16 }}><Skeleton h={48} w="40%" r={8} /></div>
                <div style={{ marginTop: 10 }}><Skeleton h={10} w="80%" r={6} /></div>
              </div>
            ))
          ) : (
            <>
              <StatCard color={C.brand}   icon={<FolderIcon color={C.brand} size={24} />} title="My Projects"    value={projects.length}                    sub="you're building"      delay={0}   link="/my-projects" />
              <StatCard color={C.orange}  icon={<MailIcon color={C.orange} size={24} />} title="Applications"   value={applications.length}                sub="sent by you"          delay={0.05} link="/applications" />
              <StatCard color="#2E7D32"   icon={<GlobeIcon color="#2E7D32" size={24} />} title="Live Projects"  value={overview?.total_projects ?? 0}      sub="on the platform"      delay={0.1}  link="/discover" />
            </>
          )}
        </div>

        {/* ══ MAIN GRID ════════════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 28, marginBottom: 28 }}>

          {/* Top skills / Trending Skills */}
          <div className="dash-card" style={{
            background: C.dark, borderRadius: 24, padding: 36,
            animation: "slideUp 0.6s ease 0.2s both", opacity: 0,
          }}>
            <SectionLabel light icon={<TrendingIcon color={C.orange} size={18} />} fontSize={18}>Trending Skills</SectionLabel>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 18, fontStyle: "italic" }}>
              top skills currently in demand
            </p>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[1,2,3,4,5].map(i => <Skeleton key={i} h={42} r={10} />)}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {(overview?.top_skills || []).map((skill, i) => {
                  const isObj = typeof skill === "object" && skill !== null;
                  const name = isObj ? skill.name : skill;
                  const count = isObj ? skill.count : 0;
                  const maxCount = typeof overview?.top_skills?.[0] === "object" ? (overview?.top_skills?.[0]?.count || 1) : 1;
                  const pct = isObj ? (count / maxCount * 100) : (100 - i * 15);
                  return (
                    <div key={name} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      animation: `slideUp 0.4s ease ${0.2 + i * 0.06}s both`, opacity: 0,
                    }}>
                      <span style={{ color: C.orange, fontFamily: '"Melody by W.", "Melody", sans-serif', fontWeight: 800, fontSize: 16, width: 24 }}>
                        {i + 1}.
                      </span>
                      <div style={{
                        flex: 1, height: 42, borderRadius: 10,
                        background: "rgba(255,255,255,0.06)",
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between",
                        paddingLeft: 16, paddingRight: 16, overflow: "hidden", position: "relative",
                      }}>
                        <div style={{
                          position: "absolute", left: 0, top: 0, bottom: 0,
                          width: `${Math.max(15, pct)}%`,
                          background: `linear-gradient(90deg, rgba(227,83,54,0.25), transparent)`,
                          transition: "width 1s ease",
                        }} />
                        <span style={{ position: "relative", color: "rgba(255,255,255,0.9)", fontSize: 15, fontWeight: 600 }}>
                          {name}
                        </span>
                        {isObj && (
                          <span style={{ position: "relative", color: C.orange, fontSize: 13, fontWeight: 700, fontFamily: '"Melody by W.", "Melody", sans-serif' }}>
                            {count} {count === 1 ? "builder" : "builders"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {(!overview?.top_skills || overview.top_skills.length === 0) && (
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, fontStyle: "italic" }}>No skill data yet — add yours in profile!</p>
                )}
              </div>
            )}
          </div>

          {/* Application breakdown */}
          <div className="dash-card" style={{
            background: C.dark, borderRadius: 24, padding: 36, color: "white",
            animation: "slideUp 0.6s ease 0.25s both", opacity: 0,
          }}>
            <SectionLabel light icon={<MailIcon color={C.orange} size={18} />} fontSize={18}>Application Breakdown</SectionLabel>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20, fontStyle: "italic" }}>
              "no shot I'm going 0/3 this week" — you, probably
            </p>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[1,2,3].map(i => <Skeleton key={i} h={40} r={10} />)}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Pending",  val: pendingApps,  total: applications.length, color: "#F4A460" },
                  { label: "Accepted", val: acceptedApps, total: applications.length, color: "#6FCF97" },
                  { label: "Rejected", val: rejectedApps, total: applications.length, color: "#EB5757" },
                ].map(bar => {
                  const pct = applications.length ? (bar.val / applications.length * 100) : 0;
                  return (
                    <div key={bar.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{bar.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: bar.color }}>{bar.val}</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.08)" }}>
                        <div style={{
                          height: "100%", borderRadius: 4,
                          background: bar.color,
                          width: `${pct}%`,
                          transition: "width 1.2s ease",
                          boxShadow: `0 0 8px ${bar.color}66`,
                        }} />
                      </div>
                    </div>
                  );
                })}
                <Link to="/applications" style={{ textDecoration: "none" }}>
                  <button style={{
                    width: "100%", marginTop: 8,
                    background: "rgba(255,255,255,0.08)",
                    border: "1.5px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.7)",
                    borderRadius: 10, padding: "10px",
                    fontSize: 13, cursor: "pointer",
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 600, letterSpacing: "0.04em",
                    transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { e.target.style.background = "rgba(227,83,54,0.3)"; e.target.style.color = "white"; }}
                    onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.08)"; e.target.style.color = "rgba(255,255,255,0.7)"; }}
                  >
                    View all applications →
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ══ MY PROJECTS ══════════════════════════════ */}
        <div className="dash-card" style={{
          background: C.surface, borderRadius: 24, padding: 36,
          border: `1px solid ${C.border}`, marginBottom: 28,
          animation: "slideUp 0.6s ease 0.3s both", opacity: 0,
          width: "100%",
          boxSizing: "border-box",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <SectionLabel icon={<FolderIcon color={C.brand} size={18} />}>My Projects</SectionLabel>
            <Link to="/create-project" style={{ textDecoration: "none" }}>
              <ActionBtn>+ New Project</ActionBtn>
            </Link>
          </div>

          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
              {[1,2,3].map(i => <Skeleton key={i} h={200} r={14} />)}
            </div>
          ) : projects.length === 0 ? (
            <EmptyState
              icon={<FolderIcon color={C.muted} size={48} />}
              headline="no projects? bestie, let's fix that"
              sub="Start building — every project is a GitHub commit waiting to happen"
              cta="Create your first project"
              href="/create-project"
            />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
              {projects.map((p, i) => <ProjectCard key={p.id} project={p} delay={i * 0.05} />)}
            </div>
          )}
        </div>

        {/* ══ RECENT APPLICATIONS ══════════════════════ */}
        <div className="dash-card" style={{
          background: C.surface, borderRadius: 24, padding: 36,
          border: `1px solid ${C.border}`, marginBottom: 28,
          animation: "slideUp 0.6s ease 0.35s both", opacity: 0,
          width: "100%",
          boxSizing: "border-box",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <SectionLabel icon={<MailIcon color={C.brand} size={18} />}>Recent Applications</SectionLabel>
            <Link to="/discover" style={{ textDecoration: "none" }}>
              <ActionBtn secondary>Discover more →</ActionBtn>
            </Link>
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[1,2,3].map(i => <Skeleton key={i} h={56} r={12} />)}
            </div>
          ) : applications.length === 0 ? (
            <EmptyState
              icon={<MailIcon color={C.muted} size={48} />}
              headline="zero applications? the audacity"
              sub="Explore projects, apply to openings — build that portfolio, not regrets"
              cta="Start exploring"
              href="/discover"
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {applications.slice(0, 6).map((app, i) => (
                <div key={app.id} style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: C.cream, borderRadius: 12,
                  border: `1px solid ${C.border}`,
                  animation: `slideUp 0.4s ease ${i * 0.05}s both`,
                  opacity: 0,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: C.sand,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <FileTextIcon color={C.dark} size={18} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14, color: C.dark }}>
                        {app.opportunity?.role || "Collaborator"}
                      </p>
                      <p style={{ fontSize: 12, color: C.muted }}>
                        {app.opportunity?.project?.title || "BuildMate Project"}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
              {applications.length > 6 && (
                <Link to="/applications" style={{ textDecoration: "none", textAlign: "center", display: "block", padding: "10px", color: C.brand, fontWeight: 600, fontSize: 13 }}>
                  +{applications.length - 6} more applications →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* ══ BADGES EARNED (WHOLE / FULL WIDTH) ══════ */}
        <div className="dash-card" style={{
          background: C.surface, borderRadius: 24, padding: 36,
          border: `1px solid ${C.border}`, marginBottom: 28,
          minHeight: 400,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          animation: "slideUp 0.6s ease 0.4s both", opacity: 0,
          width: "100%",
          boxSizing: "border-box",
        }}>
          <SectionLabel icon={<AwardIcon color={C.brand} size={18} />}>Badges Earned</SectionLabel>
          <div style={{ textAlign: "center", padding: "16px 0", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{ display: "inline-flex", opacity: 0.35, marginBottom: 12 }}>
              <AwardIcon color={C.dark} size={48} />
            </div>
            <h3 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 18, color: C.dark, marginBottom: 8, marginTop: 0 }}>
              No badges yet.
            </h3>
            <p style={{ fontSize: 14, color: C.muted, fontFamily: '"DM Sans", sans-serif', margin: "0 auto", maxWidth: 320, lineHeight: 1.5 }}>
              Your builder arc is just getting started. Ship something cool.
            </p>
          </div>
        </div>
        {/* Profile Completeness Card (WHOLE / FULL WIDTH) */}
        <ProfileCompleteness profile={profile} />


        {/* ══ BUILDMATE STATS (WHOLE / FULL WIDTH) ══════ */}
        <div className="dash-card" style={{
          background: C.surface, borderRadius: 24, padding: 36, color: C.dark,
          border: `1px solid ${C.border}`,
          animation: "slideUp 0.6s ease 0.5s both", opacity: 0,
          width: "100%",
          boxSizing: "border-box",
          marginBottom: 28,
          
        }}>
          <SectionLabel icon={<GlobeIcon color={C.brand} size={18} />}>BuildMate Stats</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 10 }}>
            <div style={{ textAlign: "center", padding: "16px 24px", background: C.cream, borderRadius: 16, border: `1px solid ${C.border}` }}>
              <div style={{ display: "inline-flex", justifyContent: "center", marginBottom: 6 }}>
                <RocketIcon color={C.brand} size={24} />
              </div>
              <h4 style={{ fontFamily: '"Melody by W.", "Melody", sans-serif', fontWeight: 800, fontSize: 28, color: C.brand, margin: "6px 0 2px" }}>
                <AnimCount target={overview?.total_projects ?? 0} />
              </h4>
              <p style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontWeight: 700 }}>Projects</p>
            </div>
            <div style={{ textAlign: "center", padding: "16px 24px", background: C.cream, borderRadius: 16, border: `1px solid ${C.border}` }}>
              <div style={{ display: "inline-flex", justifyContent: "center", marginBottom: 6 }}>
                <UsersIcon color={C.orange} size={24} />
              </div>
              <h4 style={{ fontFamily: '"Melody by W.", "Melody", sans-serif', fontWeight: 800, fontSize: 28, color: C.orange, margin: "6px 0 2px" }}>
                <AnimCount target={overview?.total_users ?? 0} />
              </h4>
              <p style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontWeight: 700 }}>Builders</p>
            </div>
            <div style={{ textAlign: "center", padding: "16px 24px", background: C.cream, borderRadius: 16, border: `1px solid ${C.border}` }}>
              <div style={{ display: "inline-flex", justifyContent: "center", marginBottom: 6 }}>
                <TargetIcon color="#7C5CBF" size={24} />
              </div>
              <h4 style={{ fontFamily: '"Melody by W.", "Melody", sans-serif', fontWeight: 800, fontSize: 28, color: "#7C5CBF", margin: "6px 0 2px" }}>
                <AnimCount target={overview?.total_opportunities ?? 0} />
              </h4>
              <p style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontWeight: 700 }}>Openings</p>
            </div>
          </div>
        </div>

        {/* ══ ABOUT BUILDMATE (WHOLE / FULL WIDTH / BELOW STATS) ══════ */}
        <div className="dash-card" style={{
          background: C.surface, borderRadius: 24, padding: 36,
          border: `1px solid ${C.border}`, marginBottom: 28,
          animation: "slideUp 0.6s ease 0.55s both", opacity: 0,
          width: "100%",
          boxSizing: "border-box",
        }}>
          <SectionLabel icon={<InfoIcon color={C.brand} size={18} />}>About BuildMate</SectionLabel>
          
          <div className="about-flow">
            {/* Step 1 */}
            <div className="about-step about-step-1">
              <h4 style={{ fontFamily: '"Flaviotte", "Geist", sans-serif', fontWeight: 700, fontSize: 18, color: C.brand, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                01. The Spark
              </h4>
              <p style={{ fontSize: 15, color: C.dark, lineHeight: 1.6, fontFamily: '"DM Sans", sans-serif', margin: 0 }}>
                BuildMate was born from a simple idea: great projects need great teammates. Too many students have ideas but struggle to find people who share their skills, passion, and drive.
              </p>
            </div>

            {/* Step 2 */}
            <div className="about-step about-step-2">
              <h4 style={{ fontFamily: '"Flaviotte", "Geist", sans-serif', fontWeight: 700, fontSize: 18, color: C.brand, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                02. The Mission
              </h4>
              <p style={{ fontSize: 15, color: C.dark, lineHeight: 1.6, fontFamily: '"DM Sans", sans-serif', margin: 0 }}>
                We make collaboration easier by helping builders discover projects, connect with talented peers, and create teams that actually ship. No awkward networking, no endless searching—just the right people for the right project.
              </p>
            </div>

            {/* Step 3 */}
            <div className="about-step about-step-3">
              <h4 style={{ fontFamily: '"Flaviotte", "Geist", sans-serif', fontWeight: 700, fontSize: 18, color: C.brand, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                03. The Vision
              </h4>
              <p style={{ fontSize: 15, color: C.dark, lineHeight: 1.6, fontFamily: '"DM Sans", sans-serif', margin: 0 }}>
                At BuildMate, we believe the next big idea starts with one connection. Build together, learn together, and turn ambitious ideas into real achievements.
              </p>
            </div>
          </div>
        </div>

        {/* ══ AUTHOR FOOTER SIGNATURE ══════ */}
        <div className="dash-card" style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 24,
          padding: 36,
          animation: "slideUp 0.6s ease 0.6s both",
          opacity: 0,
          width: "100%",
          boxSizing: "border-box",
          marginBottom: 28,
        }}>
          <SectionLabel icon={<UserIcon color={C.brand} size={18} />}>Built by Aditi Tiwari</SectionLabel>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 28, marginTop: 12 }}>
            {/* Left Column */}
            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: 22,
                color: C.dark,
                lineHeight: 1.5,
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                margin: "0 0 20px 0",
                fontWeight: 600,
              }}>
                To every builder out there<br />
                —thanks for being part of BuildMate.<br />
                We can't wait to see what you'll create<br />
                together.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.muted, fontFamily: '"DM Sans", sans-serif' }}>
                  Connect with us:
                </span>
                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: C.brand,
                    textDecoration: "none",
                    fontFamily: '"DM Sans", sans-serif',
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                  onMouseEnter={e => e.target.style.textDecoration = "underline"}
                  onMouseLeave={e => e.target.style.textDecoration = "none"}
                >
                  LinkedIn ↗
                </a>
                <span style={{ color: C.border }}>|</span>
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: C.brand,
                    textDecoration: "none",
                    fontFamily: '"DM Sans", sans-serif',
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                  onMouseEnter={e => e.target.style.textDecoration = "underline"}
                  onMouseLeave={e => e.target.style.textDecoration = "none"}
                >
                  Instagram ↗
                </a>
                <span style={{ color: C.border }}>|</span>
                <a
                  href="mailto:adititiwari09@gmail.com"
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: C.brand,
                    textDecoration: "none",
                    fontFamily: '"DM Sans", sans-serif',
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                  onMouseEnter={e => e.target.style.textDecoration = "underline"}
                  onMouseLeave={e => e.target.style.textDecoration = "none"}
                >
                  adititiwari09@gmail.com
                </a>
              </div>
            </div>

            {/* Right Column */}
            <div style={{ flexShrink: 0 }}>
              {authorProfile?.avatar ? (
                isAditi ? (
                  <Link to="/profile" style={{ textDecoration: "none" }}>
                    <img
                      src={authorProfile.avatar}
                      alt="Aditi Tiwari"
                      style={{
                        width: 90,
                        height: 120,
                        borderRadius: 12,
                        border: `2px solid ${C.brand}`,
                        objectFit: "cover",
                        transition: "transform 0.2s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    />
                  </Link>
                ) : (
                  <img
                    src={authorProfile.avatar}
                    alt="Aditi Tiwari"
                    style={{
                      width: 90,
                      height: 120,
                      borderRadius: 12,
                      border: `2px solid ${C.brand}`,
                      objectFit: "cover",
                    }}
                  />
                )
              ) : (
                isAditi ? (
                  <Link to="/profile" style={{ textDecoration: "none" }}>
                    <div style={{
                      width: 90,
                      height: 120,
                      borderRadius: 12,
                      border: `2px dashed ${C.brand}`,
                      background: C.sand,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = C.sandDark;
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = C.sand;
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <span style={{ fontSize: 24, color: C.brand, fontWeight: 700, lineHeight: 1 }}>+</span>
                      <span style={{ fontSize: 10, color: C.brand, fontWeight: 700, marginTop: 4, fontFamily: '"DM Sans", sans-serif', textTransform: "uppercase" }}>Photo</span>
                    </div>
                  </Link>
                ) : (
                  <div style={{
                    width: 90,
                    height: 120,
                    borderRadius: 12,
                    background: `linear-gradient(135deg, ${C.brand}, ${C.brandDark})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: '"Syne", sans-serif',
                    fontWeight: 800,
                    fontSize: 28,
                    color: "white",
                    border: `2px solid ${C.sandDark}`,
                  }}>
                    AT
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────

function StatCard({ color, icon, title, value, sub, delay, link }) {
  const inner = (
    <div className="dash-card" style={{
      background: C.surface, borderRadius: 20, padding: "28px 28px",
      border: `1px solid ${C.border}`,
      position: "relative", overflow: "hidden", minHeight: 210,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      animation: `slideUp 0.5s ease ${delay}s both`, opacity: 0,
      cursor: link ? "pointer" : "default",
    }}>
      {/* Blob */}
      <div style={{
        position: "absolute", right: -20, bottom: -20,
        width: 100, height: 100, borderRadius: "50%",
        background: `${color}18`,
        transition: "transform 0.3s ease",
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <span style={{ display: "inline-flex", alignItems: "center" }}>{icon}</span>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
          textTransform: "uppercase", color: color,
          fontFamily: '"DM Sans", sans-serif',
        }}>{title}</span>
      </div>
       <div style={{
        fontFamily: '"Melody by W.", "Melody", sans-serif', fontSize: 52, fontWeight: 800,
        color: C.dark, lineHeight: 1,
        animation: "countUp 0.6s ease both",
      }}>
        <AnimCount target={value} />
      </div>
      <p style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>{sub}</p>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `${color}40`, borderRadius: "0 0 20px 20px" }}>
        <div style={{ height: "100%", background: color, width: "100%", borderRadius: "0 0 20px 20px", opacity: 0.8 }} />
      </div>
    </div>
  );
  return link ? <Link to={link} style={{ textDecoration: "none" }}>{inner}</Link> : inner;
}

/* eslint-disable-next-line no-unused-vars */
function MiniStat({ icon, label, value, delay, loading }) {
  return (
    <div style={{
      background: C.cream, borderRadius: 16, padding: "16px 18px",
      border: `1px solid ${C.border}`,
      display: "flex", alignItems: "center", gap: 12,
      animation: `slideUp 0.4s ease ${delay}s both`, opacity: 0,
    }}>
      <span style={{ display: "inline-flex", alignItems: "center" }}>{icon}</span>
      <div>
        {loading
          ? <Skeleton h={24} w={40} r={4} />
          : <p style={{ fontFamily: '"Melody by W.", "Melody", sans-serif', fontWeight: 800, fontSize: 22, color: C.dark, lineHeight: 1 }}><AnimCount target={value} /></p>
        }
        <p style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{label}</p>
      </div>
    </div>
  );
}

function SectionLabel({ children, light, icon, fontSize = 18 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
      {icon && <span style={{ display: "inline-flex", alignItems: "center" }}>{icon}</span>}
      <p style={{
        fontFamily: '"Poppins", sans-serif', fontWeight: 700,
        fontSize: fontSize, letterSpacing: "0.01em",
        color: light ? "rgba(255,255,255,0.85)" : C.dark,
        margin: 0,
      }}>{children}</p>
      <div style={{ flex: 1, height: 1, background: light ? "rgba(255,255,255,0.1)" : C.border }} />
    </div>
  );
}

function ActionBtn({ children, secondary }) {
  const [h, setH] = useState(false);
  return (
    <button
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h ? (secondary ? C.dark : C.brandDark) : (secondary ? "transparent" : C.brand),
        color: secondary ? (h ? "white" : C.brand) : "white",
        border: secondary ? `1.5px solid ${C.brand}` : "none",
        borderRadius: 9999, padding: "8px 18px",
        fontSize: 13, fontWeight: 700, cursor: "pointer",
        fontFamily: '"DM Sans", sans-serif',
        letterSpacing: "0.02em",
        transition: "all 0.2s",
      }}
    >{children}</button>
  );
}

function ProjectCard({ project, delay }) {
  const [h, setH] = useState(false);
  return (
    <Link to={`/projects/${project.id}`} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          background: h ? C.sandDark : C.cream,
          border: `1.5px solid ${h ? C.brand : C.border}`,
          borderRadius: 16,
          padding: "28px 28px",
          minHeight: 260,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          cursor: "pointer",
          transition: "all 0.2s ease",
          transform: h ? "translateY(-2px)" : "translateY(0)",
          boxShadow: h ? `0 8px 24px ${C.brand}20` : "none",
          animation: `slideUp 0.4s ease ${delay}s both`, opacity: 0,
        }}
      >
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <FolderIcon color={C.brand} size={22} />
            {project.project_type && (
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", color: C.brand,
                background: `${C.brand}15`, padding: "3px 10px", borderRadius: 9999,
                fontFamily: '"DM Sans", sans-serif',
              }}>{project.project_type}</span>
            )}
          </div>
          <h4 style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700, fontSize: 16, color: C.dark, marginBottom: 8, lineHeight: 1.3 }}>
            {project.title}
          </h4>
          <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {project.description}
          </p>
        </div>
        {project.timeline && (
          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <ClockIcon color={C.muted} size={11} />
            <span style={{ fontSize: 11, color: C.muted }}>{project.timeline}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

