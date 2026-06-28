import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SearchIcon, TargetIcon, XIcon, MailIcon } from "../../components/common/Icons";
import Layout from "../../components/layout/Layout";
import LoadingState from "../../components/ui/LoadingState";


import { getOpportunity } from "../../api/opportunities";
import { getOpportunityMatches } from "../../api/matching";
import { createInvitation, getSentInvitations, cancelInvitation } from "../../api/invitations";

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
};

const STYLES = `
  @keyframes floatIn { from { opacity:0; transform: translateY(10px) } to { opacity:1; transform: translateY(0) } }
  .ib-fade { animation: floatIn .35s ease both; }
  .ib-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(43,27,18,0.08); }
  .ib-card { transition: all 0.2s ease; }
  .ib-btn-prime:hover { background: ${C.brandDk}; transform: translateY(-1px); }
  .ib-btn-ghost:hover { background: ${C.dark}; color: ${C.orange}; border-color: ${C.dark}; }
  .ib-btn-cancel:hover { background: ${C.brand}; color: white; border-color: ${C.brand}; transform: translateY(-1px); }
`;

export default function InviteBuilders() {
  const { opportunityId } = useParams();
  const navigate = useNavigate();

  const [opportunity, setOpportunity] = useState(null);
  const [matches, setMatches] = useState([]);
  const [invitedUserIds, setInvitedUserIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [invitingId, setInvitingId] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const opp = await getOpportunity(opportunityId);
      setOpportunity(opp);

      const [matchList, sentInvites] = await Promise.all([
        getOpportunityMatches(opportunityId),
        getSentInvitations(),
      ]);
      setMatches(matchList);

      const activeInvites = sentInvites
        .filter((inv) => inv.opportunity_id === Number(opportunityId))
        .map((inv) => inv.user_id);
      setInvitedUserIds(new Set(activeInvites));
    } catch {
      alert("Failed to load match recommendations.");
    } finally {
      setLoading(false);
    }
  }, [opportunityId]);

  useEffect(() => {
    const init = async () => {
      await loadData();
    };
    init();
  }, [loadData]);

  const handleInvite = async (userId) => {
    try {
      setInvitingId(userId);
      await createInvitation({
        user_id: userId,
        opportunity_id: Number(opportunityId),
      });
      setInvitedUserIds((prev) => new Set([...prev, userId]));
      alert("Invitation sent successfully!");
    } catch (error) {
      alert(error?.response?.data?.detail || "Failed to send invitation.");
    } finally {
      setInvitingId(null);
    }
  };

  const handleCancelInvite = async (userId) => {
    try {
      setInvitingId(userId);
      await cancelInvitation(Number(opportunityId), userId);
      setInvitedUserIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
      alert("Invitation cancelled.");
    } catch (error) {
      alert(error?.response?.data?.detail || "Failed to cancel invitation.");
    } finally {
      setInvitingId(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingState message="scouting matching builders..." />
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
            {"\u2190"} back
          </button>

          {/* HERO */}
          <div className="ib-fade" style={{
            position: "relative",
            background: C.dark, color: C.bg,
            borderRadius: 28, padding: "40px 36px",
            marginBottom: 36,
            boxShadow: "0 14px 40px rgba(43,27,18,0.18)",
            transform: "rotate(-0.5deg)",
          }}>
            <h1 style={{
              fontFamily: '"Syne", sans-serif', fontWeight: 800,
              fontSize: "clamp(26px, 5vw, 42px)", lineHeight: 1.1,
              letterSpacing: "-0.02em", margin: 0,
            }}>
              invite builders for <span style={{ color: C.orange }}>{opportunity?.role}</span>
            </h1>
            <p style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: 14,
              color: "rgba(255,248,240,0.7)", marginTop: 12, maxWidth: 540, lineHeight: 1.6,
            }}>
              we've matched the skills required for this role with the top builders on the platform. Review their match profiles and send an invite to collaborate!
            </p>
          </div>

          {/* LIST OF BUILDERS */}
          <div className="ib-fade" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {matches.length === 0 ? (
              <div style={{
                background: C.surface, border: `1.5px dashed ${C.border}`,
                borderRadius: 22, padding: "48px 20px", textAlign: "center",
                fontFamily: '"DM Sans", sans-serif', color: C.muted,
              }}>
                <div style={{ display: "inline-flex", justifyContent: "center", width: "100%", color: C.muted }}><SearchIcon size={32} color="currentColor" /></div>
                <p style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 16, color: C.dark, marginTop: 12 }}>
                  no matching builders found
                </p>
                <p style={{ fontSize: 13, marginTop: 4 }}>try modifying the role's required tech stack to find a match!</p>
              </div>
            ) : (
              matches.map((user) => (
                <div
                  key={user.user_id}
                  className="ib-card"
                  style={{
                    background: C.surface,
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 22,
                    padding: "24px 28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  {/* Top row: Name, match stats, invite btn */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <h3 style={{
                        fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 20,
                        color: C.dark, margin: 0,
                      }}>
                        {user.name}
                      </h3>
                      <p style={{
                        fontFamily: '"DM Sans", sans-serif', fontSize: 13,
                        color: C.muted, margin: "4px 0 0",
                      }}>
                        {user.bio || "No bio yet — keeping it mysterious"}
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span style={{
                        fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 14,
                        color: user.skill_match >= 75 ? "#2E7D32" : C.brand,
                        background: user.skill_match >= 75 ? "#E8F5E9" : `${C.brand}12`,
                        padding: "6px 12px",
                        borderRadius: 999,
                        border: `1px solid ${user.skill_match >= 75 ? "#A5D6A7" : `${C.brand}20`}`,
                      }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <TargetIcon size={14} color="currentColor" /> {user.skill_match}% overlap
                        </span>
                      </span>

                      {invitedUserIds.has(user.user_id) ? (
                        <button
                          className="ib-btn-cancel"
                          onClick={() => handleCancelInvite(user.user_id)}
                          disabled={invitingId === user.user_id}
                          style={{
                            background: "transparent",
                            color: C.brand,
                            border: `1.5px solid ${C.brand}`,
                            borderRadius: 999,
                            padding: "9px 20px",
                            fontFamily: '"DM Sans", sans-serif',
                            fontWeight: 800,
                            fontSize: 13,
                            cursor: invitingId === user.user_id ? "wait" : "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                           {invitingId === user.user_id ? "Cancelling..." : (
                             <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                               <XIcon size={12} color="currentColor" /> Cancel Invite
                             </span>
                           )}
                        </button>
                      ) : (
                        <button
                          className="ib-btn-prime"
                          onClick={() => handleInvite(user.user_id)}
                          disabled={invitingId === user.user_id}
                          style={{
                            background: C.brand, color: "white", border: "none",
                            borderRadius: 999, padding: "10px 22px",
                            fontFamily: '"DM Sans", sans-serif', fontWeight: 800, fontSize: 13,
                            cursor: invitingId === user.user_id ? "wait" : "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                           {invitingId === user.user_id ? "Sending..." : (
                             <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                               <MailIcon size={13} color="currentColor" /> Invite
                             </span>
                           )}
                        </button>
                      )}

                      <button
                        className="ib-btn-ghost"
                        onClick={() => navigate(`/profile/${user.user_id}`)}
                        style={{
                          background: "transparent", color: C.dark2, border: `1.5px solid ${C.border}`,
                          borderRadius: 999, padding: "9px 20px",
                          fontFamily: '"DM Sans", sans-serif', fontWeight: 800, fontSize: 13,
                          cursor: "pointer", transition: "all 0.15s ease",
                        }}
                      >
                        view profile
                      </button>
                    </div>
                  </div>

                  {/* Skills Display */}
                  {user.user_skills && user.user_skills.length > 0 && (
                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                      <p style={{
                        fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 800,
                        color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em",
                        margin: "0 0 10px",
                      }}>
                        Skills:
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {user.user_skills.map((skill) => {
                          const isMatch = user.matching_skills.includes(skill);
                          return (
                            <span
                              key={skill}
                              style={{
                                background: isMatch ? `${C.brand}12` : C.sand,
                                color: isMatch ? C.brand : C.dark2,
                                border: `1px solid ${isMatch ? `${C.brand}25` : C.border}`,
                                borderRadius: 999,
                                padding: "4px 10px",
                                fontFamily: '"DM Sans", sans-serif',
                                fontWeight: 700,
                                fontSize: 12,
                              }}
                            >
                              {skill}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
