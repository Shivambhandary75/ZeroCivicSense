import api from "./axios";

// Official/Admin: Get all active contractors (optionally include inactive for admin tab)
export const getContractors = (department, includeInactive = false) => {
  const params = {};
  if (department) params.department = department;
  if (includeInactive) params.includeInactive = "true";
  return api.get("/users/contractors", { params }).then((r) => r.data);
};

// Admin: Get all users
export const getAllUsers = () => api.get("/users").then((r) => r.data);

// Authority: Blacklist (deactivate) a user
export const blacklistUser = (userId) =>
  api.patch(`/users/${userId}/deactivate`).then((r) => r.data);

// Authority: Reactivate a blacklisted user
export const reactivateUser = (userId) =>
  api.patch(`/users/${userId}/reactivate`).then((r) => r.data);

// Self: Update profile
export const updateProfile = (data) =>
  api.patch("/users/profile", data).then((r) => r.data);
