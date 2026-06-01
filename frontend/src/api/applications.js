import api from "./axios";

export const getMyApplications = async () => {
  const response = await api.get("/applications/me");
  return response.data;
};