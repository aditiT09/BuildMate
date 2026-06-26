import api from "./axios";

export const getMySkills = async () => {
  const response = await api.get("/user-skills");
  return response.data;
};

export const addSkill = async (skillId) => {
  const response = await api.post(
    "/user-skills",
    {
      skill_id: skillId,
    }
  );

  return response.data;
};

export const getSkills = async () => {
  const response = await api.get("/skills/skills?limit=1000");
  return response.data;
};
export const removeSkill = async (skillId) => {
  const response = await api.delete(
    `/user-skills/${skillId}`
  );

  return response.data;
};

export const createSkill = async (name) => {
  const response = await api.post(
    `/skills/?name=${encodeURIComponent(name)}`
  );

  return response.data;
};