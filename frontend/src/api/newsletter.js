import api from "./axios";

export const subscribeEmail = async (email) => {
  const response = await api.post("/subscribe", {
    email,
  });

  return response.data;
};