import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CelebrationIcon, DeadIcon, TimelineIcon, HatIcon, HopeIcon, MailIcon, MailOpenIcon, CheckIcon } from "../../components/common/Icons";

import { getMyApplications } from "../../api/applications";
import { getReceivedInvitations, respondToInvitation } from "../../api/invitations";
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

const STATUS_META = {
  accepted: { icon: <CelebrationIcon size={14} />, label: "accepted", bg: "#EAF3E7", fg: C.green, border: "#CDE3C7" },
  rejected: { icon: <DeadIcon size={14} />, label: "rejected", bg: "#FBEAE6", fg: C.brandDk, border: "#F4CFC6" },
  pending:  { icon: <TimelineIcon size={14} />, label: "pending", bg: "#FBF1DE", fg: "#A6741C", border: "#F0DCB3" },
};

const tilt = (n) => {
  const seq = [-1.6, 1.2, -0.8, 1.8, -1.2, 0.9];
  return seq[n % seq.length];
};

const STYLES = `
  @keyframes floatIn { from { opacity:0; transform: translateY(10px) } to { opacity:1; transform: translateY(0) } }
  @keyframes spin { to { transform: rotate(360deg) } }
  .ma-fade { animation: floatIn .35s ease both; }
  .ma-card { transition: transform .18s ease, box-shadow .18s ease; }
  .ma-card:hover { transform: rotate(0deg) translateY(-3px) !important; box-shadow: 0 14px 32px rgba(43,27,18,0.12) !important; }
  .ma-link:hover { transform: translateX(3px); }
  .ma-link { transition: transform .15s ease; }
  .ma-cta:hover { background: ${C.brandDk}; transform: translateY(-2px); }
`;

export default function MyApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = useCallback(async () => {
    try {
      const [appData, inviteData] = await Promise.all([
        getMyApplications(),
        getReceivedInvitations(),
      ]);
      setApplications(appData);
      setInvitations(inviteData);
    } catch {
      setError("couldn't load your applications");

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchApplications();
    };
    init();
  }, [fetchApplications]);

  const handleRespond = async (invitationId, status) => {
    try {
      setLoading(true);
      await respondToInvitation(invitationId, status);
      alert(`Invitation ${status}!`);
      await fetchApplications();
    } catch (err) {
      alert(err?.response?.data?.detail || "Failed to respond to invitation.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingState message="checking your inbox..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorState message={error} onRetry={fetchApplications} />
      </Layout>
    );
  }


  return (
    <Layout>
      <style>{STYLES}</style>
      <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 80 }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "36px 20px 0" }}>

          {/* HERO */}
          <div className="ma-fade" style={{
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
              your applications
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
              where you've thrown your hat in <HatIcon size={32} color="currentColor" />
            </h1>

            <p style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: 14,
              color: "rgba(255,248,240,0.7)", marginTop: 14, maxWidth: 480, lineHeight: 1.6,
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 6,
            }}>
              every role you've applied for, and where it stands. fingers crossed <HopeIcon size={14} color="rgba(255,248,240,0.7)" />
            </p>
          </div>

          {/* PENDING INVITATIONS */}
          {invitations.filter(inv => inv.status === "pending").length > 0 && (
            <div className="ma-fade" style={{ marginBottom: 36 }}>
              <h2 style={{
                fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 22,
                color: C.dark, marginBottom: 16, display: "flex", alignItems: "center", gap: 8
              }}>
                <MailIcon size={20} color={C.dark} /> Collaboration Invites ({invitations.filter(inv => inv.status === "pending").length})
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {invitations.filter(inv => inv.status === "pending").map((invite) => (
                  <div
                    key={invite.id}
                    style={{
                      background: C.surface, border: `2px solid ${C.orange}`,
                      borderRadius: 20, padding: "20px 24px",
                      boxShadow: `4px 4px 0px ${C.orange}`,
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      flexWrap: "wrap", gap: 12
                    }}
                  >
                    <div>
                      <h3 style={{
                        fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 18,
                        color: C.dark, margin: "0 0 4px"
                      }}>
                        {invite.opportunity?.project?.title}
                      </h3>
                      <p style={{
                        fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: C.muted, margin: 0
                      }}>
                        invited you to join as <span style={{ color: C.dark2, fontWeight: 700 }}>{invite.opportunity?.role}</span>
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => handleRespond(invite.id, "accepted")}
                        style={{
                          background: C.green, color: "white", border: "none",
                          borderRadius: 999, padding: "8px 18px",
                          fontFamily: '"DM Sans", sans-serif', fontWeight: 800, fontSize: 13,
                          cursor: "pointer", transition: "all .15s ease",
                          display: "inline-flex", alignItems: "center", gap: 6,
                        }}
                      >
                        <CheckIcon size={13} color="white" /> Accept
                      </button>
                      <button
                        onClick={() => handleRespond(invite.id, "rejected")}
                        style={{
                          background: "transparent", color: C.brand, border: `1.5px solid ${C.brand}40`,
                          borderRadius: 999, padding: "8px 18px",
                          fontFamily: '"DM Sans", sans-serif', fontWeight: 800, fontSize: 13,
                          cursor: "pointer", transition: "all .15s ease",
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {applications.length === 0 ? (
            <div className="ma-fade" style={{
              border: `1.5px dashed ${C.border}`, borderRadius: 22, padding: "50px 24px",
              background: C.surface, display: "flex", justifyContent: "center"
            }}>
              <EmptyState
                icon={<MailOpenIcon size={40} color={C.muted} />}
                headline="nothing here yet"
                sub="you haven't applied to any roles yet. go find a project that's looking for someone like you"
                cta="browse projects"
                href="/discover"
              />
            </div>
          ) : (

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {applications.map((application, i) => {
                const meta = STATUS_META[application.status] || STATUS_META.pending;

                return (
                  <div
                    key={application.id}
                    className="ma-fade ma-card"
                    style={{
                      background: C.surface, border: `1.5px solid ${C.border}`,
                      borderRadius: 20, padding: "22px 24px",
                      transform: `rotate(${tilt(i)}deg)`,
                    }}
                  >
                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                      gap: 12, flexWrap: "wrap", marginBottom: 10,
                    }}>
                      <div style={{ minWidth: 0 }}>
                        <h2 style={{
                          fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 22,
                          color: C.dark, margin: "0 0 4px",
                        }}>
                          {application.opportunity?.project?.title || "untitled project"}
                        </h2>
                        <p style={{
                          fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: C.muted, margin: 0,
                        }}>
                          applied for <span style={{ color: C.dark2, fontWeight: 700 }}>
                            {application.opportunity?.role}
                          </span>
                        </p>
                      </div>

                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        background: meta.bg, color: meta.fg, border: `1px solid ${meta.border}`,
                        borderRadius: 999, padding: "6px 14px",
                        fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 800,
                        textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap",
                      }}>
                        <span style={{ display: "flex", alignItems: "center" }}>{meta.icon}</span> {meta.label}
                      </span>
                    </div>

                    {application.opportunity?.description && (
                      <p style={{
                        fontFamily: '"DM Sans", sans-serif', fontSize: 14, color: C.dark2,
                        lineHeight: 1.65, margin: "10px 0 12px",
                      }}>
                        {application.opportunity.description}
                      </p>
                    )}

                    {application.opportunity?.project?.id && (
                      <a
                        className="ma-link"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/projects/${application.opportunity.project.id}`);
                        }}
                        href={`/projects/${application.opportunity.project.id}`}
                        style={{
                          display: "inline-flex", fontFamily: '"DM Sans", sans-serif',
                          fontWeight: 800, fontSize: 13, color: C.brand, textDecoration: "none",
                        }}
                      >
                        view project →
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}