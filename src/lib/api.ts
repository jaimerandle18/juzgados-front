// lib/api.ts
"use client";

import axios from "axios";
import { getCookie } from "cookies-next";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
});

// 👉 Adjuntar token automáticamente
api.interceptors.request.use((config) => {
  const token = getCookie("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 👉 NO BORRAR COOKIES ACÁ
// El AuthGuard es el único responsable de redirigir.
// Esto evita que Next borre cookies por preloads o SSR.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
