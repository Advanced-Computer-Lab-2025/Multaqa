"use client";

import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import ProtectedRoute from "@/context/ProtectedRoute";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import LoadingBlocks from "@/components/shared/LoadingBlocks";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MINIMUM_LOADING_TIME = 3000; // 3 seconds

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStartTime, setLoadingStartTime] = useState(Date.now());

  // Define all public (unprotected) routes
  const publicRoutes = ["/", "/login", "/register", "/test-events", "/support"];

  // Handle localized paths like /en/login or /ar/register
  const isPublic = publicRoutes.some((route) => {
    return (
      pathname === route ||
      pathname.endsWith(route) ||
      pathname.endsWith(route + "/")
    );
  });

  // Handle initial mount loading
  useEffect(() => {
    const elapsed = Date.now() - loadingStartTime;
    const remainingTime = Math.max(0, MINIMUM_LOADING_TIME - elapsed);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [loadingStartTime]);

  // Handle navigation loading - ONLY for public routes
  useEffect(() => {
    if (isPublic) {
      setIsLoading(true);
      setLoadingStartTime(Date.now());

      const timer = setTimeout(() => {
        setIsLoading(false);
      }, MINIMUM_LOADING_TIME);

      return () => clearTimeout(timer);
    }
  }, [pathname, isPublic]);

  // Show loading screen ONLY for public routes
  if (isLoading && isPublic) {
    return <LoadingBlocks />;
  }

  return (
    <AuthProvider>
      <NotificationProvider>
        {/* ✅ Only wrap in ProtectedRoute when route is NOT public */}
        {isPublic ? children : <ProtectedRoute>{children}</ProtectedRoute>}
        
        {/* Toast Container for notifications */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </NotificationProvider>
    </AuthProvider>
  );
}