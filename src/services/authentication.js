import * as request from "../utils/request.js";

export const login = async (identifier, password) => {
  return await request.post("authenticate/login", { identifier, password }, {});
};

export const register = async (identifier, password, fullName) => {
  return await request.post(
    "authenticate/register",
    { identifier, password, fullName },
    {}
  );
};

export const refreshToken = async () => {
  return await request.post(
    "authenticate/refreshToken",
    {},
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("refreshToken"),
      },
    }
  );
};

export const logout = async () => {
  return await request.post(
    "logout",
    {},
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    }
  );
};
