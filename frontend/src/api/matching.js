import api from "./axios";

export const getProjectMatches = async (projectId) => {
  const response = await api.get(
    `/matching/projects/${projectId}/matches`
  );

  return response.data;
};