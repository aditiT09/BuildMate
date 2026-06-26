import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MedalIcon, SearchIcon, BrainIcon, ZapIcon, HandshakeIcon, CheckIcon, XIcon, CelebrationIcon } from "../../components/common/Icons";

import { getProjectMatches } from "../../api/matching";
import Layout from "../../components/layout/Layout";
import LoadingState from "../../components/ui/LoadingState";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";


const C = {
  brand:   "#E35336",
  brandDk: "#B8391F",
  orange:  "#F4A460",
  dark:    "#2B1B12",
  dark2:   "#4A372D",
  muted:   "#8C776A",
  border:  "#E9DDD0",
  bg:      "#FFF8F0",
  surface: "#FDFBF7",
  sand:    "#F5EDE0",
  green:   "#5C8A52",
};

// Emojis replaced by SVGs

const tilt = (n) => {
  const seq = [-1.4, 1.1, -0.7, 1.6, -1.1, 0.8];
  return seq[n % seq.length];
};

const scoreColor = (score) => {
  if (score >= 70) return C.green;
  if (score >= 40) return C.brand;
  return C.muted;
};

const STYLES = `
  @keyframes floatIn { from { opacity:0; transform: translateY(10px) } to { opacity:1; transform: translateY(0) } }
  @keyframes spin { to { transform: rotate(360deg) } }
  @keyframes fillBar { from { width: 0% } }
  .mr-fade { animation: floatIn .35s ease both; }
  .mr-card { transition: transform .18s ease, box-shadow .18s ease; }
  .mr-card:hover { transform: rotate(0deg) translateY(-3px) !important; box-shadow: 0 14px 32px rgba(43,27,18,0.12) !important; }
  .mr-bar-fill { animation: fillBar .7s ease both; }
  .mr-pill { display: inline-flex; align-items: center; gap: 6px; border-radius: 999px; padding: 6px 12px; font-family: "DM Sans", sans-serif; font-size: 12px; font-weight: 800; }
`;

export default function MatchResults() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMatches = useCallback(async () => {
    try {
      const data = await getProjectMatches(id);
      setMatches(data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load matches");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const init = async () => {
      await loadMatches();
    };
    init();
  }, [loadMatches]);

  const sortedMatches = [...matches].sort(
    (a, b) => b.overall_score - a.overall_score
  );

  if (loading) {
    return (
      <Layout>
        <LoadingState message="crunching the numbers..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorState message={error} onRetry={loadMatches} />
      </Layout>
    );
  }

  if (sortedMatches.length === 0) {
    return (
      <Layout>
        <EmptyState
          icon={<SearchIcon size={40} color={C.muted} />}
          headline="no matches yet"
          sub="nobody's skills line up well enough rn — check back once more people fill out their profiles"
        />
      </Layout>
    );
  }


  return (
    <Layout>
      <style>{STYLES}</style>
      <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 80 }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "36px 20px 0" }}>

          {/* back */}
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 700,
              color: C.muted, marginBottom: 18, padding: 0,
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            ← back
          </button>

          {/* HERO */}
          <div className="mr-fade" style={{
            position: "relative",
            background: C.dark, color: C.bg,
            borderRadius: 28, padding: "40px 36px",
            marginBottom: 28,
            boxShadow: "0 14px 40px rgba(43,27,18,0.18)",
            transform: "rotate(-1deg)",
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: C.orange, color: C.dark,
              padding: "4px 12px", borderRadius: 999,
              fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 800,
              letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: 18,
            }}>
              match results
            </div>

            <h1 style={{
              fontFamily: '"Syne", sans-serif', fontWeight: 800,
              fontSize: "clamp(28px, 5.5vw, 46px)", lineHeight: 1.08,
              letterSpacing: "-0.02em", margin: 0,
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}>
              who's actually a fit <SearchIcon size={32} color="currentColor" />
            </h1>

            <p style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: 14,
              color: "rgba(255,248,240,0.7)", marginTop: 14, maxWidth: 480, lineHeight: 1.6,
            }}>
              ranked by skill overlap, activity, and how reliable they've been. top picks first.
            </p>
          </div>

          {/* MATCH CARDS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {sortedMatches.map((match, index) => {
              const matchingSkills = match.matching_skills ?? [];
              const missingSkills = match.missing_skills ?? [];
              const color = scoreColor(match.overall_score);

              return (
                <div
                  key={match.user_id}
                  className="mr-fade mr-card"
                  style={{
                    background: C.surface, border: `1.5px solid ${C.border}`,
                    borderRadius: 22, padding: "24px 26px",
                    transform: `rotate(${tilt(index)}deg)`,
                  }}
                >
                  {/* header */}
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                    flexWrap: "wrap", gap: 12, marginBottom: 18,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span className="mr-pill" style={{
                        background: index < 3 ? C.orange : C.sand,
                        color: C.dark,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}>
                        {index < 3 ? (
                          <>
                            <MedalIcon rank={index + 1} size={16} />
                            Rank {index + 1}
                          </>
                        ) : (
                          `#${index + 1} Rank ${index + 1}`
                        )}
                      </span>
                      <h2 style={{
                        fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 20,
                        color: C.dark, margin: 0,
                      }}>
                        {match.name}
                      </h2>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <p style={{
                        fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 800,
                        color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0,
                      }}>
                        overall vibe
                      </p>
                      <p style={{
                        fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 26,
                        color, margin: 0,
                      }}>
                        {match.overall_score.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* progress bar */}
                  <div style={{
                    width: "100%", background: C.sand, borderRadius: 999,
                    height: 12, overflow: "hidden", marginBottom: 20,
                  }}>
                    <div
                      className="mr-bar-fill"
                      style={{
                        height: "100%", borderRadius: 999,
                        width: `${match.overall_score}%`,
                        background: color,
                      }}
                    />
                  </div>

                  {/* stat row */}
                  <div style={{
                    display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
                    marginBottom: 22,
                  }}>
                    {[
                      { label: "skill match", value: match.skill_match.toFixed(1), icon: <BrainIcon size={18} color={C.brand} /> },
                      { label: "activity", value: match.activity_score, icon: <ZapIcon size={18} color={C.orange} /> },
                      { label: "reliability", value: match.reliability_score, icon: <HandshakeIcon size={18} color={C.green} /> },
                    ].map((stat) => (
                      <div key={stat.label} style={{
                        background: C.bg, border: `1.5px solid ${C.border}`,
                        borderRadius: 14, padding: "12px 10px", textAlign: "center",
                      }}>
                        <p style={{ fontSize: 18, margin: "0 0 4px", display: "flex", justifyContent: "center" }}>{stat.icon}</p>
                        <p style={{
                          fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 17,
                          color: C.dark, margin: 0,
                        }}>
                          {stat.value}
                        </p>
                        <p style={{
                          fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 700,
                          color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", margin: "2px 0 0",
                        }}>
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* skills */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <p style={{
                        fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 800,
                        color: C.green, textTransform: "uppercase", letterSpacing: "0.1em",
                        marginBottom: 8,
                      }}>
                        brings to the table
                      </p>
                      {matchingSkills.length > 0 ? (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {matchingSkills.map((skill) => (
                            <span key={skill} style={{
                              background: "#EAF3E7", color: C.green,
                              border: "1px solid #CDE3C7",
                              borderRadius: 999, padding: "4px 10px",
                              fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 700,
                            }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                                <CheckIcon size={12} color="currentColor" /> {skill}
                              </span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: C.muted, margin: 0 }}>
                          no overlap here
                        </p>
                      )}
                    </div>

                    <div>
                      <p style={{
                        fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 800,
                        color: C.brand, textTransform: "uppercase", letterSpacing: "0.1em",
                        marginBottom: 8,
                      }}>
                        gaps to fill
                      </p>
                      {missingSkills.length > 0 ? (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {missingSkills.map((skill) => (
                            <span key={skill} style={{
                              background: "#FBEAE6", color: C.brandDk,
                              border: "1px solid #F4CFC6",
                              borderRadius: 999, padding: "4px 10px",
                              fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 700,
                            }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                                <XIcon size={12} color="currentColor" /> {skill}
                              </span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: C.muted, margin: 0 }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: C.green }}>
                            <CelebrationIcon size={14} color="currentColor" /> nothing missing
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}