import { useEffect, useState } from "react";
import { getMyApplications } from "../../api/applications";
import Layout from "../../components/layout/Layout";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await getMyApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto p-6">
          Loading applications...
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto p-6 text-red-500">
          {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-8">
          My Applications
        </h1>

        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center">
            You haven't applied to any opportunities yet.
          </div>
        ) : (
          <div className="space-y-5">

            {applications.map((application) => (

              <div
                key={application.id}
                className="bg-white rounded-xl shadow p-6"
              >

                <div className="flex justify-between items-start">

                  <div>

                    <h2 className="text-2xl font-bold">
                      {application.opportunity.project.title}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      Role: {application.opportunity.role}
                    </p>

                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      application.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : application.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {application.status.toUpperCase()}
                  </span>

                </div>

                {application.opportunity.description && (
                  <p className="mt-4 text-gray-700">
                    {application.opportunity.description}
                  </p>
                )}

              </div>

            ))}

          </div>
        )}

      </div>
    </Layout>
  );
}