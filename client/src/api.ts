import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000",
});

// Attach token if present
api.interceptors.request.use((config) => {
  if (process.env.NODE_ENV !== "development") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
