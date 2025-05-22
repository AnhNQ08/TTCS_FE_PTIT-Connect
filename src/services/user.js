import * as request from "../utils/request.js";

export const getCurrentUser = async () => {
  return await request.get("/user/currentUser", {
    headers: {
      Authorization: `Bearer ` + localStorage.getItem("accessToken")
    }
  });
};
