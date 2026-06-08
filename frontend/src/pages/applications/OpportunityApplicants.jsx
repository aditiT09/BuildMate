import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import Layout from "../../components/layout/Layout";

import {
  getOpportunityApplications,
  acceptApplication,
  rejectApplication,
} from "../../api/applications";

export default function OpportunityApplicants() {
  const { opportunityId } = useParams();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await getOpportunityApplications(
        opportunityId
      );

      setApplications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await acceptApplication(id);
      loadApplications();
    } catch (error) {
      alert(
        error?.response?.data?.detail ||
          "Failed to accept application"
      );

      console.error(error);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectApplication(id);
      loadApplications();
    } catch (error) {
      alert(
        error?.response?.data?.detail ||
          "Failed to reject application"
      );

      console.error(error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-10">
          Loading applicants...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Applicants
        </h1>

        {applications.length === 0 && (
          <div className="bg-white rounded-xl shadow p-6 text-center">
            No applications yet.
          </div>
        )}

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

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    app.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : app.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {app.status}
                </span>

              </div>

              <div className="mt-4">

                <p className="text-gray-700">
                  {app.user.bio ||
                    "No bio provided."}
                </p>

              </div>

              <div className="mt-4">

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

      </div>
    </Layout>
  );
}