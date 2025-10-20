"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api } from "@/api";
import { useRouter, usePathname } from "@/i18n/navigation";
import { MeResponse, UserResponse } from "../../../backend/interfaces/responses/authResponses.interface";

interface AuthContextType {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<{ user: UserResponse } | undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserResponse | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Avoid calling /auth/me on public routes
  const publicRoutes = ["/login", "/register", "/signup", "/en"];
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      } 
      
      try {
        const response = await api.post<MeResponse>("/auth/me");
        if (response.data?.user) {
          setUser(response.data.user);
          console.log("✅ User loaded:", user);
        } else {
          throw new Error("Invalid /auth/me response");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("❌ Failed to fetch user:", error);
        // If we get here, it means the interceptor couldn't refresh the token or there was a different error, so we should logout
        localStorage.removeItem("token");
        await api
          .post("/auth/logout", {}, { withCredentials: true })
          .catch(() => { });
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Only check auth if not on a public route
    if (!isPublic) initializeAuth();
    else setIsLoading(false);
  }, [pathname]);

  // Login
  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      setIsLoading(true);
      try {
        const response = await api.post("/auth/login", credentials);
        const { success, message, accessToken, user } = response.data;
        if (success) {
          // Set access token in local storage
          localStorage.setItem("token", accessToken);

          setUser(user);
          console.log("User set after login:", user);
          // Return the user data for navigation purposes
          return { user };
        } else {
          throw new Error(message || "Login failed");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        const msg = err?.response?.data?.message || err.message;
        setError(msg);
        throw new Error(msg);
      } finally {
        setIsLoading(false);
      }
    }, []
  );

  // Signup
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const signup = useCallback(async (data: any) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/signup", data);
      if (response.data?.success) {
        console.log("✅ Signed up successfully");
      } else {
        throw new Error(response.data?.message || "Signup failed");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message;
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      // clear refreshToken from cookies by making a logout request
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch { }
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
