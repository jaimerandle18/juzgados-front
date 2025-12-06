import { api } from "./api";

export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

export const registerUser = (data: any) =>
  api.post("/auth/register", data);

export const getMe = () =>
  api.get("/usuarios/me");

export const getMyVotes = () =>
  api.get("/usuarios/votes");
