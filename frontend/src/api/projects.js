import api from "./axios";

export const getProjects = async () => {
  const response = await api.get("/projects");
  return response.data;
};

export const getProjectById = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (projectData) => {
  const response = await api.post(
    "/projects",
    projectData
  );

  return response.data;
};

export const getMyProjects = async () => {
  const response = await api.get("/projects/me");
  return response.data;
};