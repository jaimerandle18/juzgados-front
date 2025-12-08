// lib/api.ts
"use client";

import axios from "axios";
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
});

// AGREGO TOKEN AUTOMÁTICO
api.interceptors.request.use((config) => {
  const token =  sessionStorage.getItem("auth_token")
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// SI EXPIRA → logout automático
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // saco la cookie inválida
    sessionStorage.clear()
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
