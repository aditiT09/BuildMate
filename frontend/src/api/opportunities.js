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

export const getOpportunity = async (opportunityId) => {
  const response = await api.get(
    `/opportunities/${opportunityId}`
  );

  return response.data;
};

export const updateOpportunity = async (opportunityId, data) => {
  const response = await api.put(
    `/opportunities/${opportunityId}`,
    data
  );

  return response.data;
};