import axios from "axios";
import { API_CONFIG } from "../config/api";

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
});

console.log("API Client initialized with base URL:", API_CONFIG.BASE_URL);

// Request interceptor to add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
            {
              refreshToken,
            }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem("token", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } catch {
          // Refresh failed, clear tokens and redirect to login
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

export const getTokenExpirationTime = (token: string): Date | null => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return new Date(payload.exp * 1000);
  } catch {
    return null;
  }
};
