import api from "./api.js";

export async function getProfile() {
  const response = await api.get("/me");
  return response.data;
}
