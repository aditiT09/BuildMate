import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { getErrorMessage } from "../../utils/validation";

const colors = {
  primary: "#E35336",
  primaryHover: "#cc452b",
  secondary: "#F4A460",
  textPrimary: "#2B1B12",
  textSecondary: "#4A372D",
  muted: "#555E6C",
  border: "#D2B48C",
  background: "#FFF8F0",
  success: "#2E7D32",
  cardBg: "#FFFFFF",
  inputBg: "#FDFAF7",
  accentLight: "#FEF0EB",
};

const GridPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.04]"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2B1B12" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

const FloatingDot = ({ style }) => (
  <div
    className="absolute rounded-full opacity-20"
    style={{
      background: `radial-gradient(circle, ${colors.primary}, transparent)`,
      ...style,
    }}
  />
);

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await api.post("/auth/forgot-password", { email });
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err.response?.data?.detail) || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: colors.background, fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Left Panel (Decorative, similar to login) ── */}
      <div
        className="hidden lg:flex flex-col justify-center relative overflow-hidden"
        style={{
          width: "55%",
          backgroundColor: colors.textPrimary,
          padding: "3.5rem",
          borderTopRightRadius: "80px",
          borderBottomRightRadius: "80px",
        }}
      >
        <GridPattern />
        <FloatingDot style={{ width: 320, height: 320, top: -80, right: -80 }} />
        <FloatingDot style={{ width: 200, height: 200, bottom: 120, left: -60 }} />

        <div className="relative z-10 max-w-xl">
          <p
            className="text-sm font-medium mb-4 tracking-widest uppercase"
            style={{ color: colors.secondary, letterSpacing: "0.12em" }}
          >
            BUILDMATE SECURITY
          </p>
          <h1
            className="text-6xl leading-[1.05] mb-6"
            style={{
              color: "#FFF8F0",
              fontFamily: "'Fraunces', serif",
              fontWeight: 700,
              fontSize: "3.5rem",
            }}
          >
            Let's get you back inside.
          </h1>
          <p
            className="text-lg leading-relaxed"
            style={{ color: "rgba(255, 248, 240, 0.75)" }}
          >
            Don't worry! Enter your email and we will send you a password reset link to get you back on track.
          </p>
        </div>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-12 relative">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigate("/")}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl"
              style={{
                backgroundColor: colors.primary,
                color: "#FFFFFF",
                transform: "rotate(-6deg)",
                boxShadow: `3px 3px 0px ${colors.textPrimary}`,
              }}
            >
              BM
            </div>
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: colors.textPrimary, fontFamily: "'Syne', sans-serif" }}
            >
              BuildMate
            </span>
          </div>

          {!success ? (
            <>
              <h2
                className="text-3xl font-bold mb-3 tracking-tight"
                style={{ color: colors.textPrimary, fontFamily: "'Syne', sans-serif" }}
              >
                Forgot Password?
              </h2>
              <p className="text-sm mb-8" style={{ color: colors.textSecondary }}>
                Enter the email address associated with your account.
              </p>

              {error && (
                <div
                  role="alert"
                  style={{
                    backgroundColor: "#FEF2F2",
                    border: "1.5px solid #FECACA",
                    color: "#DC2626",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    fontSize: "14px",
                    marginBottom: "20px",
                    fontWeight: 500,
                  }}
                >
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-6 relative">
                  <label
                    htmlFor="email"
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: colors.textPrimary,
                      marginBottom: "8px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="e.g. you@university.edu"
                    required
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: "12px",
                      border: `2px solid ${focused ? colors.primary : colors.border}`,
                      backgroundColor: colors.inputBg,
                      color: colors.textPrimary,
                      fontSize: "15px",
                      transition: "all 0.2s ease",
                      outline: "none",
                      boxShadow: focused ? `0 0 0 4px ${colors.primary}1A` : "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "9999px",
                    backgroundColor: colors.primary,
                    color: "#FFFFFF",
                    fontSize: "15px",
                    fontWeight: 700,
                    border: "none",
                    cursor: loading || !email.trim() ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                    boxShadow: `0 4px 14px ${colors.primary}33`,
                    opacity: loading || !email.trim() ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && email.trim()) e.target.style.backgroundColor = colors.primaryHover;
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.target.style.backgroundColor = colors.primary;
                  }}
                >
                  {loading ? "Sending reset link..." : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            <div
              className="text-center"
              style={{
                backgroundColor: colors.cardBg,
                border: `2px solid ${colors.textPrimary}`,
                boxShadow: `6px 6px 0px ${colors.textPrimary}`,
                borderRadius: "24px",
                padding: "32px 24px",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "#E8F5E9",
                  color: colors.success,
                  fontSize: "28px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                  border: "2px solid #C8E6C9",
                }}
              >
                ✓
              </div>
              <h2
                className="text-2xl font-bold mb-3"
                style={{ color: colors.textPrimary, fontFamily: "'Syne', sans-serif" }}
              >
                Check Your Inbox
              </h2>
              <p
                role="alert"
                className="text-sm leading-relaxed mb-6"
                style={{ color: colors.textSecondary }}
              >
                If an account exists with <strong>{email}</strong>, we have sent a secure password reset link. Please check your spam folder if it doesn't arrive in a few minutes.
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              to="/login"
              style={{
                color: colors.primary,
                fontSize: "14px",
                fontWeight: 700,
                textDecoration: "none",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.target.style.color = colors.primaryHover)}
              onMouseLeave={(e) => (e.target.style.color = colors.primary)}
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
