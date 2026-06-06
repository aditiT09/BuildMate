import { useEffect, useState } from "react";

import {
getCurrentUser,
updateCurrentUser,
} from "../../api/users";

import {
getMySkills,
getSkills,
addSkill,
removeSkill
} from "../../api/userSkills";


function Profile() {
const [user, setUser] = useState(null);

const [editing, setEditing] = useState(false);

const [formData, setFormData] = useState({
name: "",
bio: "",
});

const [skills, setSkills] = useState([]);
const [allSkills, setAllSkills] = useState([]);
const [selectedSkill, setSelectedSkill] =
useState("");

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

  const mySkills = await getMySkills();
  setSkills(mySkills);

  const availableSkills =
    await getSkills();

  setAllSkills(availableSkills);

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

const handleAddSkill = async () => {
if (!selectedSkill) return;


try {
  await addSkill(
    Number(selectedSkill)
  );

  const updatedSkills =
    await getMySkills();

  setSkills(updatedSkills);

  setSelectedSkill("");

} catch (error) {
  console.error(error);
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

  } catch (error) {
    console.error(error);
  }
};


if (!user) {
return ( <div className="p-6"> <p>Loading...</p> </div>
);
}
console.log("Skills:", skills);
return ( <div className="max-w-3xl mx-auto p-6">

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
            onClick={() =>
              setEditing(false)
            }
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
          {user.bio ||
            "No bio added yet"}
        </p>

        <button
          onClick={() =>
            setEditing(true)
          }
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

  <div className="bg-white rounded-xl shadow p-6 mt-6">
    <h2 className="text-xl font-semibold mb-4">
      Skills
    </h2>

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
        className="px-4 py-2 bg-black text-white rounded"
      >
        Add
      </button>
    </div>
  </div>

</div>


);
}

export default Profile;
