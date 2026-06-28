import { useNavigate } from "react-router-dom";
import { HelpCircleIcon } from "../../components/common/Icons";

const C = {
  brand: "#E35336",
  brandDk: "#B8391F",
  orange: "#F4A460",
  bg: "#FFF8F0",
  surface: "#FDFBF7",
  dark: "#2B1B12",
  muted: "#8C776A",
  border: "#E9DDD0",
};

export default function NotFound() {
  const navigate = useNavigate();

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
        className="notfound-card"
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
        <div style={{ display: "inline-flex", justifyContent: "center", width: "100%", marginBottom: "20px", color: C.brand }}>
          <HelpCircleIcon size={72} color="currentColor" />
        </div>

        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(32px, 8vw, 44px)",
            fontWeight: 800,
            color: C.dark,
            margin: "0 0 12px 0",
            lineHeight: 1.1,
          }}
        >
          Lost in Space?
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: C.muted,
            lineHeight: 1.6,
            marginBottom: "32px",
            margin: "0 0 32px 0",
          }}
        >
          We couldn't find the page you're looking for. It might have been moved, deleted, or never existed in the first place.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <button
            onClick={() => navigate("/dashboard")}
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
            Go to Dashboard
          </button>

          <button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: "transparent",
              color: C.dark,
              border: `2px solid ${C.dark}`,
              borderRadius: "9999px",
              padding: "12px 28px",
              fontSize: "15px",
              fontWeight: 800,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = C.dark;
              e.target.style.color = C.bg;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = C.dark;
            }}
          >
            {"\u2190"} Go Back
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
