import * as request from "../utils/request.js";

export const getCurrentUser = async () => {
    return await request.get("/user/currentUser", {
        headers: {
          Authorization: `Bearer ` + localStorage.getItem("accessToken")
        }
    });
};

export const getProfile = async (userId) => {
    return await request.get(`/user/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ` + localStorage.getItem("accessToken")
        }
    });
}