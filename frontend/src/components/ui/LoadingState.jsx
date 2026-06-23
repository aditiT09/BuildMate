

export default function LoadingState({ message = "Loading..." }) {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
      }}
      aria-busy="true"
      aria-live="polite"
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "3px solid #E9DDD0",
          borderTopColor: "#E35336",
          animation: "loading-spin 0.8s linear infinite",
        }}
      />
      <p
        style={{
          fontFamily: '"Syne", sans-serif',
          fontSize: 14,
          fontWeight: 700,
          color: "#8C776A",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        {message}
      </p>
      <style>{`
        @keyframes loading-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
