import api from "./axios";

export const getMyProfile = async () => {
  const response = await api.get("/profile/me");
  return response.data;
};

export const saveProfile = async (profileData) => {
  const response = await api.put(
    "/profile/me",
    profileData
  );

  return response.data;
};

export const getProfile = async (userId) => {
  const response = await api.get(
    `/profile/${userId}`
  );

  return response.data;
};