import * as request from "../utils/request.js";

export const login = async (email, password) => {
  try {
    const response = await request.post("authenticate/login", {
      email,
      password,
    });
    const { accessToken, refreshToken } = response;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    return response;
  } catch (error) {
    console.error("Đăng nhập thất bại", error);
    throw error;
  }
};
export const register = async (email, password, userName) => {
  try {
    const response = await request.post("authenticate/register", {
      email,
      password,
      userName,
    });
    return response;
  } catch (error) {
    console.error("Đăng ký thất bại", error);
    throw error;
  }
};
export const refreshToken = async () => {
  try {
    const response = await request.post(
      "authenticate/refresh-token",
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
        },
      }
    );
    const { accessToken, refreshToken } = response;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    return response;
  } catch (error) {
    console.error("Lỗi làm mới token:", error);
    throw error;
  }
};
export const logout = async () => {
  try {
    const response = await request.post(
      "logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return response;
  } catch (error) {
    console.error("Đăng xuất thất bại", error);
    throw error;
  }
};
