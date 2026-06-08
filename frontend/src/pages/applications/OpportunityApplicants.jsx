import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import { Link } from
"react-router-dom";

import {
  getOpportunityApplications,
  acceptApplication,
  rejectApplication,
} from "../../api/applications";

export default function OpportunityApplicants() {
  const { opportunityId } = useParams();

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data =
        await getOpportunityApplications(
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
        <div>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Applicants
        </h1>

        <div className="space-y-4">
        

          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white p-5 rounded-xl shadow"
            >
            <h2 className="text-xl font-bold">
  {app.user.name}
</h2>

<p className="text-sm text-gray-500 mb-2">
  User ID: {app.user.id}
</p>

<Link
  to={`/profile/${app.user.id}`}
  className="text-blue-600 hover:underline"
>
  View Profile
</Link>

<p className="text-gray-600 mt-2">
  {app.user.bio || "No bio provided"}
</p>

<p className="text-sm text-gray-500">
  {app.user.email}
</p>
              {app.status === "pending" && (
                <div className="flex gap-3 mt-4">

                  <button
                    onClick={() =>
                      handleAccept(app.id)
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      handleReject(app.id)
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded"
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