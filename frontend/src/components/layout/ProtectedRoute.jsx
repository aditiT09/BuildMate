import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#FFF8F0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"DM Sans", sans-serif',
        gap: 16
      }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "3px solid #E9DDD0",
          borderTopColor: "#E35336",
          animation: "spin 0.8s linear infinite"
        }} />
        <p style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#8C776A",
          letterSpacing: "0.1em",
          textTransform: "uppercase"
        }}>
          Authenticating...
        </p>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return token
    ? children
    : <Navigate to="/login" />;
}

export default ProtectedRoute;