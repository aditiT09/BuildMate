import { useState } from "react";
import { Link } from "react-router-dom";

const C = {
  brand:    "#E35336",
  brandDark:"#B8391F",
  bg:       "#FFF8F0",
  surface:  "#FDFBF7",
  dark:     "#2B1B12",
  muted:    "#8C776A",
  border:   "#E9DDD0",
  sandDark: "#EDD5B8",
  cream:    "#FBF5EE",
  accent1:  "#D4A882",
};

const UserIcon = ({ color = "currentColor", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

function SectionLabel({ children, light, icon, fontSize = 18 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, width: "100%" }}>
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

export default function ProfileCompleteness({ profile }) {
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
      background: C.surface, borderRadius: 24, padding: 36,
      border: `1px solid ${C.border}`, marginBottom: 28,
      animation: "slideUp 0.6s ease 0.45s both", opacity: 0,
      width: "100%",
      boxSizing: "border-box",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <SectionLabel icon={<UserIcon color={C.brand} size={18} />}>Profile Completeness</SectionLabel>
        <Link to="/profile" style={{ textDecoration: "none", flexShrink: 0 }}>
          <ActionBtn secondary>Complete profile →</ActionBtn>
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 12, borderRadius: 6, background: C.sandDark, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 6,
            background: pct >= 80
              ? "#2E7D32"
              : pct >= 50 ? "#D48A2D" : C.brand,
            width: `${pct}%`,
            transition: "width 1.5s ease",
            boxShadow: `0 0 10px ${pct >= 80 ? "#2E7D32" : pct >= 50 ? "#D48A2D" : C.brand}44`,
          }} />
        </div>
        <span style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 22, color: C.dark, minWidth: 52 }}>
          {pct}%
        </span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {fields.map(f => (
          <div key={f.label} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "6px 14px", borderRadius: 9999,
            background: f.done ? "#D4EDDA" : C.cream,
            border: `1px solid ${f.done ? "#C3E6CB" : C.border}`,
            fontSize: 12, fontWeight: 500,
            color: f.done ? "#155724" : C.muted,
          }}>
            <span style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: f.done ? "#2E7D32" : C.accent1,
              display: "inline-block"
            }} />
            {f.label}
          </div>
        ))}
      </div>

      {pct < 100 && (
        <p style={{ marginTop: 14, fontSize: 13, color: C.muted, fontStyle: "italic", margin: "14px 0 0 0" }}>
          A complete profile gets {Math.round((100 - pct) / 10 * 3)}x more visibility in matching — don't sleep on it
        </p>
      )}
    </div>
  );
}
