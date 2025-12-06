// lib/api.ts
"use client";

import axios from "axios";
import { getCookie } from "cookies-next";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
});

// AGREGO TOKEN AUTOMÁTICO
api.interceptors.request.use((config) => {
  const token = getCookie("auth_token"); // ← AHORA SÍ
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// SI EXPIRA → logout automático
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // saco la cookie inválida
      document.cookie =
        "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
