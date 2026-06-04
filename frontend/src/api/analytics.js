import api from "./axios";

export const getOverview = async () => {
  const response = await api.get(
    "/analytics/overview"
  );

  return response.data;
};