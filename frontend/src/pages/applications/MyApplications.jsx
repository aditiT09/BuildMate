import { useEffect, useState } from "react";
import { getMyApplications } from "../../api/applications";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getMyApplications();
        setApplications(data);
      } catch (err) {
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        Loading applications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        {error}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="p-6">
        No applications found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        My Applications
      </h1>

      <div className="space-y-4">
        {applications.map((application) => (
          <div
            key={application.id}
            className="border rounded-lg p-4 shadow-sm"
          >
            <h2 className="text-xl font-semibold">
              {application.opportunity.project.title}
            </h2>

            <p className="text-gray-600">
              Role: {application.opportunity.role}
            </p>

            <div className="mt-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  application.status === "accepted"
                    ? "bg-green-100 text-green-700"
                    : application.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {application.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}