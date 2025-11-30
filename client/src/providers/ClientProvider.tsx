"use client";

import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import ProtectedRoute from "@/context/ProtectedRoute";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import LoadingBlocks from "@/components/shared/LoadingBlocks";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MINIMUM_LOADING_TIME = 3000; // 3 seconds

// Define Public Routes
const publicRoutes = ["/", "/login", "/register", "/test-events", "/support"];

// Helper to check if a specific path is public
const checkIsPublic = (path: string) => {
  if (/^\/[a-z]{2}\/?$/.test(path)) return true;
  return publicRoutes.some((route) => {
    return path === route || path.endsWith(route) || path.endsWith(route + "/");
  });
};

// "No Loading" routes for the landing pages
const noLoadingRoutes = ["/", "/login", "/register"];
const isNoLoadingRoute = (path: string) => {
  if (/^\/[a-z]{2}\/?$/.test(path)) return true;
  return noLoadingRoutes.some(
    (route) =>
      path === route || path.endsWith(route) || path.endsWith(route + "/")
  );
};

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(!isNoLoadingRoute(pathname));
  const [loadingStartTime, setLoadingStartTime] = useState(Date.now());
  const prevPathRef = useRef(pathname);

  // Check if current path is public for rendering logic
  const isPublic = checkIsPublic(pathname);

  // Handle navigation loading
  useEffect(() => {
    // Skip if path hasn't changed
    if (prevPathRef.current === pathname) return;

    // Check specific specific landing page transitions (Your previous request)
    const isPrevNoLoading = isNoLoadingRoute(prevPathRef.current);
    const isCurrentNoLoading = isNoLoadingRoute(pathname);

    // Check if routes are Public or Protected
    const isPrevPublic = checkIsPublic(prevPathRef.current);
    const isCurrentPublic = checkIsPublic(pathname);

    // Transitioning between Public landing pages (Login <-> Register)
    if (isPrevNoLoading && isCurrentNoLoading) {
      prevPathRef.current = pathname;
      return;
    }

    // CONDITION 2: Transitioning between Protected internal pages (Tabs/Sidebar)
    // If both previous and current are NOT public, we are just switching tabs inside the app.
    if (!isPrevPublic && !isCurrentPublic) {
      prevPathRef.current = pathname;
      return;
    }

    // Otherwise (e.g., Login -> Dashboard, or Dashboard -> Logout), show loading screen
    setIsLoading(true);
    setLoadingStartTime(Date.now());
    prevPathRef.current = pathname;
  }, [pathname]);

  // Handle initial mount loading
  useEffect(() => {
    const elapsed = Date.now() - loadingStartTime;
    const remainingTime = Math.max(0, MINIMUM_LOADING_TIME - elapsed);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [loadingStartTime]);

  // Show loading screen
  if (isLoading) {
    return <LoadingBlocks />;
  }

  return (
    <AuthProvider>
      <NotificationProvider>
        {/* ✅ Only wrap in ProtectedRoute when route is NOT public */}
        {isPublic ? children : <ProtectedRoute>{children}</ProtectedRoute>}

        {/* Toast Container for notifications */}
        <ToastContainer
          position="bottom-right"
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
