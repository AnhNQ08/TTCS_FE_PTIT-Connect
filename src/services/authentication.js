import * as request from "./request.js";

export const login = async (email, password) => {
  try {
    const data = await request.post("/authenticate/login", { email, password });

    if (data.token) {
      localStorage.setItem("accessToken", data.token);
    }
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }

    return { data, error: null };
  } catch (error) {
    console.error("Login failed:", error);
    return { data: null, error: error.message || "Login failed" };
  }
};

export const signUp = async (email, password, userName) => {
  try {
    const data = await request.post("/authenticate/register", {
      email,
      password,
      userName,
    });
    return { data, error: null };
  } catch (error) {
    console.error("Sign up failed:", error);
    return { data: null, error: error.message || "Sign up failed" };
  }
};

export const refreshToken = async () => {
  try {
    const refreshTokenValue = localStorage.getItem("refreshToken");
    if (!refreshTokenValue) {
      throw new Error("No refresh token found");
    }

    const data = await request.post(
      "/authenticate/refresh-token",
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshTokenValue}`,
        },
      }
    );

    return { data, error: null };
  } catch (error) {
    console.error("Refresh token failed:", error);
    return { data: null, error: error.message || "Failed to refresh token" };
  }
};

export const logout = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }

    const data = await request.post(
      "/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    localStorage.clear();
    return { data, error: null };
  } catch (error) {
    console.error("Logout failed:", error);
    return { data: null, error: error.message || "Logout failed" };
  }
};
