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
export const getOpportunityApplications = async (
  opportunityId
) => {
  const response = await api.get(
    `/applications/opportunity/${opportunityId}`
  );

  return response.data;
};

export const acceptApplication = async (
  applicationId
) => {
  const response = await api.put(
    `/applications/${applicationId}/accept`
  );

  return response.data;
};

export const rejectApplication = async (
  applicationId
) => {
  const response = await api.put(
    `/applications/${applicationId}/reject`
  );

  return response.data;
};