import axios from "axios";

import { auth, logout } from "./firebase.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;
    if (response?.status === 401 && !config?._retry && auth.currentUser) {
      config._retry = true;
      const token = await auth.currentUser.getIdToken(true);
      config.headers.Authorization = `Bearer ${token}`;
      return api(config);
    }
    if (response?.status === 401) {
      try {
        await logout();
      } catch {
        // best-effort logout
      }
      if (typeof window !== "undefined") {
        window.alert("Sess\u00e3o expirada. Fa\u00e7a login novamente.");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
