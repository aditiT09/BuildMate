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

export const getProjectSkills = async () => {
  const response = await api.get(
    "/project-skills/"
  );

  return response.data;
};