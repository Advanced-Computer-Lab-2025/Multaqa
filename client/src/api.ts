import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

// Attach token if present
api.interceptors.request.use((config) => {
  // Always attach token if available, regardless of environment
  console.log("Attaching token to request");
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

// Handle token expiration globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 403 &&
      !originalRequest._retry
    ) {
      console.log("🔄 Attempting to refresh token");
      originalRequest._retry = true;
      try {
        const res = await axios.post("http://localhost:4000/auth/refresh-token", {}, {
          withCredentials: true,
        });

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("token", newAccessToken);

        api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        localStorage.removeItem("token");
        // clear refresh token cookie by making a logout request
        await axios.post("http://localhost:4000/auth/logout", {}, {
          withCredentials: true,
        });
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);