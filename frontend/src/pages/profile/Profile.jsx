import { useEffect, useState } from "react";

import {
  getCurrentUser,
  updateCurrentUser,
} from "../../api/users";

function Profile() {
  const [user, setUser] = useState(null);

  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getCurrentUser();

      setUser(data);

      setFormData({
        name: data.name || "",
        bio: data.bio || "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      const updatedUser =
        await updateCurrentUser(formData);

      setUser(updatedUser);

      setEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return (
      <div className="p-6">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Profile
      </h1>

      <div className="bg-white rounded-xl shadow p-6">

        {editing ? (
          <>
            <label className="block mb-2 font-medium">
              Name
            </label>

            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="w-full border rounded p-2 mb-4"
            />

            <label className="block mb-2 font-medium">
              Bio
            </label>

            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bio: e.target.value,
                })
              }
              rows={4}
              className="w-full border rounded p-2"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Save
              </button>

              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold">
              {user.name}
            </h2>

            <p className="text-gray-600 mt-1">
              {user.email}
            </p>

            <p className="mt-4">
              {user.bio || "No bio added yet"}
            </p>

            <button
              onClick={() => setEditing(true)}
              className="mt-4 px-4 py-2 border rounded"
            >
              Edit Profile
            </button>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <p className="font-medium">
                  Activity Score
                </p>

                <p className="text-2xl font-bold">
                  {user.activity_score}
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <p className="font-medium">
                  Reliability Score
                </p>

                <p className="text-2xl font-bold">
                  {user.reliability_score}
                </p>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Profile;