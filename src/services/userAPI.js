import axios from "axios";

const API_BASE_URL = "http://100.114.40.116:8081";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem("accessToken");
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/user/currentUser", {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("getCurrentUser error:", error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/user/profile/${userId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("getUserProfile error:", error);
    throw error;
  }
};

export const updateUserAvatar = async (formData) => {
  try {
    const response = await api.put("/user/profile/update/avatar", formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("updateUserAvatar error:", error);
    throw error;
  }
};

export const updateUserBackground = async (formData) => {
  try {
    const response = await api.put(
      "/user/profile/update/backgroundImage",
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("updateUserBackground error:", error);
    throw error;
  }
};

export const createNewPost = async (formData) => {
  try {
    const response = await api.post("/post/create", formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("createNewPost error:", error);
    throw error;
  }
};

export const getNewestPost = async () => {
  try {
    const response = await api.get("/post/newestPost", {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("getNewestPost error:", error);
    throw error;
  }
};

export const searchUser = async (nameUser) => {
  try {
    const response = await api.get(
      `/user/search?username=${encodeURIComponent(nameUser)}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("searchUser error:", error);
    throw error;
  }
};

export const checkFriendShip = async (idUser) => {
  try {
    const response = await api.get(`/friend/checkFriendship/${idUser}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("checkFriendShip error:", error);
    throw error;
  }
};

export const checkFriendRequest = async (idUser) => {
  try {
    const response = await api.get(`/friendRequest/check/${idUser}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("checkFriendRequest error:", error);
    throw error;
  }
};

export const sendRequestMakeFriend = async (idUser) => {
  try {
    const response = await api.post(
      `/friendRequest/send/${idUser}`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("sendRequestMakeFriend error:", error);
    throw error;
  }
};

export const acceptRequestMakeFriend = async (idUser) => {
  try {
    const response = await api.post(
      `/friend/acceptRequest/${idUser}`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("acceptRequestMakeFriend error:", error);
    throw error;
  }
};

export const deleteFriend = async (idUser) => {
  try {
    const response = await api.delete(`/friend/delete/${idUser}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("deleteFriend error:", error);
    throw error;
  }
};

export const deleteFriendRequest = async (senderId, receiverId) => {
  try {
    const response = await api.post(
      `/friendRequest/delete?senderId=${senderId}&receiverId=${receiverId}`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("deleteFriendRequest error:", error);
    throw error;
  }
};

export const sendReaction = async (type, emotion, id) => {
  try {
    const response = await api.post(
      `/reaction/send`,
      { type, emotion, id },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("sendReaction error:", error);
    throw error;
  }
};

export const changeReaction = async (type, emotion, id) => {
  try {
    const response = await api.put(
      `/reaction/change`,
      { type, emotion, id },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("changeReaction error:", error);
    throw error;
  }
};

export const deleteReaction = async (postID) => {
  try {
    const response = await api.delete(
      `/reaction/deletePostReaction/${postID}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("deleteReaction error:", error);
    throw error;
  }
};

export const createCommentPost = async (formData, postID) => {
  try {
    const response = await api.post(
      `/postComment/create/post/${postID}`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("createCommentPost error:", error);
    throw error;
  }
};
