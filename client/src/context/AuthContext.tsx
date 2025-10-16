import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { api } from "../api";

// Define roles to match backend
export enum UserRole {
  STUDENT = "student",
  STAFF_MEMBER = "staffMember",
  VENDOR = "vendor",
  ADMINISTRATION = "administration",
}

// Define user type (from backend)
interface INotification {
  title: string;
  message: string;
  createdAt: string;
}

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  registeredAt: string;
  updatedAt: string;
  status: "active" | "blocked";

  // Student fields
  firstName?: string;
  lastName?: string;
  gucId?: string;
  walletBalance?: number;
  favorites?: string[];
  registeredEvents?: string[];

  // Staff fields
  staffPosition?: string;

  // Vendor fields
  companyName?: string;

  // Admin fields
  adminRole?: string;

  // Common fields
  notifications?: INotification[];
}

// Credentials types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupStudentStaffData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gucId: string;
}

export interface SignupVendorData {
  companyName: string;
  email: string;
  password: string;
}

export type SignupData = SignupStudentStaffData | SignupVendorData;

// Auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bootstrap user on load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Make sure Authorization header is added to request in the API interceptor
        const response = await api.get("/auth/me");

        // Check if response has the expected structure
        if (response.data?.user) {
          setUser(response.data.user);
        } else {
          console.error("Invalid response format:", response.data);
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Token invalid or expired:", err);
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  // Login
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", credentials);
      const { success, message, accessToken, user } = response.data;

      if (success) {
        localStorage.setItem("token", accessToken);
        setUser(user);
      } else {
        throw new Error(message || "Login failed");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Login failed.";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Signup
  const signup = useCallback(async (data: SignupData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/signup", data);

      // Backend returns success and user data but does not automatically log in
      // based on the response: { success: true, message: string, user: User }

      // Return the response data for further processing if needed
      // The user will need to verify their email and login separately
      return response.data;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Signup failed.";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      // The backend handles clearing the refreshToken cookie
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      // We still need to clear the access token from localStorage
      localStorage.removeItem("token");
      setUser(null);
      // Redirect to login page
      window.location.href = "/login";
    }
  }, []);

  // Clear errors
  const clearError = useCallback(() => setError(null), []);

  // Context value
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    signup,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
