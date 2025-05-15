import axios from "axios";

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL =
  "http://100.114.40.116:8081/");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const getCurrentUser = async () => {
  const accessToken = localStorage.getItem("accessToken");
  return await api.get("/user/currentUser", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getUserProfile = async (userId) => {
  const accessToken = localStorage.getItem("accessToken");
  return await api.get(`/user/profile/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const updateUserAvatar = async (formData) => {
  const accessToken = localStorage.getItem("accessToken");
  return await api.put("/user/profile/update/avatar", formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateUserBackground = async (formData) => {
  const accessToken = localStorage.getItem("accessToken");
  return await api.put("/user/profile/update/backgroundImage", formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const createNewPost = async (formData) => {
  const accessToken = localStorage.getItem("accessToken");
  return await api.post("/post/create", formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getNewestPost = async () => {
  const accessToken = localStorage.getItem("accessToken");
  return await api.get("/post/newestPost", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const searchUser = async (nameUser) => {
  const accessToken = localStorage.getItem("accessToken");
  return await api.get(`/user/search?username=${nameUser}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const checkFriendShip = async (idUser) => {
  const accessToken = localStorage.getItem("accessToken");
  return await api.get(`/friend/checkFriendship/${idUser}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const checkFriendRequest = async (idUser) => {
  const accessToken = localStorage.getItem("accessToken");
  return await api.get(`/friendRequest/check/${idUser}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const sendRequestMakeFriend = async (idUser) => {
  const accessToken = localStorage.getItem("accessToken");
  return await api.post(
    `/friendRequest/send/${idUser}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export const acceptRequestMakeFriend = async (idUser) => {
  const accessToken = localStorage.getItem("accessToken");
  return await api.post(
    `/friend/acceptRequest/${idUser}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export const deleteFriend = async (idUser) => {
  const accessToken = localStorage.getItem("accessToken");
  return await api.delete(`/friend/delete/${idUser}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const deleteFriendRequest = async (senderId, receiverId) => {
  const accessToken = localStorage.getItem("accessToken");
  return await api.post(
    `/friendRequest/delete?senderId=${senderId}&receiverId=${receiverId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export const sendReaction = async (type, emotion, id) => {
  const accessToken = localStorage.getItem("accessToken");
  return await api.post(
    `/reaction/send`,
    {
      type,
      emotion,
      id,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export const changeReaction = async (type, emotion, id) => {
  const accessToken = localStorage.getItem("accessToken");
  return await api.put(
    `/reaction/change`,
    {
      type,
      emotion,
      id,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export const deleteReaction = async (postID) => {
  const accessToken = localStorage.getItem("accessToken");
  return await api.delete(`/reaction/deletePostReaction/${postID}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const createCommentPost = async (formData, postID) => {
  const accessToken = localStorage.getItem("accessToken");
  return await api.post(`/postComment/create/post/${postID}`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    },
  });
};
