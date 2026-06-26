import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

import { getProjects } from "../../api/projects";
import { getProjectOpportunities } from "../../api/opportunities";
import { createApplication, getMyApplications } from "../../api/applications";
import Layout from "../../components/layout/Layout";
import { getErrorMessage } from "../../utils/validation";

const C = {
  brand:    "#E35336", brandDk: "#B8391F", orange: "#F4A460",
  bg:       "#FFF8F0", surface: "#FDFBF7", dark:   "#2B1B12",
  dark2:    "#4A372D", muted:   "#8C776A", border: "#E9DDD0",
  sand:     "#F5EDE0", sandDk:  "#EDD5B8", cream:  "#FBF5EE",
};

// 8 accent schemes — more variety across the board
const ACCENTS = [
  { bg: "#2B1B12", text: "#F4A460",  pill: "rgba(244,164,96,0.18)",  dark: true  },
  { bg: "#E35336", text: "#FFF8F0",  pill: "rgba(255,255,255,0.18)", dark: true  },
  { bg: "#4A372D", text: "#EDD5B8",  pill: "rgba(237,213,184,0.18)", dark: true  },
  { bg: "#F5EDE0", text: "#2B1B12",  pill: "rgba(43,27,18,0.09)",    dark: false },
  { bg: "#EDD5B8", text: "#2B1B12",  pill: "rgba(43,27,18,0.09)",    dark: false },
  { bg: "#FBF5EE", text: "#2B1B12",  pill: "rgba(43,27,18,0.07)",    dark: false },
  { bg: "#B8391F", text: "#FFE8DF",  pill: "rgba(255,232,223,0.18)", dark: true  },
  { bg: "#3D2B1F", text: "#F4A460",  pill: "rgba(244,164,96,0.15)",  dark: true  },
];

function ProjectIcon({ type, color = "currentColor", size = 20 }) {
  const lower = (type || "").toLowerCase();
  
  if (lower.includes("web")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    );
  }
  if (lower.includes("mobile") || lower.includes("app")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    );
  }
  if (lower.includes("ai") || lower.includes("ml") || lower.includes("brain")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
        <rect x="9" y="9" width="6" height="6"/>
        <line x1="9" y1="1" x2="9" y2="4"/>
        <line x1="15" y1="1" x2="15" y2="4"/>
        <line x1="9" y1="20" x2="9" y2="23"/>
        <line x1="15" y1="20" x2="15" y2="23"/>
        <line x1="20" y1="9" x2="23" y2="9"/>
        <line x1="20" y1="15" x2="23" y2="15"/>
        <line x1="1" y1="9" x2="4" y2="9"/>
        <line x1="1" y1="15" x2="4" y2="15"/>
      </svg>
    );
  }
  if (lower.includes("design") || lower.includes("art") || lower.includes("paint")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.04771 19.1891 5.05943 19.4984 4.88424 19.7022C4.38222 20.286 3.94522 20.8993 3.57867 21.534C3.41505 21.8173 3.61988 22 3.94784 22H12Z"/>
        <circle cx="7.5" cy="10.5" r="1.5"/>
        <circle cx="11.5" cy="7.5" r="1.5"/>
        <circle cx="16.5" cy="9.5" r="1.5"/>
      </svg>
    );
  }
  if (lower.includes("data") || lower.includes("stats") || lower.includes("analytics")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    );
  }
  if (lower.includes("game")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
        <rect x="2" y="6" width="20" height="12" rx="3"/>
        <line x1="6" y1="12" x2="10" y2="12"/>
        <line x1="8" y1="10" x2="8" y2="14"/>
        <line x1="15" y1="11" x2="15.01" y2="11"/>
        <line x1="18" y1="13" x2="18.01" y2="13"/>
      </svg>
    );
  }
  if (lower.includes("tool") || lower.includes("devops") || lower.includes("infra")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    );
  }
  if (lower.includes("saas") || lower.includes("cloud")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
        <path d="M18 10h-.01M17 10a5 5 0 0 0-8-4 5.96 5.96 0 0 0-1 4 4.5 4.5 0 0 0-.5 9h10.5a5.5 5.5 0 0 0 5.5-5.5A5.4 5.4 0 0 0 17 10z"/>
      </svg>
    );
  }
  if (lower.includes("social") || lower.includes("community") || lower.includes("collab") || lower.includes("people")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    );
  }
  if (lower.includes("fintech") || lower.includes("finance") || lower.includes("money") || lower.includes("crypto") || lower.includes("pay")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    );
  }
  if (lower.includes("edu") || lower.includes("book") || lower.includes("learn")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    );
  }
  if (lower.includes("health") || lower.includes("med") || lower.includes("fit")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    );
  }

  // Default: Rocket (startups, expo, hackathons, etc.)
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
      <path d="M4.5 16.5c-1.5 1.26-2 3.3-2 3.3s2.04-.5 3.3-2L18.5 5.5a4.24 4.24 0 1 0-6-6L4.5 16.5z"/>
      <path d="M12 15l-3-3m5.5 8.5L12 18l-3-3-2.5 2.5a1 1 0 0 0-.2.3l-1.5 4a.5.5 0 0 0 .6.6l4-1.5a1 1 0 0 0 .3-.2l2.5-2.5z"/>
    </svg>
  );
}

// Each card gets a deterministic "height class" for masonry variety
const getDescClamp = (id) => {
  const n = (id || 0) % 5;
  return [2, 4, 3, 5, 3][n];
};

const STYLES = `
  @keyframes popIn  { 0%{opacity:0;transform:translateY(16px) scale(0.97)} 100%{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes shimmer{ 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes heartB { 0%{transform:scale(1)} 35%{transform:scale(1.5)} 100%{transform:scale(1)} }
  @keyframes spin   { to{transform:rotate(360deg)} }
  @keyframes drawerOpen { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes toastPop{ from{opacity:0;transform:translate(-50%,16px)} to{opacity:1;transform:translate(-50%,0)} }

  .pin:hover { transform:translateY(-5px) !important; box-shadow:0 20px 56px rgba(43,27,18,0.16) !important; }
  .pin:hover .roles-btn { opacity:1 !important; }
  .fb:hover  { opacity:.8; }

  /* make filter pill active state not rely on Tailwind */
  .fpill       { cursor:pointer; transition:all .18s; }
  .fpill:hover { background:#2B1B12 !important; color:#F4A460 !important; border-color:#2B1B12 !important; }
  .fpill.on    { background:#2B1B12 !important; color:#F4A460 !important; border-color:#2B1B12 !important; }

  input:focus { outline:none !important; border-color:#E35336 !important; }
`;

function Toast({ msg, type }) {
  return (
    <div style={{
      position:"fixed", bottom:28, left:"50%", zIndex:9999,
      background: type==="success" ? "#2B1B12" : "#B8391F",
      color: type==="success" ? "#F4A460" : "white",
      padding:"11px 26px", borderRadius:9999,
      fontSize:13, fontWeight:700, fontFamily:'"DM Sans",sans-serif',
      boxShadow:"0 8px 32px rgba(0,0,0,0.22)",
      display:"flex", alignItems:"center", gap:8,
      animation:"toastPop .28s ease both",
    }}>
      {type==="success" ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      )}
      <span>{msg}</span>
    </div>
  );
}

function Skel({ h=200 }) {
  return <div style={{
    height:h, borderRadius:20, marginBottom:14,
    background:"linear-gradient(90deg,#f0e6da 25%,#f9f3ee 50%,#f0e6da 75%)",
    backgroundSize:"200% 100%", animation:"shimmer 1.4s infinite",
  }}/>;
}

function PinCard({ project, idx, appliedSet, onApply }) {
  const acc   = ACCENTS[idx % ACCENTS.length];
  const clamp = getDescClamp(project.id);

  const [liked,   setLiked]   = useState(false);
  const [heart,   setHeart]   = useState(false);
  const [opps,    setOpps]    = useState([]);
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [applying,setApplying]= useState(null);

  const toggleLike = (e) => {
    e.preventDefault(); e.stopPropagation();
    setLiked(l=>!l); setHeart(true); setTimeout(()=>setHeart(false),380);
  };

  const toggleRoles = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (open) { setOpen(false); return; }
    setLoading(true);
    try {
      const d = await getProjectOpportunities(project.id);
      setOpps(d); setOpen(true);
    } catch { setOpps([]); setOpen(true); }
    finally { setLoading(false); }
  };

  const apply = async (e, id) => {
    e.preventDefault(); e.stopPropagation();
    if (appliedSet.has(id)) return;
    setApplying(id);
    try { await onApply(id); } finally { setApplying(null); }
  };

  const dimText  = acc.dark ? "rgba(255,255,255,0.55)" : "rgba(43,27,18,0.5)";
  const dimBg    = acc.dark ? "rgba(255,255,255,0.1)"  : "rgba(43,27,18,0.07)";
  const divider  = acc.dark ? "rgba(255,255,255,0.08)" : "rgba(43,27,18,0.08)";

  return (
    <div className="pin" style={{
      borderRadius:22, overflow:"hidden", position:"relative",
      background:acc.bg, marginBottom:16,
      transition:"transform .22s ease, box-shadow .22s ease",
      animation:`popIn .4s ease ${(idx%6)*.07}s both`,
    }}>
      {/* Card body */}
      <div style={{ padding:"20px 20px 0" }}>

        {/* Top row */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
          <div style={{
            width:44, height:44, borderRadius:13,
            background:acc.pill,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <ProjectIcon type={project.project_type} size={20} color={acc.text} />
          </div>

          <button onClick={toggleLike} style={{
            width:34, height:34, borderRadius:"50%",
            background: liked ? "rgba(227,83,54,0.18)" : dimBg,
            border:"none", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            animation: heart ? "heartB .38s ease" : "none",
            transition:"background .18s",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? C.brand : "none"} stroke={liked ? C.brand : dimText} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        {/* Pills */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:10 }}>
          {project.project_type && (
            <span style={{
              background:acc.pill, color:acc.text,
              padding:"3px 11px", borderRadius:9999,
              fontSize:10, fontWeight:800,
              letterSpacing:".12em", textTransform:"uppercase",
              fontFamily:'"DM Sans",sans-serif',
            }}>{project.project_type}</span>
          )}
          {project.timeline && (
            <span style={{
              background:dimBg, color:dimText,
              padding:"3px 11px", borderRadius:9999,
              fontSize:10, fontWeight:600,
              fontFamily:'"DM Sans",sans-serif',
              display:"inline-flex", alignItems:"center", gap:4
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {project.timeline}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily:'"Syne",sans-serif', fontWeight:800,
          fontSize:"clamp(15px,1.5vw,20px)",
          color:acc.text, lineHeight:1.18, marginBottom:8,
        }}>{project.title}</h3>

        {/* Description */}
        <p style={{
          fontSize:12.5, lineHeight:1.65, marginBottom:16,
          color:dimText, fontFamily:'"DM Sans",sans-serif',
          display:"-webkit-box",
          WebkitLineClamp:clamp,
          WebkitBoxOrient:"vertical",
          overflow:"hidden",
        }}>{project.description}</p>
      </div>

      {/* Roles drawer */}
      {open && (
        <div style={{
          background:"rgba(0,0,0,0.14)",
          padding:"12px 20px",
          display:"flex", flexDirection:"column", gap:7,
          animation:"drawerOpen .22s ease both",
        }}>
          {opps.length === 0 ? (
            <p style={{ fontSize:12, color:dimText, fontStyle:"italic", fontFamily:'"DM Sans",sans-serif' }}>No open roles yet</p>
          ) : opps.map(o => {
            const done = appliedSet.has(o.id);
            const busy = applying === o.id;
            return (
              <div key={o.id} style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                background:"rgba(255,255,255,0.08)", borderRadius:10, padding:"8px 12px", gap:8,
              }}>
                <div>
                  <p style={{ fontSize:13, fontWeight:600, color:acc.text, fontFamily:'"DM Sans",sans-serif' }}>{o.role}</p>
                  <p style={{ fontSize:11, color:dimText, fontFamily:'"DM Sans",sans-serif' }}>
                    {o.seats} seat{o.seats!==1?"s":""} · {o.status}
                  </p>
                </div>
                <button
                  onClick={(e)=>apply(e,o.id)}
                  disabled={done||busy||o.status!=="open"}
                  style={{
                    background: done ? "rgba(255,255,255,0.12)" : C.brand,
                    color: done ? dimText : "white",
                    border:"none", borderRadius:9999,
                    padding:"6px 14px", fontSize:11, fontWeight:700,
                    cursor: done?"default":"pointer",
                    fontFamily:'"DM Sans",sans-serif',
                    transition:"all .18s", flexShrink:0,
                    opacity: o.status!=="open" ? .5 : 1,
                  }}
                  onMouseEnter={e=>{ if(!done) e.currentTarget.style.background=C.brandDk }}
                  onMouseLeave={e=>{ if(!done) e.currentTarget.style.background=C.brand }}
                >
                  {busy ? <span style={{display:"inline-block",width:10,height:10,borderRadius:"50%",border:"2px solid currentColor",borderTopColor:"transparent",animation:"spin .7s linear infinite"}}/> : done ? "✓ Applied" : "Apply"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div style={{
        padding:"12px 20px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        borderTop:`1px solid ${divider}`,
      }}>
        <Link to={`/projects/${project.id}`} onClick={e=>e.stopPropagation()} style={{ textDecoration:"none" }}>
          <button className="fb" style={{
            background:dimBg, color:acc.text, border:"none",
            borderRadius:9999, padding:"7px 15px",
            fontSize:12, fontWeight:700, cursor:"pointer",
            fontFamily:'"DM Sans",sans-serif', transition:"opacity .18s",
          }}>View →</button>
        </Link>

        <button
          className="fb"
          onClick={toggleRoles}
          disabled={loading}
          style={{
            background: open ? C.brand : dimBg,
            color: open ? "white" : acc.text,
            border:"none", borderRadius:9999,
            padding:"7px 15px", fontSize:12, fontWeight:700,
            cursor:"pointer", fontFamily:'"DM Sans",sans-serif',
            transition:"all .18s",
            display:"flex", alignItems:"center", gap:5,
          }}
        >
          {loading
            ? <span style={{display:"inline-block",width:10,height:10,borderRadius:"50%",border:"2px solid currentColor",borderTopColor:"transparent",animation:"spin .7s linear infinite"}}/>
            : open ? "▲ Close" : "🎯 Roles"
          }
        </button>
      </div>
    </div>
  );
}

export default function ProjectSwipe() {
  const [projects,    setProjects]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [filter,      setFilter]      = useState("All");
  const [search,      setSearch]      = useState("");
  const [appliedSet,  setAppliedSet]  = useState(new Set());
  const [toast,       setToast]       = useState(null);
  const [cols,        setCols]        = useState(4);

  useEffect(() => {
    const upd = () => {
      const w = window.innerWidth;
      setCols(w<600?1:w<900?2:w<1200?3:4);
    };
    upd();
    window.addEventListener("resize",upd);
    return ()=>window.removeEventListener("resize",upd);
  },[]);

  useEffect(() => {
    Promise.all([
      getProjects().then(d=>setProjects(d)).catch(()=>{}).finally(()=>setLoading(false)),
      getMyApplications().then(d=>setAppliedSet(new Set(d.map(a=>a.opportunity_id)))).catch(()=>{}),
    ]);
  },[]);


  const fire = useCallback((msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleApply = useCallback(async (oppId) => {
    try {
      await createApplication(oppId);
      setAppliedSet(p => new Set([...p, oppId]));
      fire("Applied! You're in the game", "success");
    } catch (e) {
      fire(getErrorMessage(e?.response?.data?.detail) || "Couldn't apply — try again", "error");
    }
  }, [fire]);


  const types     = ["All",...new Set(projects.map(p=>p.project_type).filter(Boolean))];
  const filtered  = projects.filter(p => {
    const ft = filter==="All" || p.project_type===filter;
    const fs = !search || [p.title,p.description].join(" ").toLowerCase().includes(search.toLowerCase());
    return ft&&fs;
  });

  // Distribute into columns (true masonry: column by column)
  const columns = Array.from({length:cols},()=>[]);
  filtered.forEach((p,i)=>columns[i%cols].push({p,i}));

  return (
    <Layout>
      <style>{STYLES}</style>

      <div style={{ minHeight:"100vh", background:C.bg }}>
        <div style={{ maxWidth:1400, margin:"0 auto", padding:"28px 24px 60px" }}>

          {/* ── Header ── */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:16, alignItems:"flex-end", marginBottom:28 }}>
            <div>
              <p style={{ fontSize:10, fontWeight:800, letterSpacing:".22em", textTransform:"uppercase", color:C.brand, marginBottom:6, fontFamily:'"DM Sans",sans-serif' }}>
                ✦ Discover
              </p>
              <h1 style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700, lineHeight:.9, color:C.dark, margin:0 }}>
                <span style={{ fontSize:"clamp(32px,4vw,56px)", display:"block" }}>Find your</span>
                <span style={{ fontSize:"clamp(36px,5vw,66px)", color:C.brand, display:"block" }}>
                  next build.
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ display: "inline-block", verticalAlign: "middle", marginLeft: 8 }}>
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </span>
              </h1>
              <p style={{ fontSize:14, color:C.muted, marginTop:8, fontStyle:"italic", fontFamily:'"Cormorant Garamond",serif' }}>
                {loading ? "Loading..." : `${filtered.length} project${filtered.length!==1?"s":""} waiting for someone exactly like you`}
              </p>
            </div>
            <Link to="/create-project" style={{ textDecoration:"none" }}>
              <button style={{
                background:C.dark, color:C.orange, border:"none",
                borderRadius:9999, padding:"11px 24px",
                fontSize:13, fontWeight:700, cursor:"pointer",
                fontFamily:'"DM Sans",sans-serif',
                display:"flex", alignItems:"center", gap:6,
                boxShadow:"0 4px 16px rgba(43,27,18,0.16)",
                transition:"all .2s",
                whiteSpace:"nowrap",
              }}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
              >
                <span style={{ fontSize:15 }}>+</span> Post a Project
              </button>
            </Link>
          </div>

          {/* ── Search ── */}
          <div style={{ position:"relative", maxWidth:460, marginBottom:14 }}>
            <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:C.muted, pointerEvents:"none", display:"flex" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              value={search}
              onChange={e=>setSearch(e.target.value)}
              placeholder="Search projects, types, keywords..."
              style={{
                width:"100%", padding:"11px 14px 11px 42px",
                border:`1.5px solid ${C.border}`, borderRadius:9999,
                background:C.surface, fontSize:13, color:C.dark,
                fontFamily:'"DM Sans",sans-serif',
                boxShadow:"0 2px 8px rgba(43,27,18,0.05)",
                transition:"border-color .2s",
              }}
            />
            {search && (
              <button onClick={()=>setSearch("")} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:14, color:C.muted }}>✕</button>
            )}
          </div>

          {/* ── Filter pills ── */}
          <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:24 }}>
            {types.map(t=>(
              <button
                key={t}
                className={`fpill${filter===t?" on":""}`}
                onClick={()=>setFilter(t)}
                style={{
                  border:`1.5px solid ${C.border}`,
                  background:C.surface, color:C.dark2,
                  borderRadius:9999, padding:"6px 16px",
                  fontSize:12, fontWeight:700,
                  fontFamily:'"DM Sans",sans-serif',
                  letterSpacing:".02em",
                  display:"inline-flex", alignItems:"center", gap:6,
                }}
              >
                {t==="All" ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ) : (
                  <ProjectIcon type={t} size={13} color="currentColor" />
                )}
                {t}
              </button>
            ))}
          </div>

          {/* ── Masonry grid ── */}
          {loading ? (
            <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap:16, alignItems:"start" }}>
              {Array(cols*3).fill(0).map((_,i)=>(
                <Skel key={i} h={180+(i%4)*60}/>
              ))}
            </div>
          ) : filtered.length===0 ? (
            <div style={{ textAlign:"center", padding:"80px 20px" }}>
              <div style={{ display: "inline-flex", color: C.muted, marginBottom: 16 }}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </div>
              <h3 style={{ fontFamily:'"Syne",sans-serif', fontWeight:800, fontSize:22, color:C.dark, marginBottom:8 }}>no results, bestie</h3>
              <p style={{ color:C.muted, fontSize:14, marginBottom:20 }}>Try different keywords or clear filters</p>
              <button onClick={()=>{setSearch("");setFilter("All");}} style={{ background:C.brand, color:"white", border:"none", borderRadius:9999, padding:"9px 26px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:'"DM Sans",sans-serif' }}>
                Clear filters
              </button>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap:16, alignItems:"start" }}>
              {columns.map((col,ci)=>(
                <div key={ci}>
                  {col.map(({p,i})=>(
                    <PinCard key={p.id} project={p} idx={i} appliedSet={appliedSet} onApply={handleApply}/>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* ── Bottom CTA ── */}
          {!loading && filtered.length>0 && (
            <div style={{
              marginTop:48, background:C.dark, borderRadius:24,
              padding:"36px 32px", textAlign:"center",
            }}>
              <p style={{
                fontSize:10, fontWeight:800, letterSpacing:".22em", textTransform:"uppercase", color:C.orange, marginBottom:8, fontFamily:'"DM Sans",sans-serif',
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ display: "block" }}>
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                don't just scroll
              </p>
              <h2 style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700, fontSize:"clamp(26px,3.5vw,46px)", color:"#FFF8F0", marginBottom:8, lineHeight:1.1 }}>
                Every project you join keeps<br/>your GitHub green
              </h2>
              <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginBottom:22, fontFamily:'"DM Sans",sans-serif' }}>Real work. Real commits. Real resume material.</p>
              <Link to="/create-project" style={{ textDecoration:"none" }}>
                <button style={{
                  background:C.brand, color:"white", border:"none",
                  borderRadius:9999, padding:"12px 34px",
                  fontSize:14, fontWeight:700, cursor:"pointer",
                  fontFamily:'"DM Sans",sans-serif',
                  boxShadow:`0 0 24px ${C.brand}44`,
                  transition:"all .2s",
                }}
                  onMouseEnter={e=>{e.currentTarget.style.background=C.brandDk;e.currentTarget.style.transform="translateY(-2px)"}}
                  onMouseLeave={e=>{e.currentTarget.style.background=C.brand;e.currentTarget.style.transform="translateY(0)"}}
                >
                  Post your own project →
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type}/>}
    </Layout>
  );
}