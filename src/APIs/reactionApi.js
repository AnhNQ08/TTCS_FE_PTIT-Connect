import { api, getAuthHeaders } from "./index";

export const sendReaction = async (type, emotion, id) => {
  const res = await api.post(
    "/reaction/send",
    { type, emotion, id },
    {
      headers: getAuthHeaders(),
    }
  );
  return res.data;
};

export const changeReaction = async (type, emotion, id) => {
  const res = await api.put(
    "/reaction/change",
    { type, emotion, id },
    {
      headers: getAuthHeaders(),
    }
  );
  return res.data;
};

export const deleteReaction = async (postID) => {
  const res = await api.delete(`/reaction/deletePostReaction/${postID}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};
