import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/users";
const IconUser = ({ color }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const IconMail = ({ color }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 8l10 6 10-6" />
  </svg>
);

const IconLock = ({ color }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconEye = ({ color, closed }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
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

const FieldRow = ({ label, icon, children, labelStyle }) => (
  <div>
    <label style={labelStyle}>{label}</label>

    <div style={{ position: "relative" }}>
      <span
        style={{
          position: "absolute",
          left: "1rem",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {icon}
      </span>

      {children}
    </div>
  </div>
);

function Register() {
  const navigate = useNavigate();

  const colors = {
    secondary: "#E35336",
    textPrimary: "#2B1B12",
    muted: "#6B5A50",
    border: "#D2B48C",
    placeholder: "#A89080",
    bg: "#FFF8F0",
  };

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await registerUser(formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ── shared input style ── */
  const inputBase = {
    width: "100%",
    border: `1px solid ${colors.border}`,
    borderRadius: "0.75rem",          /* 12px */
    paddingTop: "0.85rem",            /* 13.6px */
    paddingBottom: "0.85rem",
    paddingLeft: "3rem",              /* 48px — icon room */
    paddingRight: "1rem",             /* 16px */
    fontSize: "1rem",                 /* 16px — prevents mobile zoom */
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
    marginBottom: "6px",             /* label-to-input gap */
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
        padding: "24px",           /* p-6 outer panel padding */
        boxSizing: "border-box",
        position: "relative",
      }}>

        {/* Radial background accent — 600px blurred circle */}
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
          maxWidth: "520px",          /* card max-width */
          backgroundColor: "#ffffff",
          border: "1px solid #EAD9CC", /* 1px crisp border */
          borderRadius: "32px",        /* rounded-[2rem] */
          padding: "2.25rem",           /* reduced from 3rem to prevent scroll */
          boxSizing: "border-box",
          boxShadow: "0 8px 40px rgba(43,27,18,0.08)",
        }}>

          {/* Header — reduced to 24px to keep card scroll-free */}
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{
              fontSize: "36px",         /* text-4xl */
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

          {/* Form — 16px row gap */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Full Name */}
           <div>
  <label style={labelStyle}>Full Name</label>

  <input
    type="text"
    name="name"
    placeholder="Jane Doe"
    value={formData.name}
    onChange={handleChange}
    required
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

 <FieldRow
  label="Email Address"
  labelStyle={labelStyle}
  icon={<IconMail color={colors.placeholder} />}
>
  <input
    type="email"
    name="email"
    placeholder="you@example.com"
    value={formData.email}
    onChange={handleChange}
    required
    style={inputBase}
  />
</FieldRow>

<FieldRow
  label="Password"
  labelStyle={labelStyle}
  icon={<IconLock color={colors.placeholder} />}
>
  <div style={{ position: "relative" }}>
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="Min. 8 characters"
      value={formData.password}
      onChange={handleChange}
      required
      style={{
        ...inputBase,
        paddingLeft: "1rem",
        paddingRight: "1rem",
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
      <IconEye
        color={colors.placeholder}
        closed={!showPassword}
      />
    </button>
  </div>
</FieldRow>
            {/* Error */}
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

            {/* Submit — mt-6 from spec (24px), 0.9rem vertical padding, 1rem radius, 1.1rem font */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "16px",
                width: "100%",
                backgroundColor: loading ? "#e8836e" : colors.secondary,
                color: "#fff",
                paddingTop: "0.9rem",             /* 14.4px */
                paddingBottom: "0.9rem",
                borderRadius: "1rem",             /* 16px */
                fontSize: "1.1rem",               /* 17.6px */
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

          {/* "or" divider — py-5 (20px top + bottom) */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            paddingTop: "14px", paddingBottom: "14px",
          }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#EAD9CC" }} />
            <span style={{ fontSize: "13px", color: colors.placeholder, fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#EAD9CC" }} />
          </div>

          {/* Nav footer — 15px font */}
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

          {/* Disclaimer — mt-6 (24px), text-xs (12px) */}
          <p style={{
            marginTop: "16px",
            fontSize: "12px",
          }}>
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