import { useNavigate, Link } from "react-router-dom";
import { LockIcon } from "../../components/common/Icons";

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
          flexShrink: 0,
          backgroundColor: colors.textPrimary,
          padding: "3.5rem",
          borderTopRightRadius: "80px",
          borderBottomRightRadius: "50px",
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
      <div
        className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-16 lg:px-60 py-12 right"
        style={{ flexShrink: 0 }}
      >
        <div className="w-full max-w-md lg:ml-auto lg:mr-0 mx-auto">
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

          <div
            className="text-center"
            style={{
              backgroundColor: colors.cardBg,
              border: `2px solid ${colors.textPrimary}`,
              boxShadow: `6px 6px 0px #6F4E37`,
              borderRadius: "24px",
              padding: "40px 24px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: colors.accentLight,
                color: colors.primary,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                border: `2px solid ${colors.border}`,
              }}
            >
              <LockIcon size={24} color={colors.primary} />
            </div>
            <h2
              className="text-3xl font-bold mb-3"
              style={{
                color: colors.textPrimary,
                fontFamily: '"Melody by W.", "Melody", sans-serif',
                fontWeight: 800,
              }}
            >
              Coming Soon
            </h2>
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: colors.textSecondary }}
            >
              We are working hard to build secure password recovery features. Password reset functionality will be available in a future update!
            </p>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/login"
              style={{
                display: "inline-block",
                padding: "14px 36px",
                borderRadius: "9999px",
                backgroundColor: colors.primary,
                color: "#FFFFFF",
                fontSize: "15px",
                fontWeight: 800,
                textDecoration: "none",
                transition: "all 0.2s ease",
                boxShadow: `0 4px 12px ${colors.primary}33`,
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.primaryHover;
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = colors.primary;
                e.target.style.transform = "translateY(0)";
              }}
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
