import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProjectMatches } from "../../api/matching";
import Layout from "../../components/layout/Layout";

export default function MatchResults() {
  const { id } = useParams();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, [id]);

  const loadMatches = async () => {
    try {
      const data = await getProjectMatches(id);
      setMatches(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sortedMatches = [...matches].sort(
    (a, b) => b.match_score - a.match_score
  );

  if (loading) {
    return (
      <Layout>
        <div className="p-10">
          Loading matches...
        </div>
      </Layout>
    );
  }

  if (matches.length === 0) {
    return (
      <Layout>
        <div className="p-10">
          No matches found.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#F5F5DC] py-10 px-6">
        <div className="max-w-4xl mx-auto">

          <h1 className="text-4xl font-bold text-[#2B1B12] mb-8">
            Top Matches
          </h1>

          <div className="space-y-5">

            {sortedMatches.map((match, index) => (
              <div
                key={match.user_id}
                className="bg-white rounded-2xl shadow-md p-6"
              >
                <div className="flex justify-between items-center mb-4">

                  <div className="flex items-center gap-3">

                    <span className="bg-[#E35336] text-white px-3 py-1 rounded-full text-sm font-medium">
                      #{index + 1}
                    </span>

                    <h2 className="text-xl font-semibold text-[#2B1B12]">
                      {match.name}
                    </h2>

                  </div>

                  <span className="text-lg font-bold text-[#2B1B12]">
                    {match.match_score}%
                  </span>

                </div>

                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">

                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${
                      match.match_score >= 70
                        ? "bg-green-500"
                        : match.match_score >= 40
                        ? "bg-[#E35336]"
                        : "bg-gray-400"
                    }`}
                    style={{
                      width: `${match.match_score}%`,
                    }}
                  />

                </div>

              </div>
            ))}

          </div>

        </div>
      </div>
    </Layout>
  );
}