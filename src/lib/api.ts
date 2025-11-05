import axios from "axios";
import { getCookie, deleteCookie } from "cookies-next";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = getCookie("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn("🔒 Token expirado, cerrando sesión...");
      deleteCookie("auth_token"); // ✅ elimina la cookie
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
