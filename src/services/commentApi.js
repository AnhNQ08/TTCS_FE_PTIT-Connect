import { api, getAuthHeaders } from "./index";

export const createCommentPost = async (formData, postID) => {
  const res = await api.post(`/postComment/create/post/${postID}`, formData, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
