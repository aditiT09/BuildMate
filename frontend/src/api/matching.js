import api from "./axios";

export const getProjectMatches = async (projectId) => {
  const response = await api.get(
    `/matching/projects/${projectId}/matches`
  );

  return response.data;
};

export const getSkillGap = async (projectId, userId) => {
  const response = await api.get(
    `/matching/projects/${projectId}/users/${userId}/skill-gap`
  );

  return response.data;
};