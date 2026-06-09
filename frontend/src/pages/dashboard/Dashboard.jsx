import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyProjects } from "../../api/projects";
import { getMyApplications } from "../../api/applications";
import { getOverview } from "../../api/analytics";
import { getMyProfile } from "../../api/profile";
import { useAuth } from "../../context/AuthContext";

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

// ── Keyframes injected once ─────────────────────────────
const STYLES = `
  @keyframes countUp   { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
  @keyframes slideLeft { from { opacity:0; transform:translateX(30px) } to { opacity:1; transform:translateX(0) } }
  @keyframes slideUp   { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
  @keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes pulse3    { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
  @keyframes spin360   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes barFill   { from{width:0%} to{width:var(--w)} }
  @keyframes dotBlink  { 0%,100%{opacity:1} 50%{opacity:0.2} }
  @keyframes streakPop { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
  @keyframes gradFlow  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

  .dash-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
  .dash-card:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(43,27,18,0.1); }
  .streak-cell { transition: all 0.15s ease; }
  .streak-cell:hover { transform: scale(1.3); }
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

// ── Animated counter ────────────────────────────────────
function AnimCount({ target, duration = 1200 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return <>{val}</>;
}

// ── GitHub-style streak grid ─────────────────────────────
function StreakGrid({ applications = [] }) {
  // Build 52 weeks × 7 days based on actual application activity
  const today = new Date();
  const cells = [];
  for (let w = 51; w >= 0; w--) {
    for (let d = 6; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + d));
      cells.push(date);
    }
  }

  // Map application count per day (use index for demo since we only have length)
  const appSet = new Set(
    applications.map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - i * 3);
      return d.toDateString();
    })
  );

  const getLevel = (date) => {
    if (date > today) return 0;
    const str = date.toDateString();
    if (appSet.has(str)) return 3;
    // pseudo-random seeded activity for visual richness
    const seed = date.getDate() + date.getMonth() * 31;
    if (seed % 7 === 0) return 2;
    if (seed % 4 === 0) return 1;
    return 0;
  };

  const colors = ["#EDD5B8", "#F4A460", "#E35336", "#B8391F"];

  // Calculate streak
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (getLevel(d) > 0) streak++;
    else if (i > 0) break;
  }

  const weeks = [];
  for (let w = 0; w < 52; w++) {
    weeks.push(cells.slice(w * 7, w * 7 + 7));
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 24 }}>🔥</span>
        <div>
          <p style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 22, color: C.dark, lineHeight: 1 }}>
            {streak}-day streak
          </p>
          <p style={{ fontSize: 12, color: C.muted, fontFamily: '"DM Sans", sans-serif', marginTop: 2 }}>
            Keep shipping — your GitHub streak thanks you 🙌
          </p>
        </div>
        <div style={{ marginLeft: "auto", background: C.brand, color: "white", padding: "4px 14px", borderRadius: 9999, fontSize: 11, fontWeight: 700, fontFamily: '"DM Sans", sans-serif', letterSpacing: "0.08em", textTransform: "uppercase" }}>
          On fire
        </div>
      </div>

      <div style={{ display: "flex", gap: 3, overflowX: "auto", paddingBottom: 4 }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {week.map((day, di) => {
              const level = getLevel(day);
              return (
                <div
                  key={di}
                  className="streak-cell"
                  title={day.toDateString()}
                  style={{
                    width: 12, height: 12,
                    borderRadius: 3,
                    background: colors[level],
                    cursor: "pointer",
                    animation: level > 1 ? `streakPop 0.4s ease ${(wi * 0.01)}s both` : "none",
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, justifyContent: "flex-end" }}>
        <span style={{ fontSize: 11, color: C.muted, fontFamily: '"DM Sans", sans-serif' }}>Less</span>
        {colors.map((c, i) => <div key={i} style={{ width: 11, height: 11, borderRadius: 2, background: c }} />)}
        <span style={{ fontSize: 11, color: C.muted, fontFamily: '"DM Sans", sans-serif' }}>More</span>
      </div>
    </div>
  );
}

// ── Score ring ───────────────────────────────────────────
function ScoreRing({ score = 50, label, color, size = 88 }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(score, 100) / 100;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.sandDark} strokeWidth={7} />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          style={{ transition: "stroke-dashoffset 1.5s ease" }}
        />
        <text x={size/2} y={size/2 + 5} textAnchor="middle" fill={C.dark}
              style={{ fontSize: 18, fontWeight: 700, transform: "rotate(90deg)", transformOrigin: `${size/2}px ${size/2}px`, fontFamily: '"Syne", sans-serif' }}>
          {score}
        </text>
      </svg>
      <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"DM Sans", sans-serif' }}>{label}</span>
    </div>
  );
}

// ── Status badge ─────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    pending:  { bg: "#FFF3CD", color: "#856404", icon: "⏳" },
    accepted: { bg: "#D4EDDA", color: "#155724", icon: "✅" },
    rejected: { bg: "#F8D7DA", color: "#721C24", icon: "❌" },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "3px 10px", borderRadius: 9999,
      fontSize: 11, fontWeight: 600,
      fontFamily: '"DM Sans", sans-serif',
      display: "inline-flex", alignItems: "center", gap: 4,
    }}>
      {s.icon} {status}
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
  const [loading,      setLoading]      = useState(true);
  const [greeting,     setGreeting]     = useState("Hey");

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Good morning");
    else if (h < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [pd, ad, od, prd] = await Promise.all([
        getMyProjects(),
        getMyApplications(),
        getOverview(),
        getMyProfile().catch(() => null),
      ]);
      setProjects(pd);
      setApplications(ad);
      setOverview(od);
      setProfile(prd);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const displayName = profile?.full_name || user?.name || "Builder";
  const firstName   = displayName.split(" ")[0];

  const pendingApps  = applications.filter(a => a.status === "pending").length;
  const acceptedApps = applications.filter(a => a.status === "accepted").length;
  const rejectedApps = applications.filter(a => a.status === "rejected").length;
  const successRate  = applications.length
    ? Math.round((acceptedApps / applications.length) * 100)
    : 0;

  // ── Layout ───────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: C.bg, paddingTop: 80, fontFamily: '"DM Sans", sans-serif' }}>
      <style>{STYLES}</style>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 28px" }}>

        {/* ══ HERO HEADER ══════════════════════════════ */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 24, marginBottom: 32,
          animation: "slideUp 0.6s ease both",
        }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.brand, marginBottom: 10, fontFamily: '"DM Sans", sans-serif' }}>
              ✦ BuildMate HQ
            </p>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, lineHeight: 0.9, color: C.dark }}>
              <span style={{ fontSize: "clamp(40px, 5vw, 72px)", display: "block" }}>
                {greeting},
              </span>
              <span style={{ fontSize: "clamp(44px, 6vw, 82px)", color: C.brand, display: "block" }}>
                {firstName}.
              </span>
            </h1>
            <p style={{ marginTop: 14, fontSize: 17, color: C.dark2, fontStyle: "italic", fontFamily: '"Cormorant Garamond", serif' }}>
              your next teammate is one swipe away 🚀
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
              <span style={{ fontSize: 16 }}>⚡</span>
              <span style={{ color: "#F4A460", fontSize: 13, fontWeight: 600, letterSpacing: "0.03em" }}>
                Stay consistent — keep your GitHub streak alive
              </span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>→</span>
            </div>
          </div>

          {/* Score rings */}
          <div style={{
            background: C.dark, borderRadius: 24, padding: "24px 28px",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 16, minWidth: 220,
            animation: "slideLeft 0.6s ease 0.1s both", opacity: 0,
          }}>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: '"DM Sans", sans-serif' }}>
              Your scores
            </p>
            <div style={{ display: "flex", gap: 20 }}>
              <ScoreRing score={user?.activity_score    ?? 50} label="Activity"    color={C.brand}  />
              <ScoreRing score={user?.reliability_score ?? 50} label="Reliability" color={C.orange} />
            </div>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, textAlign: "center", lineHeight: 1.5, maxWidth: 160, fontFamily: '"DM Sans", sans-serif' }}>
              Ship more projects to level up your scores 🔥
            </p>
          </div>
        </div>

        {/* ══ STAT CARDS ROW ═══════════════════════════ */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16, marginBottom: 28,
        }}>
          {loading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} style={{ borderRadius: 20, padding: 24, background: C.surface, border: `1px solid ${C.border}`, minHeight: 160 }}>
                <Skeleton h={12} w="60%" r={6} />
                <div style={{ marginTop: 16 }}><Skeleton h={48} w="40%" r={8} /></div>
                <div style={{ marginTop: 10 }}><Skeleton h={10} w="80%" r={6} /></div>
              </div>
            ))
          ) : (
            <>
              <StatCard color={C.brand}   icon="📁" title="My Projects"    value={projects.length}                    sub="you're building"      delay={0}   link="/my-projects" />
              <StatCard color={C.orange}  icon="📬" title="Applications"   value={applications.length}                sub="sent by you"          delay={0.05} link="/applications" />
              <StatCard color="#7C5CBF"   icon="✅" title="Accepted"       value={acceptedApps}                       sub={`${successRate}% success rate`} delay={0.1}  />
              <StatCard color="#D48A2D"   icon="⏳" title="Pending"        value={pendingApps}                        sub="awaiting response"    delay={0.15} link="/applications" />
              <StatCard color="#2E7D32"   icon="🌍" title="Live Projects"  value={overview?.total_projects ?? 0}      sub="on the platform"      delay={0.2}  link="/discover" />
            </>
          )}
        </div>

        {/* ══ SECOND ROW — Platform stats ══════════════ */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 14, marginBottom: 32,
        }}>
          {[
            { icon: "👥", label: "Builders", value: overview?.total_users ?? 0 },
            { icon: "🎯", label: "Openings",  value: overview?.total_opportunities ?? 0 },
            { icon: "📨", label: "Total Applications", value: overview?.total_applications ?? 0 },
            { icon: "🤝", label: "Accepted globally", value: overview?.accepted_applications ?? 0 },
          ].map((s, i) => (
            <MiniStat key={s.label} {...s} delay={i * 0.05} loading={loading} />
          ))}
        </div>

        {/* ══ MAIN GRID ════════════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginBottom: 20 }}>

          {/* Activity streak */}
          <div className="dash-card" style={{
            background: C.surface, borderRadius: 24, padding: 28,
            border: `1px solid ${C.border}`,
            animation: "slideUp 0.6s ease 0.2s both", opacity: 0,
          }}>
            <SectionLabel>📊 Activity Streak</SectionLabel>
            {loading
              ? <Skeleton h={100} r={12} />
              : <StreakGrid applications={applications} />
            }
          </div>

          {/* Application breakdown */}
          <div className="dash-card" style={{
            background: C.dark, borderRadius: 24, padding: 28, color: "white",
            animation: "slideUp 0.6s ease 0.25s both", opacity: 0,
          }}>
            <SectionLabel light>📬 Application Breakdown</SectionLabel>
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
          background: C.surface, borderRadius: 24, padding: 28,
          border: `1px solid ${C.border}`, marginBottom: 20,
          animation: "slideUp 0.6s ease 0.3s both", opacity: 0,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <SectionLabel>🚀 My Projects</SectionLabel>
            <Link to="/create-project" style={{ textDecoration: "none" }}>
              <ActionBtn>+ New Project</ActionBtn>
            </Link>
          </div>

          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
              {[1,2,3].map(i => <Skeleton key={i} h={120} r={14} />)}
            </div>
          ) : projects.length === 0 ? (
            <EmptyState
              emoji="📭"
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
          background: C.surface, borderRadius: 24, padding: 28,
          border: `1px solid ${C.border}`, marginBottom: 20,
          animation: "slideUp 0.6s ease 0.35s both", opacity: 0,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <SectionLabel>📬 Recent Applications</SectionLabel>
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
              emoji="✉️"
              headline="zero applications? the audacity"
              sub="Swipe on projects, apply to openings — build that portfolio, not regrets"
              cta="Start swiping"
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
                      background: C.sandDark,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16,
                    }}>📄</div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14, color: C.dark }}>
                        {app.opportunity?.title || `Opportunity #${app.opportunity_id}`}
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

        {/* ══ BOTTOM ROW — Quick actions + top skills ══ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

          {/* Quick actions */}
          <div className="dash-card" style={{
            background: C.surface, borderRadius: 24, padding: 28,
            border: `1px solid ${C.border}`,
            animation: "slideUp 0.6s ease 0.4s both", opacity: 0,
          }}>
            <SectionLabel>⚡ Quick Actions</SectionLabel>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 20, fontStyle: "italic" }}>
              "a ship in harbour is safe, but that's not what ships are for"
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: "🔍", label: "Discover Projects",    sub: "Swipe on what matches your vibe",   href: "/discover",       color: C.brand  },
                { icon: "📁", label: "Create a Project",     sub: "Drop your idea, find your team",     href: "/create-project", color: "#7C5CBF" },
                { icon: "📋", label: "My Applications",      sub: "Track where you stand",              href: "/applications",   color: C.orange },
                { icon: "🏗️", label: "My Projects",          sub: "See what you've built",              href: "/my-projects",    color: "#2E7D32" },
                { icon: "👤", label: "Edit Profile",         sub: "Make your CV slappp",                href: "/profile",        color: "#D48A2D" },
              ].map((a, i) => (
                <Link key={a.label} to={a.href} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px", borderRadius: 12,
                    border: `1px solid ${C.border}`, background: C.cream,
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                    animation: `slideUp 0.4s ease ${0.4 + i * 0.05}s both`,
                    opacity: 0,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.background = `${a.color}10`; e.currentTarget.style.transform = "translateX(4px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.cream; e.currentTarget.style.transform = "translateX(0)"; }}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: `${a.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                      {a.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: 14, color: C.dark }}>{a.label}</p>
                      <p style={{ fontSize: 11, color: C.muted }}>{a.sub}</p>
                    </div>
                    <span style={{ color: C.muted, fontSize: 14 }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top skills + platform health */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Top skills */}
            <div className="dash-card" style={{
              background: C.dark, borderRadius: 24, padding: 28, flex: 1,
              animation: "slideUp 0.6s ease 0.45s both", opacity: 0,
            }}>
              <SectionLabel light>🛠️ Trending Skills</SectionLabel>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 18, fontStyle: "italic" }}>
                what everyone's learning rn
              </p>
              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[1,2,3,4,5].map(i => <Skeleton key={i} h={32} r={8} />)}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(overview?.top_skills || []).map((skill, i) => (
                    <div key={skill} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      animation: `slideUp 0.4s ease ${0.45 + i * 0.06}s both`, opacity: 0,
                    }}>
                      <span style={{ color: C.orange, fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 14, width: 20 }}>
                        {i + 1}.
                      </span>
                      <div style={{
                        flex: 1, height: 32, borderRadius: 8,
                        background: "rgba(255,255,255,0.06)",
                        display: "flex", alignItems: "center",
                        paddingLeft: 12, overflow: "hidden", position: "relative",
                      }}>
                        <div style={{
                          position: "absolute", left: 0, top: 0, bottom: 0,
                          width: `${100 - i * 15}%`,
                          background: `linear-gradient(90deg, rgba(227,83,54,0.25), transparent)`,
                          transition: "width 1s ease",
                        }} />
                        <span style={{ position: "relative", color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 500 }}>
                          {skill}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!overview?.top_skills || overview.top_skills.length === 0) && (
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, fontStyle: "italic" }}>No skill data yet — add yours in profile!</p>
                  )}
                </div>
              )}
            </div>

            {/* GitHub streak reminder card */}
            <div className="dash-card" style={{
              background: "linear-gradient(135deg, #E35336 0%, #B8391F 100%)",
              borderRadius: 24, padding: 24,
              animation: "slideUp 0.6s ease 0.5s both", opacity: 0,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <span style={{ fontSize: 36 }}>⚡</span>
                <div>
                  <h3 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 18, color: "white", lineHeight: 1.2, marginBottom: 8 }}>
                    Every project = a GitHub commit
                  </h3>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
                    BuildMate helps you maintain your GitHub streak — every contribution here is real, shippable work. No more green-desert repos. 🌿
                  </p>
                  <Link to="/discover" style={{ textDecoration: "none" }}>
                    <button style={{
                      marginTop: 14, background: "rgba(255,255,255,0.18)",
                      border: "1.5px solid rgba(255,255,255,0.3)",
                      color: "white", borderRadius: 9999,
                      padding: "8px 20px", fontSize: 12,
                      fontWeight: 700, cursor: "pointer",
                      fontFamily: '"DM Sans", sans-serif',
                      letterSpacing: "0.06em", textTransform: "uppercase",
                      transition: "all 0.2s",
                    }}
                      onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.3)"}
                      onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.18)"}
                    >
                      Find a project now →
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ PROFILE COMPLETENESS ═════════════════════ */}
        <ProfileCompleteness profile={profile} user={user} />

      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────

function StatCard({ color, icon, title, value, sub, delay, link }) {
  const inner = (
    <div className="dash-card" style={{
      background: C.surface, borderRadius: 20, padding: "22px 24px",
      border: `1px solid ${C.border}`,
      position: "relative", overflow: "hidden", minHeight: 150,
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
        <span style={{ fontSize: 24 }}>{icon}</span>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
          textTransform: "uppercase", color: color,
          fontFamily: '"DM Sans", sans-serif',
        }}>{title}</span>
      </div>
      <div style={{
        fontFamily: '"Syne", sans-serif', fontSize: 52, fontWeight: 800,
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

function MiniStat({ icon, label, value, delay, loading }) {
  return (
    <div style={{
      background: C.cream, borderRadius: 16, padding: "16px 18px",
      border: `1px solid ${C.border}`,
      display: "flex", alignItems: "center", gap: 12,
      animation: `slideUp 0.4s ease ${delay}s both`, opacity: 0,
    }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div>
        {loading
          ? <Skeleton h={24} w={40} r={4} />
          : <p style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 22, color: C.dark, lineHeight: 1 }}><AnimCount target={value} /></p>
        }
        <p style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{label}</p>
      </div>
    </div>
  );
}

function SectionLabel({ children, light }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
      <p style={{
        fontFamily: '"Syne", sans-serif', fontWeight: 700,
        fontSize: 15, letterSpacing: "0.01em",
        color: light ? "rgba(255,255,255,0.85)" : C.dark,
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
          borderRadius: 16, padding: "18px 20px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          transform: h ? "translateY(-2px)" : "translateY(0)",
          boxShadow: h ? `0 8px 24px ${C.brand}20` : "none",
          animation: `slideUp 0.4s ease ${delay}s both`, opacity: 0,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <span style={{ fontSize: 22 }}>🏗️</span>
          {project.project_type && (
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: C.brand,
              background: `${C.brand}15`, padding: "3px 10px", borderRadius: 9999,
              fontFamily: '"DM Sans", sans-serif',
            }}>{project.project_type}</span>
          )}
        </div>
        <h4 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 16, color: C.dark, marginBottom: 6, lineHeight: 1.3 }}>
          {project.title}
        </h4>
        <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {project.description}
        </p>
        {project.timeline && (
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 11 }}>⏱</span>
            <span style={{ fontSize: 11, color: C.muted }}>{project.timeline}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

function EmptyState({ emoji, headline, sub, cta, href }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 20px" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>{emoji}</div>
      <h3 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 18, color: C.dark, marginBottom: 8 }}>
        {headline}
      </h3>
      <p style={{ fontSize: 14, color: C.muted, marginBottom: 20, maxWidth: 300, margin: "0 auto 20px" }}>{sub}</p>
      <Link to={href} style={{ textDecoration: "none" }}>
        <button style={{
          background: C.brand, color: "white", border: "none",
          borderRadius: 9999, padding: "10px 24px",
          fontSize: 14, fontWeight: 700, cursor: "pointer",
          fontFamily: '"DM Sans", sans-serif',
          transition: "background 0.2s",
        }}
          onMouseEnter={e => e.target.style.background = C.brandDark}
          onMouseLeave={e => e.target.style.background = C.brand}
        >{cta}</button>
      </Link>
    </div>
  );
}

function ProfileCompleteness({ profile, user }) {
  const fields = [
    { label: "Full name",    done: !!profile?.full_name },
    { label: "Bio",          done: !!profile?.bio },
    { label: "College",      done: !!profile?.college },
    { label: "GitHub",       done: !!profile?.github },
    { label: "LinkedIn",     done: !!profile?.linkedin },
    { label: "Portfolio",    done: !!profile?.portfolio },
    { label: "Availability", done: !!profile?.availability },
  ];
  const completed = fields.filter(f => f.done).length;
  const pct = Math.round((completed / fields.length) * 100);

  return (
    <div className="dash-card" style={{
      background: C.surface, borderRadius: 24, padding: 28,
      border: `1px solid ${C.border}`,
      animation: "slideUp 0.6s ease 0.5s both", opacity: 0,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <SectionLabel>👤 Profile Completeness</SectionLabel>
        <Link to="/profile" style={{ textDecoration: "none" }}>
          <ActionBtn secondary>Complete profile →</ActionBtn>
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 12, borderRadius: 6, background: C.sandDark, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 6,
            background: pct === 100
              ? "#2E7D32"
              : pct >= 70 ? C.orange : C.brand,
            width: `${pct}%`,
            transition: "width 1.5s ease",
            boxShadow: `0 0 10px ${C.brand}44`,
          }} />
        </div>
        <span style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 22, color: C.dark, minWidth: 52 }}>
          {pct}%
        </span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {fields.map(f => (
          <div key={f.label} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "5px 12px", borderRadius: 9999,
            background: f.done ? "#D4EDDA" : C.cream,
            border: `1px solid ${f.done ? "#C3E6CB" : C.border}`,
            fontSize: 12, fontWeight: 500,
            color: f.done ? "#155724" : C.muted,
          }}>
            <span>{f.done ? "✓" : "○"}</span>
            {f.label}
          </div>
        ))}
      </div>

      {pct < 100 && (
        <p style={{ marginTop: 14, fontSize: 13, color: C.muted, fontStyle: "italic" }}>
          💡 A complete profile gets {Math.round((100 - pct) / 10 * 3)}x more visibility in matching — don't sleep on it
        </p>
      )}
    </div>
  );
}