import { api, getAuthHeaders } from "./index";

export const getCurrentUser = async () => {
  const res = await api.get("/user/currentUser", { headers: getAuthHeaders() });
  return res.data;
};

export const getUserProfile = async (userId) => {
  const res = await api.get(`/user/profile/${userId}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const updateUserAvatar = async (formData) => {
  const res = await api.put("/user/profile/update/avatar", formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateUserBackground = async (formData) => {
  const res = await api.put("/user/profile/update/backgroundImage", formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const searchUser = async (nameUser) => {
  const res = await api.get(
    `/user/search?username=${encodeURIComponent(nameUser)}`,
    {
      headers: getAuthHeaders(),
    }
  );
  return res.data;
};
