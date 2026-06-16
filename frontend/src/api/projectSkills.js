import api from "./axios";

export const addProjectSkill = async (
  projectId,
  skillId
) => {
  const response = await api.post(
    "/project-skills/",
    {
      project_id: projectId,
      skill_id: skillId,
    }
  );

  return response.data;
};

export const getProjectSkills = async (projectId) => {
  const response = await api.get(
    `/project-skills/${projectId}`
  );

  return response.data;
};

export const removeProjectSkill = async (projectId, skillId) => {
  const response = await api.delete(
    `/project-skills/${projectId}/skills/${skillId}`
  );

  return response.data;
};