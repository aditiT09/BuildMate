import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/users";

const IconMail = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 8l10 6 10-6" />
  </svg>
);

const IconLock = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconEye = ({ color, closed }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {closed ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

const FieldRow = ({ label, icon, children, labelStyle, id }) => (
  <div>
    <label htmlFor={id} style={labelStyle}>{label}</label>
    <div style={{ position: "relative" }}>
      <span style={{
        position: "absolute",
        left: "1rem",
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        alignItems: "center",
        pointerEvents: "none",
      }}>
        {icon}
      </span>
      {children}
    </div>
  </div>
);

// ── Live password hint ──────────────────────────────────────────────
const PasswordHint = ({ password }) => {
  const rules = [
    { label: "8+ characters",  met: password.length >= 8 },
    { label: "Uppercase",      met: /[A-Z]/.test(password) },
    { label: "Lowercase",      met: /[a-z]/.test(password) },
    { label: "Number",         met: /\d/.test(password) },
  ];

  if (!password) return null; // hide until user starts typing

  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "6px 12px",
      marginTop: "8px",
      padding: "10px 12px",
      backgroundColor: "#FFF8F0",
      border: "1px solid #EAD9CC",
      borderRadius: "0.6rem",
      fontSize: "12px",
    }}>
      {rules.map(({ label, met }) => (
        <span key={label} style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          color: met ? "#16a34a" : "#756255",
          fontWeight: met ? 600 : 400,
          transition: "color 0.2s",
        }}>
          {met ? "✓" : "·"} {label}
        </span>
      ))}
    </div>
  );
};

// ── Regex ───────────────────────────────────────────────────────────
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

function Register() {
  const navigate = useNavigate();

  const colors = {
    secondary: "#E35336",
    textPrimary: "#2B1B12",
    muted: "#6B5A50",
    border: "#D2B48C",
    placeholder: "#756255",
    bg: "#FFF8F0",
  };

  const [formData, setFormData]     = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // ── Error mapper ────────────────────────────────────────────────
  const getErrorMessage = (err) => {
    const status = err.response?.status;
    const detail = err.response?.data?.detail;

    if (status === 409) return "Email already registered. Try logging in instead.";
    if (status === 422) return "Please enter a valid email address.";

    if (Array.isArray(detail)) {
      const emailError = detail.find(
        (d) => d.loc?.includes("email") || d.msg?.toLowerCase().includes("email")
      );
      if (emailError) return "Please enter a valid email address.";
    }

    return detail || "Registration failed. Please try again.";
  };

  // ── Submit ──────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 4. Frontend password regex check — fast fail before hitting the API
    if (!PASSWORD_REGEX.test(formData.password)) {
      setError("Password must contain uppercase, lowercase, a number, and be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        ...formData,
        // 5. Trim name  +  6. Collapse double spaces
        name:  formData.name.trim().replace(/\s+/g, " "),
        // Trim + lowercase email
        email: formData.email.trim().toLowerCase(),
      };

      await registerUser(payload);
      navigate("/login");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const inputBase = {
    width: "100%",
    border: `1px solid ${colors.border}`,
    borderRadius: "0.75rem",
    paddingTop: "0.85rem",
    paddingBottom: "0.85rem",
    paddingLeft: "3rem",
    paddingRight: "1rem",
    fontSize: "1rem",
    color: colors.textPrimary,
    outline: "none",
    backgroundColor: "#fff",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: 500,
    color: colors.textPrimary,
    marginBottom: "6px",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex" }} className="bg-[#FFF8F0] lg:grid lg:grid-cols-2">

      {/* ── Left Panel ── */}
      <div
        className="hidden lg:flex flex-col justify-center bg-[#2B1B12]"
        style={{
          padding: "5rem",
          clipPath: "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%)",
          marginRight: "-2px",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: "360px" }}>
          <p style={{
            color: colors.secondary,
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}>
            DISCOVER • CONNECT • BUILD
          </p>

          <h1 style={{
            color: "#FFF8F0",
            fontFamily: "'Fraunces', serif",
            fontWeight: 700,
            fontSize: "clamp(2.4rem, 3.5vw, 3.2rem)",
            lineHeight: 1.08,
            marginBottom: "1.5rem",
          }}>
            Find Partners.
            <br />
            <em style={{ color: colors.secondary, fontStyle: "italic" }}>Minus The</em>
            <br />
            Awkward Networking.
          </h1>

          <p style={{ color: "#C4B8B0", fontSize: "1rem", lineHeight: 1.7 }}>
            Create your profile, discover ambitious builders, and connect
            with teammates who actually want to build something meaningful.
          </p>

          <div style={{ marginTop: "2.5rem", height: "1px", width: "5rem", backgroundColor: "rgba(244,164,96,0.4)" }} />
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: "100vh",
        padding: "24px",
        boxSizing: "border-box",
        position: "relative",
      }}>

        <div style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(227,83,54,0.09) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0,
        }} />

        {/* ── Card ── */}
        <div style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "520px",
          backgroundColor: "#ffffff",
          border: "1px solid #EAD9CC",
          borderRadius: "32px",
          padding: "2.25rem",
          boxSizing: "border-box",
          boxShadow: "0 8px 40px rgba(43,27,18,0.08)",
        }}>

          <div style={{ marginBottom: "24px" }}>
            <h2 style={{
              fontSize: "36px",
              fontWeight: 700,
              fontFamily: "'Fraunces', serif",
              color: colors.textPrimary,
              marginBottom: "8px",
              lineHeight: 1.1,
            }}>
              Join BuildMate
            </h2>
            <p style={{ fontSize: "15px", color: colors.muted, lineHeight: 1.5 }}>
              Create your account and start finding your next teammate.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* ── Full Name ── */}
            <div>
              <label htmlFor="name" style={labelStyle}>Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={2}   // 1. name validation
                maxLength={50}
                style={{
                  width: "100%",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "0.75rem",
                  padding: "0.85rem 1rem",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* ── Email ── */}
            <FieldRow id="email" label="Email Address" labelStyle={labelStyle} icon={<IconMail color={colors.placeholder} />}>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                style={inputBase}
              />
            </FieldRow>

            {/* ── Password ── */}
            <FieldRow id="password" label="Password" labelStyle={labelStyle} icon={<IconLock color={colors.placeholder} />}>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}   // 2. password validation
                  style={{
                    ...inputBase,
                    paddingLeft: "1rem",
                    paddingRight: "3rem",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconEye color={colors.placeholder} closed={!showPassword} />
                </button>
              </div>

              {/* 3. Live password hint */}
              <PasswordHint password={formData.password} />
            </FieldRow>

            {/* ── Error banner ── */}
            {error && (
              <div style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: "0.75rem",
                padding: "0.75rem 1rem",
                fontSize: "14px",
                color: "#DC2626",
              }}>
                {error}
              </div>
            )}

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "16px",
                width: "100%",
                backgroundColor: loading ? "#e8836e" : colors.secondary,
                color: "#fff",
                paddingTop: "0.9rem",
                paddingBottom: "0.9rem",
                borderRadius: "1rem",
                fontSize: "1.1rem",
                fontWeight: 600,
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "opacity 0.15s, transform 0.1s",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={e => !loading && (e.target.style.opacity = "0.92")}
              onMouseLeave={e => (e.target.style.opacity = "1")}
              onMouseDown={e => !loading && (e.target.style.transform = "scale(0.985)")}
              onMouseUp={e => (e.target.style.transform = "scale(1)")}
            >
              {loading ? "Creating Account…" : "Create Account"}
            </button>

          </form>

          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            paddingTop: "14px", paddingBottom: "14px",
          }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#EAD9CC" }} />
            <span style={{ fontSize: "13px", color: colors.placeholder, fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#EAD9CC" }} />
          </div>

          <p style={{ textAlign: "center", fontSize: "15px", color: colors.muted }}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{ color: colors.secondary, fontWeight: 600, textDecoration: "none" }}
              onMouseEnter={e => e.target.style.textDecoration = "underline"}
              onMouseLeave={e => e.target.style.textDecoration = "none"}
            >
              Log in
            </Link>
          </p>

          <p style={{ marginTop: "16px", fontSize: "12px" }}>
            By creating an account you agree to our{" "}
            <Link to="/terms" style={{ color: colors.secondary, textDecoration: "none" }}>Terms of Service</Link>
            {" "}and{" "}
            <Link to="/privacy" style={{ color: colors.secondary, textDecoration: "none" }}>Privacy Policy</Link>.
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;