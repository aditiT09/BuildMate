

export default function ErrorState({ message = "An error occurred", onRetry }) {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
        textAlign: "center",
        padding: 24,
        boxSizing: "border-box",
      }}
      role="alert"
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "#FEF2F2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#DC2626",
          fontSize: 24,
          fontWeight: "bold",
          border: "1.5px solid #FECACA",
        }}
      >
        !
      </div>
      <div>
        <h3
          style={{
            fontFamily: '"Syne", sans-serif',
            fontWeight: 700,
            fontSize: 18,
            color: "#2B1B12",
            margin: 0,
          }}
        >
          Something went wrong
        </h3>
        <p
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 14,
            color: "#8C776A",
            margin: "8px 0 0 0",
            maxWidth: 360,
          }}
        >
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
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
            marginTop: 8,
          }}
          onMouseEnter={(e) => (e.target.style.background = "#B8391F")}
          onMouseLeave={(e) => (e.target.style.background = "#E35336")}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
