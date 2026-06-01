import api from "./axios";

export const getMyApplications = async () => {
  const response = await api.get("/applications/me");
  return response.data;
};

export const createApplication = async (opportunityId) => {
  const response = await api.post(
    "/applications",
    {
      opportunity_id: opportunityId
    }
  );

  return response.data;
};