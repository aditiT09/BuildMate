import { useEffect, useState } from "react";

import {
  getCurrentUser,
  updateCurrentUser,
} from "../../api/users";

import {
  getMySkills,
  getSkills,
  addSkill,
  removeSkill,
} from "../../api/userSkills";

function Profile() {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
  full_name: "",
  bio: "",
  college: "",
  degree: "",
  github: "",
  linkedin: "",
  portfolio: "",
  avatar: "",
  availability: "",
});

  const [skills, setSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);

  const [selectedSkill, setSelectedSkill] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const [
        userData,
        mySkills,
        availableSkills,
      ] = await Promise.all([
        getCurrentUser(),
        getMySkills(),
        getSkills(),
      ]);

      setUser(userData);

      setFormData({
  full_name: userData.full_name || "",
  bio: userData.bio || "",
  college: userData.college || "",
  degree: userData.degree || "",
  github: userData.github || "",
  linkedin: userData.linkedin || "",
  portfolio: userData.portfolio || "",
  avatar: userData.avatar || "",
  availability: userData.availability || "",
});

      setSkills(mySkills);
      setAllSkills(availableSkills);

    } catch (err) {
      console.error(err);
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updatedUser =
        await updateCurrentUser(formData);

      setUser(updatedUser);

      setEditing(false);

    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      bio: user.bio || "",
    });

    setEditing(false);
  };

  const handleAddSkill = async () => {
    if (!selectedSkill) return;

    try {
      await addSkill(Number(selectedSkill));

      const updatedSkills =
        await getMySkills();

      setSkills(updatedSkills);

      setSelectedSkill("");

    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveSkill = async (
    skillId
  ) => {
    try {
      await removeSkill(skillId);

      const updatedSkills =
        await getMySkills();

      setSkills(updatedSkills);

    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

     <h1
  className="
    text-5xl
    font-bold
    mb-8
    font-['Cormorant_Garamond']
  "
>
        Profile
      </h1>

      <div
  className="
    rounded-3xl
    border
    border-[#d7c7b3]
    bg-[#faf6ef]
    p-6
    shadow-sm
  "
>

        {editing ? (
          <>
            <label className="block mb-2 font-medium">
              Name
            </label>

            <input
              type="text"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  full_name: e.target.value,
                })
              }
              className="w-full border rounded p-2 mb-4"
            />

            <label className="block mb-2 font-medium">
              Bio
            </label>

            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bio: e.target.value,
                })
              }
              className="w-full border rounded p-2"
            />

            <label className="block mt-4 mb-2 font-medium">
              College
            </label>

            <input
              type="text"
              value={formData.college}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  college: e.target.value,
                })
              }
              className="w-full border rounded p-2"
            />

            <label className="block mt-4 mb-2 font-medium">
              Degree
            </label>

            <input
              type="text"
              value={formData.degree}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  degree: e.target.value,
                })
              }
              className="w-full border rounded p-2"
            />


<label className="block mt-4 mb-2 font-medium">
  GitHub
</label>

<input
  type="text"
  value={formData.github}
  onChange={(e) =>
    setFormData({
      ...formData,
      github: e.target.value,
    })
  }
  className="w-full border rounded p-2"
/>

<label className="block mt-4 mb-2 font-medium">
  LinkedIn
</label>

<input
  type="text"
  value={formData.linkedin}
  onChange={(e) =>
    setFormData({
      ...formData,
      linkedin: e.target.value,
    })
  }
  className="w-full border rounded p-2"
/>

<label className="block mt-4 mb-2 font-medium">
  Portfolio
</label>

<input
  type="text"
  value={formData.portfolio}
  onChange={(e) =>
    setFormData({
      ...formData,
      portfolio: e.target.value,
    })
  }
  className="w-full border rounded p-2"
/>

<label className="block mt-4 mb-2 font-medium">
  Avatar URL
</label>

<input
  type="text"
  value={formData.avatar}
  onChange={(e) =>
    setFormData({
      ...formData,
      avatar: e.target.value,
    })
  }
  className="w-full border rounded p-2"
/>

<label className="block mt-4 mb-2 font-medium">
  Availability
</label>

<input
  type="text"
  value={formData.availability}
  onChange={(e) =>
    setFormData({
      ...formData,
      availability: e.target.value,
    })
  }
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
                onClick={handleCancel}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h2
  className="
    text-3xl
    font-bold
    font-['Syne']
  "
>
              {user.name}
            </h2>

            <p className="text-gray-600 mt-1">
              {user.email}
            </p>

            <p className="mt-4">
              {user.bio || "No bio added yet"}
            </p>
            <div className="mt-4 space-y-2">

  {user.college && (
    <p>
      <strong>College:</strong> {user.college}
    </p>
  )}

  {user.degree && (
    <p>
      <strong>Degree:</strong> {user.degree}
    </p>
  )}

  {user.github && (
    <p>
      <strong>GitHub:</strong> {user.github}
    </p>
  )}

  {user.linkedin && (
    <p>
      <strong>LinkedIn:</strong> {user.linkedin}
    </p>
  )}

  {user.portfolio && (
    <p>
      <strong>Portfolio:</strong> {user.portfolio}
    </p>
  )}

  {user.availability && (
    <p>
      <strong>Availability:</strong> {user.availability}
    </p>
  )}

</div>

            <button
              onClick={() =>
                setEditing(true)
              }
              className="mt-4 px-4 py-2 border rounded"
            >
              Edit Profile
            </button>

            <div className="grid grid-cols-2 gap-4 mt-6">

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

      <div className="bg-white rounded-xl shadow p-6 mt-6">

        <h2 className="text-xl font-semibold mb-4">
          Skills
        </h2>

        {skills.length === 0 ? (
          <p className="text-gray-500 mb-4">
            No skills added yet.
          </p>
        ) : (
          <div className="space-y-2 mb-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex justify-between items-center border rounded px-3 py-2"
              >
                <span>
                  {skill.name}
                </span>

                <button
                  onClick={() =>
                    handleRemoveSkill(
                      skill.id
                    )
                  }
                  className="text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">

          <select
            value={selectedSkill}
            onChange={(e) =>
              setSelectedSkill(
                e.target.value
              )
            }
            className="border rounded p-2"
          >
            <option value="">
              Select Skill
            </option>

            {allSkills.map((skill) => (
              <option
                key={skill.id}
                value={skill.id}
              >
                {skill.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddSkill}
            className="
px-5
py-3
rounded-full
bg-[#c4622d]
text-white
font-medium
hover:scale-105
transition
"
          >
            Add
          </button>

        </div>

      </div>

    </div>
  );
}

export default Profile;