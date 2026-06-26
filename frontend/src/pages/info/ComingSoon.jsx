import { useNavigate, useLocation } from "react-router-dom";

const C = {
  brand: "#E35336",
  brandDk: "#B8391F",
  bg: "#FFF8F0",
  surface: "#FDFBF7",
  dark: "#2B1B12",
  muted: "#8C776A",
};

const DocumentIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E35336" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 20 }}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const ShieldIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E35336" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 20 }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default function ComingSoon() {
  const navigate = useNavigate();
  const location = useLocation();
  const isPrivacy = location.pathname.includes("privacy");

  const title = isPrivacy ? "Privacy Policy" : "Terms of Service";
  const icon = isPrivacy ? ShieldIcon : DocumentIcon;
  const description = isPrivacy
    ? "We are currently drafting our Privacy Policy to ensure your personal data is handled with maximum care and transparency. Check back soon for the official release."
    : "We are finalizing our Terms of Service to establish clear guidelines for projects, builders, and collaborations. Check back soon for the official update.";

  return (
    <div
      style={{
        backgroundColor: C.bg,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        boxSizing: "border-box",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        className="comingsoon-card"
        style={{
          backgroundColor: C.surface,
          border: `2px solid ${C.dark}`,
          borderRadius: "32px",
          padding: "48px 32px",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          boxShadow: `8px 8px 0px ${C.dark}`,
          animation: "floatUp 0.5s ease both",
        }}
      >
        <div style={{ display: "inline-block" }}>
          {icon}
        </div>

        <h1
          style={{
            fontFamily: '"Melody by W.", "Melody", sans-serif',
            fontSize: "clamp(28px, 6vw, 36px)",
            fontWeight: 800,
            color: C.dark,
            margin: "0 0 12px 0",
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>

        <div
          style={{
            display: "inline-block",
            backgroundColor: "rgba(227, 83, 54, 0.1)",
            color: C.brand,
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "6px 16px",
            borderRadius: "9999px",
            marginBottom: "20px",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Coming Soon
        </div>

        <p
          style={{
            fontSize: "15px",
            color: C.muted,
            lineHeight: 1.6,
            marginBottom: "32px",
            margin: "0 0 32px 0",
          }}
        >
          {description}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: C.brand,
              color: "white",
              border: "none",
              borderRadius: "9999px",
              padding: "14px 28px",
              fontSize: "15px",
              fontWeight: 800,
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: `0 4px 12px ${C.brand}33`,
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = C.brandDk)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = C.brand)}
          >
            ← Go Back
          </button>
        </div>
      </div>
      <style>{`
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
