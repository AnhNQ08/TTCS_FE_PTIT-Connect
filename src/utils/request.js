import axios from "axios";
import * as authService from "../api/authentication.js";

const request = axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 5000,
});

let isRefreshing = false;
let failedRequestsQueue = [];

const refreshToken = async () => {
  try {
    const response = await authService.refreshToken();
    const newAccessToken = response.accessToken;
    const newRefreshToken = response.refreshToken;
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    return newAccessToken;
  } catch (e) {
    console.error("Error refreshing token:", e);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
    return null;
  }
};

request.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.data === "AccessToken expired!") {
      if (isRefreshing) {
        return new Promise((resolve) => {
          failedRequestsQueue.push((newToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(axios(originalRequest));
          });
        });
      }
      isRefreshing = true;
      const newAccessToken = await refreshToken();
      isRefreshing = false;
      if (newAccessToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        const res = await axios(originalRequest);
        failedRequestsQueue.forEach((callback) => callback(newAccessToken));
        failedRequestsQueue = [];
        return res;
      }
    }
    return Promise.reject(error);
  }
);

export const get = async (api, options = {}) => {
  const response = await request.get(api, options);
  return response.data;
};

export const post = async (api, options = {}, config = {}) => {
  const response = await request.post(api, options, config);
  return response.data;
};

export const erase = async (api, config = {}) => {
  const response = await request.delete(api, config);
  return response.data;
};
