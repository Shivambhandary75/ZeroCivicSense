import api from "./axios";

export const loginUser = (credentials) => api.post("/auth/login", credentials);

export const register = (userData) => api.post("/auth/register", userData);

export const getMe = () => api.get("/auth/me");

export const changePassword = (data) =>
  api.patch("/auth/change-password", data);
