import axios from "axios";
import type { MeResponse } from "../../backend/interfaces/responses/authResponses.interface"; // ✅ added

export const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

// global setUser registration
export let setUserFn: ((user: MeResponse["user"] | null) => void) | null = null;
export const registerSetUser = (fn: typeof setUserFn) => {
  setUserFn = fn;
};

// Endpoints that should automatically trigger /auth/me after completion
const autoRefreshEndpoints = [
  "/events/:id",
  "/users/register/:eventId",
  "/users/favorites/:eventId",
  "/payments/:eventId/wallet",
  "/payments/:eventId/refund",
  "/vendorEvents/:eventId/bazaar",
  "/vendorEvents/:eventId/vendor-requests/:vendorId",
  "/vendorEvents/:eventId/cancel",
  "/vendorEvents/booth",
  "/workshops/:workshopId",
  "/workshops",
  "/workshops/:professorId/:workshopId/status",
];

// Attach token if present
api.interceptors.request.use((config) => {
  // Always attach token if available, regardless of environment
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

// Handle token expiration globally
api.interceptors.response.use(
  async (response) => {
    // automatically refresh user after calling certain endpoints
    const shouldRefresh = autoRefreshEndpoints.some((pattern) => {
      const regex = new RegExp("^" + pattern.replace(/:[^/]+/g, "[^/]+") + "$");
      const relativeUrl = response.config.url?.replace(
        api.defaults.baseURL!,
        ""
      );

      const match = relativeUrl && regex.test(relativeUrl);
      return match;
    });

    if (shouldRefresh && setUserFn) {
      try {
        const meRes = await api.get<MeResponse>("/auth/me");
        if (meRes.data?.user) {
          setUserFn(meRes.data.user);
        }
      } catch (err) {
        console.error("❌ Failed to refresh user automatically:", err);
      }
    }
    return response;
  },

  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          "http://localhost:4000/auth/refresh-token",
          {},
          {
            withCredentials: true,
          }
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("token", newAccessToken);

        api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        localStorage.removeItem("token");
        // clear refresh token cookie by making a logout request
        await axios.post(
          "http://localhost:4000/auth/logout",
          {},
          {
            withCredentials: true,
          }
        );
        if (!window.location.pathname.endsWith("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);
