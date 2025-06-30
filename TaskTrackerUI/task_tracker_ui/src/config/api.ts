export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5038/api",
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/Auth/login",
      REGISTER: "/Auth/register",
      REFRESH: "/Auth/refresh",
      LOGOUT: "/Auth/logout",
    },
  },
};
