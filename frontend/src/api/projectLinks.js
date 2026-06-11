import api from "./axios";

export const getProjectLinks = async (projectId) => {
  const response = await api.get(
    `/projects/${projectId}/links`
  );

  return response.data;
};

export const createProjectLink = async (
  projectId,
  data
) => {
  const response = await api.post(
    `/projects/${projectId}/links`,
    data
  );

  return response.data;
};

export const deleteProjectLink = async (
  projectId,
  linkId
) => {
  const response = await api.delete(
    `/projects/${projectId}/links/${linkId}`
  );

  return response.data;
};