import { Link } from "react-router-dom";

export default function EmptyState({ icon, headline, sub, cta, href }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "32px 20px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {icon && (
        <div
          style={{
            display: "inline-flex",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          {icon}
        </div>
      )}
      <h3
        style={{
          fontFamily: '"Syne", sans-serif',
          fontWeight: 700,
          fontSize: 18,
          color: "#2B1B12",
          marginBottom: 8,
          margin: 0,
        }}
      >
        {headline}
      </h3>
      <p
        style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 14,
          color: "#8C776A",
          marginBottom: 20,
          maxWidth: 300,
          margin: "8px auto 20px",
        }}
      >
        {sub}
      </p>
      {cta && href && (
        <Link to={href} style={{ textDecoration: "none" }}>
          <button
            style={{
              background: "#E35336",
              color: "white",
              border: "none",
              borderRadius: 9999,
              padding: "10px 24px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: '"DM Sans", sans-serif',
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#B8391F")}
            onMouseLeave={(e) => (e.target.style.background = "#E35336")}
          >
            {cta}
          </button>
        </Link>
      )}
    </div>
  );
}
