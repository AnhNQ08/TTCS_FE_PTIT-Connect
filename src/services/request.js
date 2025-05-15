import axios from "axios";
import * as authService from "./authentication.js";

const request = axios.create({
  baseURL: "http://100.114.40.116:8081/",
  timeout: 5000,
});

let isRefreshing = false;
let failedRequestsQueue = [];

const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    console.log("Refresh token:", refreshToken);

    const response = await authService.refreshToken(refreshToken);
    const newAccessToken = response.accessToken;

    localStorage.setItem("accessToken", newAccessToken);
    return newAccessToken;
  } catch (e) {
    console.error("Error refreshing token:", e);
    return null;
  }
};
request.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.data === "AccessToken expired!") {
      if (isRefreshing) {
        return new Promise((resolve) => {
          failedRequestsQueue.push((newToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(request(originalRequest));
          });
        });
      }

      isRefreshing = true;
      const newAccessToken = await refreshToken();
      isRefreshing = false;

      if (newAccessToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        const res = await request(originalRequest);

        failedRequestsQueue.forEach((callback) => callback(newAccessToken));
        failedRequestsQueue = [];

        return res;
      }
    }

    return Promise.reject(error);
  }
);

export const get = async (api, options = {}) => {
  const token = localStorage.getItem("accessToken");
  const response = await request.get(api, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  return response.data;
};

export const post = async (api, data = {}, config = {}) => {
  const token = localStorage.getItem("accessToken");
  const response = await request.post(api, data, {
    ...config,
    headers: {
      Authorization: `Bearer ${token}`,
      ...config.headers,
    },
  });
  return response.data;
};

export const put = async (api, data = {}, config = {}) => {
  const token = localStorage.getItem("accessToken");
  const response = await request.put(api, data, {
    ...config,
    headers: {
      Authorization: `Bearer ${token}`,
      ...config.headers,
    },
  });
  return response.data;
};

export const erase = async (api, config = {}) => {
  const token = localStorage.getItem("accessToken");
  const response = await request.delete(api, {
    ...config,
    headers: {
      Authorization: `Bearer ${token}`,
      ...config.headers,
    },
  });
  return response.data;
};
