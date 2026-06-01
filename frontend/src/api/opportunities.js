import api from "./axios";

export const getProjectOpportunities = async (projectId) => {
  const response = await api.get(
    `/opportunities/project/${projectId}`
  );

  return response.data;
};

export const createOpportunity = async (data) => {
  const response = await api.post(
    "/opportunities/",
    data
  );

  return response.data;
};