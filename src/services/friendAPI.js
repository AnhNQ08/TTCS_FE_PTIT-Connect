import { api, getAuthHeaders } from "./index";

export const checkFriendShip = async (idUser) => {
  const res = await api.get(`/friend/checkFriendship/${idUser}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const checkFriendRequest = async (idUser) => {
  const res = await api.get(`/friendRequest/check/${idUser}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const sendRequestMakeFriend = async (idUser) => {
  const res = await api.post(
    `/friendRequest/send/${idUser}`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );
  return res.data;
};

export const acceptRequestMakeFriend = async (idUser) => {
  const res = await api.post(
    `/friend/acceptRequest/${idUser}`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );
  return res.data;
};

export const deleteFriend = async (idUser) => {
  const res = await api.delete(`/friend/delete/${idUser}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const deleteFriendRequest = async (senderId, receiverId) => {
  const res = await api.post(
    `/friendRequest/delete?senderId=${senderId}&receiverId=${receiverId}`,
    {},
    { headers: getAuthHeaders() }
  );
  return res.data;
};
