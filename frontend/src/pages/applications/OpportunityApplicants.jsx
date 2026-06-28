import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import LoadingState from "../../components/ui/LoadingState";
import EmptyState from "../../components/ui/EmptyState";
import { useToast } from "../../hooks/useToast";



import {
  getOpportunityApplications,
  acceptApplication,
  rejectApplication,
} from "../../api/applications";

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
  success:  "#2E7D32",
};

export default function OpportunityApplicants() {
  const { opportunityId } = useParams();
  const { toast } = useToast();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadApplications = useCallback(async () => {
    try {
      const data = await getOpportunityApplications(opportunityId);
      setApplications(data);
    } catch {
      // Suppressed console.error in production
    } finally {
      setLoading(false);
    }
  }, [opportunityId]);

  useEffect(() => {
    const init = async () => {
      await loadApplications();
    };
    init();
  }, [loadApplications]);

  const handleAccept = async (id) => {
    try {
      await acceptApplication(id);
      await loadApplications();
    } catch (error) {
      toast(
        error?.response?.data?.detail ||
          "Failed to accept application",
        "error"
      );
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectApplication(id);
      await loadApplications();
    } catch (error) {
      toast(
        error?.response?.data?.detail ||
          "Failed to reject application",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingState message="Loading applicants..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ minHeight: "100vh", background: C.bg, paddingTop: 32, fontFamily: '"Manrope", sans-serif' }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "16px 24px 60px" }}>

          <Link to="/incoming" style={{
            textDecoration: "none", fontSize: 13, fontWeight: 700,
            color: C.muted, marginBottom: 24, display: "inline-flex", alignItems: "center", gap: 6,
            fontFamily: '"Manrope", sans-serif'
          }}>
            ← back to incoming
          </Link>

          <h1 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 700,
            color: C.dark,
            lineHeight: 0.9,
            marginBottom: 28,
          }}>
            <span style={{ display: "block", fontSize: "0.5em", textTransform: "uppercase", letterSpacing: "0.15em", color: C.brand, fontWeight: 800, marginBottom: 6, fontFamily: '"Manrope", sans-serif' }}>
              Review
            </span>
            Applicants.
          </h1>

          {applications.length === 0 ? (
            <div style={{
              background: C.surface,
              borderRadius: 24,
              border: `1px solid ${C.orange}`,
              padding: 40,
              textAlign: "center"
            }}>
              <EmptyState
                headline="No applications yet"
                sub="No builders have applied to this role yet. We will notify you when applications arrive."
              />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {applications.map((app) => (
                <div
                  key={app.id}
                  style={{
                    background: C.surface,
                    borderRadius: 24,
                    border: `1px solid ${C.orange}`,
                    padding: 28,
                    transition: "transform 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <h2 style={{
                        fontFamily: '"Melody by W.", "Melody", sans-serif',
                        fontWeight: 800,
                        fontSize: 22,
                        color: C.dark,
                        margin: 0,
                      }}>
                        {app.user.name}
                      </h2>
                      <p style={{
                        fontSize: 13,
                        color: C.muted,
                        marginTop: 4,
                        fontFamily: '"Manrope", sans-serif',
                        margin: "4px 0 0"
                      }}>
                        {app.user.email}
                      </p>
                    </div>

                    <span style={{
                      background: app.status === "pending" ? "#FFF8F0" : app.status === "accepted" ? "#F3FAF5" : "#FFF5F5",
                      color: app.status === "pending" ? "#D48A2D" : app.status === "accepted" ? "#2E7D32" : "#B8391F",
                      padding: "6px 14px",
                      borderRadius: 0,
                      border: "1px solid #F4A460",
                      fontFamily: '"Manrope", sans-serif',
                      fontSize: 11,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      whiteSpace: "nowrap",
                    }}>
                      {app.status}
                    </span>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <p style={{
                      fontSize: 14,
                      color: C.dark2,
                      lineHeight: 1.6,
                      fontStyle: "italic",
                      borderLeft: `3px solid ${C.brand}`,
                      paddingLeft: 14,
                      margin: 0,
                    }}>
                      {app.user.bio ? `"${app.user.bio}"` : "No bio provided."}
                    </p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                    <div style={{ background: C.cream, borderRadius: 12, border: `1px solid ${C.border}`, padding: "14px 16px" }}>
                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, fontFamily: '"Manrope", sans-serif', margin: 0 }}>
                        Activity Score
                      </p>
                      <p style={{ fontFamily: '"Melody by W.", "Melody", sans-serif', fontSize: 26, fontWeight: 800, color: C.orange, margin: "6px 0 0" }}>
                        {app.user.activity_score}
                      </p>
                    </div>

                    <div style={{ background: C.cream, borderRadius: 12, border: `1px solid ${C.border}`, padding: "14px 16px" }}>
                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, fontFamily: '"Manrope", sans-serif', margin: 0 }}>
                        Reliability Score
                      </p>
                      <p style={{ fontFamily: '"Melody by W.", "Melody", sans-serif', fontSize: 26, fontWeight: 800, color: C.orange, margin: "6px 0 0" }}>
                        {app.user.reliability_score}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                    <div>
                      <Link
                        to={`/profile/${app.user.id}`}
                        style={{
                          color: C.brand,
                          fontWeight: 700,
                          fontSize: 13,
                          textDecoration: "none",
                          fontFamily: '"Manrope", sans-serif',
                        }}
                      >
                        View Full Profile →
                      </Link>
                    </div>

                    {app.status === "pending" && (
                      <div style={{ display: "flex", gap: 12 }}>
                        <button
                          onClick={() => handleAccept(app.id)}
                          style={{
                            background: "#2E7D32",
                            color: "white",
                            border: "none",
                            borderRadius: 0,
                            padding: "10px 24px",
                            fontFamily: '"Manrope", sans-serif',
                            fontWeight: 700,
                            fontSize: 13,
                            cursor: "pointer",
                            transition: "opacity 0.2s",
                          }}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(app.id)}
                          style={{
                            background: "#B8391F",
                            color: "white",
                            border: "none",
                            borderRadius: 0,
                            padding: "10px 24px",
                            fontFamily: '"Manrope", sans-serif',
                            fontWeight: 700,
                            fontSize: 13,
                            cursor: "pointer",
                            transition: "opacity 0.2s",
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}