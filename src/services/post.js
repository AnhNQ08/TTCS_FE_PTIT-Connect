import { api, getAuthHeaders } from "./index";

export const createNewPost = async (formData) => {
  const res = await api.post("/post/create", formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getNewestPost = async () => {
  const res = await api.get("/post/newestPost", { headers: getAuthHeaders() });
  return res.data;
};
