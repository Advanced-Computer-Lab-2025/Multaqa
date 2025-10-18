"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api } from "../api";
import { useRouter, usePathname } from "@/i18n/navigation";
import axios from "axios";
import { MeResponse } from "../../../backend/interfaces/responses/authResponses.interface";

interface AuthContextType {
  user: MeResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<{ user: MeResponse } | undefined>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<MeResponse | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Avoid calling /auth/me on public routes
  const publicRoutes = ["/login", "/register", "/signup", "/en"];
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await api.post("/auth/me");
        if (response.data?.user) {
          setUser(response.data.user);
          console.log("✅ User loaded:", response.data.user);
        } else {
          throw new Error("Invalid /auth/me response");
        }
      } catch (error) {
        console.error("❌ Failed to fetch user:", error);
        localStorage.removeItem("token");
        await api
          .post("/auth/logout", {}, { withCredentials: true })
          .catch(() => {});
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // 👇 Only check auth if not on a public route
    if (!isPublic) initializeAuth();
    else setIsLoading(false);
  }, [pathname]);

  // ✅ Login
  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      setIsLoading(true);
      try {
        const response = await api.post("/auth/login", credentials);
        const { success, message, accessToken, user } = response.data;
        if (success) {
          localStorage.setItem("token", accessToken);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          setUser(user);
          console.log("✅ Logged in as:", user);
          return { user };
        } else throw new Error(message || "Login failed");
      } catch (err: any) {
        const msg = err?.response?.data?.message || err.message;
        setError(msg);
        throw new Error(msg);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ✅ Signup
  const signup = useCallback(async (data: any) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/signup", data);
      if (response.data?.success) {
        console.log("✅ Signed up successfully");
      } else {
        throw new Error(response.data?.message || "Signup failed");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message;
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Logout
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch {}
    localStorage.removeItem("token");
    setUser(null);
    router.replace("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        signup,
        logout,
        setError,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
