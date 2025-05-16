import axios from "axios";
import * as authService from "./authentication.js";

const request = axios.create({
  baseURL: "http://100.114.40.116:5173",
  timeout: 5000,
});

let isRefreshing = false;
let failedRequestsQueue = [];

request.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

const refreshToken = async () => {
  try {
    const result = await authService.refreshToken();

    if (result.error) {
      throw new Error(result.error);
    }

    const newAccessToken = result.data?.accessToken;
    if (!newAccessToken) throw new Error("No new access token in response");

    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", newAccessToken);
    }
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

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    const isAccessTokenExpired =
      error.response?.status === 401 &&
      ((typeof error.response.data === "string" &&
        error.response.data.includes("AccessToken expired")) ||
        (error.response.data?.message &&
          error.response.data.message.includes("AccessToken expired")));

    if (isAccessTokenExpired) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push((newToken) => {
            if (!newToken) {
              reject(error);
              return;
            }
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(request(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const newAccessToken = await refreshToken();

      isRefreshing = false;

      if (newAccessToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        failedRequestsQueue.forEach((cb) => cb(newAccessToken));
        failedRequestsQueue = [];
        return request(originalRequest);
      } else {
        failedRequestsQueue.forEach((cb) => cb(null));
        failedRequestsQueue = [];
        if (typeof window !== "undefined") {
          localStorage.clear();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export const get = async (api, options = {}) => {
  try {
    const response = await request.get(api, options);
    return response.data;
  } catch (error) {
    console.error(`GET ${api} failed:`, error);
    throw error;
  }
};

export const post = async (api, data = {}, config = {}) => {
  try {
    const response = await request.post(api, data, config);
    return response.data;
  } catch (error) {
    console.error(`POST ${api} failed:`, error);
    throw error;
  }
};

export const put = async (api, data = {}, config = {}) => {
  try {
    const response = await request.put(api, data, config);
    return response.data;
  } catch (error) {
    console.error(`PUT ${api} failed:`, error);
    throw error;
  }
};

export const erase = async (api, config = {}) => {
  try {
    const response = await request.delete(api, config);
    return response.data;
  } catch (error) {
    console.error(`DELETE ${api} failed:`, error);
    throw error;
  }
};
