import AsyncStorage from "@react-native-async-storage/async-storage";
import * as request from "./request";

export const login = async (email, password) => {
  try {
    const response = await request.post("authenticate/login", {
      email,
      password,
    });
    return { data: response, error: null };
  } catch (error) {
    console.error("Login failed:", error);
    return { data: null, error: error.message || "Login failed" };
  }
};

export const signUp = async (email, password, userName) => {
  try {
    const response = await request.post("authenticate/register", {
      email,
      password,
      userName,
    });
    return { data: response, error: null };
  } catch (error) {
    console.error("Sign up failed:", error);
    return { data: null, error: error.message || "Sign up failed" };
  }
};

export const refreshToken = async () => {
  try {
    const refreshTokenValue = await AsyncStorage.getItem("refreshToken");
    const response = await request.post(
      "authenticate/refresh-token",
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshTokenValue}`,
        },
      }
    );
    return { data: response, error: null };
  } catch (error) {
    console.error("Refresh token failed:", error);
    return { data: null, error: error.message || "Failed to refresh token" };
  }
};

export const logout = async () => {
  try {
    const accessToken = await AsyncStorage.getItem("accessToken");
    const response = await request.post(
      "logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return { data: response, error: null };
  } catch (error) {
    console.error("Logout failed:", error);
    return { data: null, error: error.message || "Logout failed" };
  }
};
