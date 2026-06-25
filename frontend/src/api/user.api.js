import api from "./axios";

// PROFILE
export const getProfile = () =>
  api.get("/users/profile");