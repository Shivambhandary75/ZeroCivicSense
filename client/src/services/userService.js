import api from "./axios";

// Official/Admin: Get all active contractors
export const getContractors = () =>
  api.get("/users/contractors").then((r) => r.data);

// Admin: Get all users
export const getAllUsers = () =>
  api.get("/users").then((r) => r.data);

// Self: Update profile
export const updateProfile = (data) =>
  api.patch("/users/profile", data).then((r) => r.data);
