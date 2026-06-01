import api from "./axios";

export const getProjectOpportunities = async (
  projectId
) => {
  const response = await api.get(
    `/opportunities/project/${projectId}`
  );

  return response.data;
};