"use client";

import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/context/ProtectedRoute";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import LoadingBlocks from "@/components/shared/LoadingBlocks";

const MINIMUM_LOADING_TIME = 2000; // 3 seconds

// Define routes that should NOT trigger loading when navigating between them
const noLoadingRoutes = ["/", "/login", "/register"];

const isNoLoadingRoute = (path: string) => {
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
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStartTime, setLoadingStartTime] = useState(Date.now());
  const prevPathRef = useRef(pathname);

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

  // Handle navigation loading
  useEffect(() => {
    // Skip if path hasn't changed
    if (prevPathRef.current === pathname) return;

    const isPrevNoLoading = isNoLoadingRoute(prevPathRef.current);
    const isCurrentNoLoading = isNoLoadingRoute(pathname);

    // If transitioning between two no-loading routes, don't show loading screen
    if (isPrevNoLoading && isCurrentNoLoading) {
      prevPathRef.current = pathname;
      return;
    }

    // Otherwise, show loading screen
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
      {/* ✅ Only wrap in ProtectedRoute when route is NOT public */}
      {isPublic ? children : <ProtectedRoute>{children}</ProtectedRoute>}
    </AuthProvider>
  );
}
