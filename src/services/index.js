import axios from "axios";

const API_BASE_URL = "http://100.114.40.116:8081";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const getAuthHeaders = () => {
  const accessToken = localStorage.getItem("accessToken");
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};
