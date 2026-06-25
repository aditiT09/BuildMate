import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
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
  success: "#22C55E",
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

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const form = new URLSearchParams();
      form.append("username", email);
      form.append("password", password);
      const response = await api.post("/auth/login", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      login(response.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err.response?.data?.detail) || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: colors.background, fontFamily: "'DM Sans', sans-serif" }}
    >
     

      {/* ── Left Panel ── */}
<div
  className="hidden lg:flex flex-col justify-center relative overflow-hidden"
  style={{
    width: "52%",
    backgroundColor: colors.textPrimary,
    padding: "3.5rem",
    borderTopRightRadius: "120px",
    borderBottomRightRadius: "120px",
  }}

  style={{
  width: "55%",
  backgroundColor: colors.textPrimary,
  padding: "3.5rem",
  borderTopRightRadius: "80px",
  borderBottomRightRadius: "80px",
}}
>
  <GridPattern />

  <FloatingDot
    style={{
      width: 320,
      height: 320,
      top: -80,
      right: -80,
    }}
  />

  <FloatingDot
    style={{
      width: 200,
      height: 200,
      bottom: 120,
      left: -60,
    }}
  />

  <FloatingDot
    style={{
      width: 100,
      height: 100,
      bottom: 300,
      right: 80,
      opacity: 0.1,
    }}
  />

  <div className="relative z-10 max-w-xl">

    <p
      className="text-sm font-medium mb-4 tracking-widest uppercase"
      style={{
        color: colors.secondary,
        letterSpacing: "0.12em",
      }}
    >
      Find your missing piece.
    </p>

    <h1
      className="text-6xl leading-[1.05] mb-6"
      style={{
        color: "#FFF8F0",
        fontFamily: "'Fraunces', serif",
        fontWeight: 700,
      }}
    >
      Find your
      <br />
      <em
        style={{
          color: colors.secondary,
          fontStyle: "italic",
        }}
      >
        team.
      </em>
      <br />
      Build your dream.
    </h1>

    <p
      className="text-lg leading-relaxed max-w-md"
      style={{
        color: "#C4B8B0",
      }}
    >
      Discover ambitious builders,
      join exciting projects,
      and turn ideas into shipped products
      with the right team.
    </p>

    <div
  className="mt-10 h-px w-32"
  style={{
    backgroundColor: "rgba(244,164,96,0.35)",
  }}
/>  

  </div>
</div>
      {/* ── Right Panel ── */}
      <div
  className="flex-1 flex items-center justify-center relative"
  style={{
    padding: "2rem",
    marginLeft: "-60px",
  }}
>
        {/* Subtle warm circle background */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${colors.accentLight} 0%, transparent 70%)`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        <div className="relative w-full max-w-[520px]">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M3 14L9 4L15 14H3Z" fill="white" />
              </svg>
            </div>
            <span className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              BuildMate
            </span>
          </div>

          {/* Card */}
          <div
            className="rounded-3xl"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.border}`,
              padding: "3.5rem",
              boxShadow: "0 4px 40px rgba(43,27,18,0.08), 0 1px 4px rgba(43,27,18,0.04)",
            }}
          >
            <div className="mb-10">
              <h2
                className="text-4xl font-bold mb-3"
                style={{ color: colors.textPrimary, fontFamily: "'Fraunces', serif" }}
              >
                Welcome back
              </h2>
              <p className="text-sm" style={{ color: colors.muted }}>
                Sign in to your BuildMate account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  Email address
                </label>
                <div className="relative">
                  <span
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: focused === "email" ? colors.primary : colors.muted }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    required
                    style={{
                      width: "100%",
                      paddingLeft: "2.75rem",
                      paddingRight: "1rem",
                      paddingTop: "0.75rem",
                      paddingBottom: "0.75rem",
                      borderRadius: "0.75rem",
                      border: `1.5px solid ${focused === "email" ? colors.primary : colors.border}`,
                      backgroundColor: colors.inputBg,
                      color: colors.textPrimary,
                      fontSize: "0.9rem",
                      outline: "none",
                      transition: "border-color 0.15s",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium"
                    style={{ color: colors.textSecondary }}
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium"
                    style={{ color: colors.primary }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <span
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: focused === "password" ? colors.primary : colors.muted }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    required
                    style={{
                      width: "100%",
                      paddingLeft: "2.75rem",
                      paddingRight: "3rem",
                      paddingTop: "0.75rem",
                      paddingBottom: "0.75rem",
                      borderRadius: "0.75rem",
                      border: `1.5px solid ${focused === "password" ? colors.primary : colors.border}`,
                      backgroundColor: colors.inputBg,
                      color: colors.textPrimary,
                      fontSize: "0.9rem",
                      outline: "none",
                      transition: "border-color 0.15s",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: colors.muted, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="flex items-start gap-2.5 rounded-xl p-3.5 text-sm"
                  style={{
                    backgroundColor: "#FEF2F2",
                    border: "1px solid #FECACA",
                    color: "#DC2626",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  borderRadius: "0.875rem",
                  backgroundColor: loading ? colors.muted : colors.primary,
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "background-color 0.15s, transform 0.1s",
                  marginTop: "0.5rem",
                  letterSpacing: "0.01em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = colors.primaryHover;
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = colors.primary;
                }}
                onMouseDown={(e) => {
                  if (!loading) e.currentTarget.style.transform = "scale(0.99)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {loading ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
              <span className="text-xs" style={{ color: colors.muted }}>
                or
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
            </div>

            {/* Register */}
            <p className="text-center text-sm" style={{ color: colors.muted }}>
              New to BuildMate?{" "}
              <Link
                to="/register"
                className="font-semibold"
                style={{ color: colors.primary }}
                onMouseEnter={(e) => (e.currentTarget.style.color = colors.primaryHover)}
                onMouseLeave={(e) => (e.currentTarget.style.color = colors.primary)}
              >
                Create a free account →
              </Link>
            </p>
          </div>

          {/* Bottom note */}
          <p className="text-center text-xs mt-5" style={{ color: "#6F5D53" }}>
            By signing in you agree to our{" "}
            <Link to="/terms" style={{ color: colors.muted }}>Terms</Link>
            {" "}and{" "}
            <Link to="/privacy" style={{ color: colors.muted }}>Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
