import api from "./axios";

export const createInvitation = async (data) => {
  const response = await api.post("/invitations/", data);
  return response.data;
};

export const getReceivedInvitations = async () => {
  const response = await api.get("/invitations/received");
  return response.data;
};

export const getSentInvitations = async () => {
  const response = await api.get("/invitations/sent");
  return response.data;
};

export const respondToInvitation = async (invitationId, status) => {
  const response = await api.put(`/invitations/${invitationId}/respond`, {
    status,
  });
  return response.data;
};

export const cancelInvitation = async (opportunityId, userId) => {
  const response = await api.delete(`/invitations/opportunity/${opportunityId}/user/${userId}`);
  return response.data;
};

