import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import LoadingState from "../../components/ui/LoadingState";
import EmptyState from "../../components/ui/EmptyState";



import {
  getOpportunityApplications,
  acceptApplication,
  rejectApplication,
} from "../../api/applications";

export default function OpportunityApplicants() {
  const { opportunityId } = useParams();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadApplications = useCallback(async () => {
    try {
      const data = await getOpportunityApplications(
        opportunityId
      );

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
      alert(
        error?.response?.data?.detail ||
          "Failed to accept application"
      );
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectApplication(id);
      await loadApplications();
    } catch (error) {
      alert(
        error?.response?.data?.detail ||
          "Failed to reject application"
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
      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-8">
          Applicants
        </h1>

        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <EmptyState
              headline="No applications yet"
              sub="No builders have applied to this role yet. We will notify you when applications arrive."
            />
          </div>
        ) : (

          <div className="space-y-5">

            {applications.map((app) => (

              <div
                key={app.id}
                className="bg-white rounded-xl shadow p-6"
              >

                <div className="flex justify-between items-start">

                  <div>
                    <h2 className="text-2xl font-bold">
                      {app.user.name}
                    </h2>

                    <p className="text-gray-500 mt-1">
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

                <div className="mt-4">

                  <p className="text-gray-700">
                    {app.user.bio ||
                      "No bio provided."}
                  </p>

                </div>

                <div className="grid grid-cols-2 gap-4 mt-5">

                  <div className="bg-gray-100 rounded-lg p-4">
                    <p className="text-xs text-gray-500">
                      Activity Score
                    </p>

                    <p className="text-2xl font-bold">
                      {app.user.activity_score}
                    </p>
                  </div>

                  <div className="bg-gray-100 rounded-lg p-4">
                    <p className="text-xs text-gray-500">
                      Reliability Score
                    </p>

                    <p className="text-2xl font-bold">
                      {app.user.reliability_score}
                    </p>
                  </div>

                </div>

                <div className="mt-5">

                  <Link
                    to={`/profile/${app.user.id}`}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    View Full Profile →
                  </Link>

                </div>

                {app.status === "pending" && (

                  <div className="flex gap-3 mt-6">

                    <button
                      onClick={() =>
                        handleAccept(app.id)
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        handleReject(app.id)
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                    >
                      Reject
                    </button>

                  </div>

                )}

              </div>

            ))}

          </div>
        )}

      </div>
    </Layout>
  );
}