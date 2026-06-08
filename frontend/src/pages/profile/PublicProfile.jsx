import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProfile } from "../../api/profile";

function PublicProfile() {
  const { userId } = useParams();

  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const data =
        await getProfile(userId);

      setProfile(data);

    } catch (error) {

      if (
        error.response?.status === 404
      ) {
        setProfile(null);
      } else {
        console.error(error);
      }

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        This user has not created a profile yet.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">

      <div className="bg-white rounded-xl shadow p-6">

        {profile.avatar && (
          <img
            src={profile.avatar}
            alt="avatar"
            className="w-28 h-28 rounded-full object-cover mb-4"
          />
        )}

        <h1 className="text-3xl font-bold">
          {profile.full_name ||
            "Unnamed User"}
        </h1>

        <p className="mt-4">
          {profile.bio ||
            "No bio added yet."}
        </p>

        <div className="mt-6 space-y-2">

          {profile.college && (
            <p>
              <strong>College:</strong>{" "}
              {profile.college}
            </p>
          )}

          {profile.degree && (
            <p>
              <strong>Degree:</strong>{" "}
              {profile.degree}
            </p>
          )}

          {profile.availability && (
            <p>
              <strong>Availability:</strong>{" "}
              {profile.availability}
            </p>
          )}

          {profile.github && (
            <p>
              <strong>GitHub:</strong>{" "}
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
              >
                {profile.github}
              </a>
            </p>
          )}

          {profile.linkedin && (
            <p>
              <strong>LinkedIn:</strong>{" "}
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                {profile.linkedin}
              </a>
            </p>
          )}

          {profile.portfolio && (
            <p>
              <strong>Portfolio:</strong>{" "}
              <a
                href={profile.portfolio}
                target="_blank"
                rel="noreferrer"
              >
                {profile.portfolio}
              </a>
            </p>
          )}

        </div>

      </div>

    </div>
  );
}

export default PublicProfile;