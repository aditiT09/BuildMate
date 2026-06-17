import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { getProfile } from "../../api/profile";

const C = {
  brand:    "#E35336",
  brandDk:  "#B8391F",
  orange:   "#F4A460",
  bg:       "#FFF8F0",
  surface:  "#FDFBF7",
  dark:     "#2B1B12",
  dark2:    "#4A372D",
  muted:    "#8C776A",
  border:   "#E9DDD0",
  sand:     "#F5EDE0",
  sandDk:   "#EDD5B8",
  cream:    "#FBF5EE",
  accent1:  "#D4A882",
  success:  "#2E7D32",
  warn:     "#D48A2D",
};

const STYLES = `
  @keyframes floatUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .pp-fade { animation: floatUp 0.45s ease both; }
  .pp-card { transition: all 0.2s ease; }
  .pp-card:hover { transform: translateY(-3px); box-shadow: 10px 10px 0px ${C.dark}; }
  .pp-link-btn { transition: all 0.15s ease; cursor: pointer; display: inline-flex; alignItems: center; gap: 6px; }
  .pp-link-btn:hover { transform: translate(-2px, -2px); box-shadow: 4px 4px 0px ${C.dark} !important; background: ${C.sand} !important; }
`;

export default function PublicProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const data = await getProfile(userId);
      setProfile(data);
    } catch (error) {
      if (error.response?.status === 404) {
        setProfile(null);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            fontFamily: '"Syne", sans-serif', fontSize: 14, fontWeight: 700,
            color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{
              width: 16, height: 16, borderRadius: "50%",
              border: `2px solid ${C.border}`, borderTopColor: C.brand,
              animation: "spin 0.8s linear infinite",
            }} />
            fetching builder details...
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <span style={{ fontSize: 44 }}>🧐</span>
          <h2 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 22, color: C.dark }}>
            Profile Not Found
          </h2>
          <p style={{ fontFamily: '"DM Sans", sans-serif', color: C.muted, fontSize: 14 }}>
            This user hasn't cooked up a profile yet.
          </p>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: C.brand, color: "white", border: "none",
              borderRadius: 999, padding: "10px 24px",
              fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: 13,
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
        </div>
      </Layout>
    );
  }

  const displayName = profile.full_name || "Unnamed Builder";
  const initials = displayName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  // Parse comma-separated skills
  const skillsArray = profile.skills
    ? profile.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <Layout>
      <style>{STYLES}</style>
      <div style={{ background: C.bg, minHeight: "90vh", padding: "40px 20px 80px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>

          {/* back */}
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 700,
              color: C.muted, marginBottom: 20, padding: 0,
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            ← back
          </button>

          {/* MAIN PROFILE CARD */}
          <div className="pp-fade pp-card" style={{
            background: C.surface,
            border: `2px solid ${C.dark}`,
            borderRadius: 24,
            padding: "36px 40px",
            boxShadow: `8px 8px 0px ${C.dark}`,
          }}>

            {/* Top Row: Avatar & Primary Info */}
            <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap", marginBottom: 28 }}>
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Avatar"
                  style={{
                    width: 100, height: 100, borderRadius: "50%",
                    border: `2px solid ${C.dark}`, objectFit: "cover",
                    background: C.sand,
                  }}
                />
              ) : (
                <div style={{
                  width: 100, height: 100, borderRadius: "50%",
                  border: `2px solid ${C.dark}`, background: C.brand,
                  color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 32,
                  boxShadow: `4px 4px 0px ${C.dark}`,
                }}>
                  {initials}
                </div>
              )}

              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <h1 style={{
                    fontFamily: '"Syne", sans-serif', fontWeight: 800,
                    fontSize: 28, color: C.dark, margin: 0,
                  }}>
                    {displayName}
                  </h1>

                  {profile.availability && (
                    <span style={{
                      fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 700,
                      background: `${C.brand}12`, color: C.brand,
                      border: `1px solid ${C.brand}30`,
                      borderRadius: 999, padding: "4px 12px",
                      textTransform: "uppercase", letterSpacing: "0.05em",
                    }}>
                      ⚡ {profile.availability}
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
                  {profile.college && (
                    <span style={{
                      fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 600,
                      background: C.cream, color: C.dark2,
                      border: `1px solid ${C.border}`,
                      borderRadius: 8, padding: "3px 10px",
                    }}>
                      🎓 {profile.college}
                    </span>
                  )}
                  {profile.degree && (
                    <span style={{
                      fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 600,
                      background: C.cream, color: C.dark2,
                      border: `1px solid ${C.border}`,
                      borderRadius: 8, padding: "3px 10px",
                    }}>
                      📜 {profile.degree}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* About / Bio */}
            <div style={{ borderTop: `1.5px solid ${C.border}`, paddingTop: 24, marginBottom: 28 }}>
              <p style={{
                fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 14,
                color: C.dark, textTransform: "uppercase", letterSpacing: "0.05em",
                margin: "0 0 10px",
              }}>
                About Me
              </p>
              <p style={{
                fontFamily: '"DM Sans", sans-serif', fontSize: 15, lineHeight: 1.6,
                color: C.dark2, margin: 0, whiteSpace: "pre-line",
              }}>
                {profile.bio || "No bio added yet — keeping it mysterious 👀"}
              </p>
            </div>

            {/* Skills */}
            {skillsArray.length > 0 && (
              <div style={{ borderTop: `1.5px solid ${C.border}`, paddingTop: 24, marginBottom: 28 }}>
                <p style={{
                  fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 14,
                  color: C.dark, textTransform: "uppercase", letterSpacing: "0.05em",
                  margin: "0 0 12px",
                }}>
                  🛠️ Tech Stack & Skills
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {skillsArray.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        background: C.sand,
                        color: C.dark2,
                        border: `1.5px solid ${C.border}`,
                        borderRadius: 12,
                        padding: "5px 14px",
                        fontFamily: '"DM Sans", sans-serif',
                        fontWeight: 700,
                        fontSize: 13,
                        boxShadow: `2px 2px 0px ${C.border}`,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links / Contacts */}
            <div style={{ borderTop: `1.5px solid ${C.border}`, paddingTop: 24 }}>
              <p style={{
                fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 14,
                color: C.dark, textTransform: "uppercase", letterSpacing: "0.05em",
                margin: "0 0 14px",
              }}>
                🔗 Links & Portfolio
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="pp-link-btn"
                    style={{
                      textDecoration: "none",
                      background: C.surface,
                      color: C.dark,
                      border: `1.5px solid ${C.dark}`,
                      boxShadow: `2.5px 2.5px 0px ${C.dark}`,
                      borderRadius: 12,
                      padding: "8px 18px",
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    🐙 GitHub
                  </a>
                )}

                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="pp-link-btn"
                    style={{
                      textDecoration: "none",
                      background: C.surface,
                      color: C.dark,
                      border: `1.5px solid ${C.dark}`,
                      boxShadow: `2.5px 2.5px 0px ${C.dark}`,
                      borderRadius: 12,
                      padding: "8px 18px",
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    💼 LinkedIn
                  </a>
                )}

                {profile.portfolio && (
                  <a
                    href={profile.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="pp-link-btn"
                    style={{
                      textDecoration: "none",
                      background: C.surface,
                      color: C.dark,
                      border: `1.5px solid ${C.dark}`,
                      boxShadow: `2.5px 2.5px 0px ${C.dark}`,
                      borderRadius: 12,
                      padding: "8px 18px",
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    🌐 Portfolio
                  </a>
                )}

                {!profile.github && !profile.linkedin && !profile.portfolio && (
                  <p style={{
                    fontFamily: '"DM Sans", sans-serif', fontSize: 13,
                    color: C.muted, margin: 0, fontStyle: "italic",
                  }}>
                    No external links provided by this builder yet.
                  </p>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
}