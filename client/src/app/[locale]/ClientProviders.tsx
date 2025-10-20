"use client";

import { AuthProvider } from "../../context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { usePathname } from "next/navigation";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Define all public (unprotected) routes
  const publicRoutes = ["/", "/login", "/register", "/test-events"];

  // Handle localized paths like /en/login or /ar/register
  const isPublic = publicRoutes.some((route) => {
    return (
      pathname === route ||
      pathname.endsWith(route) ||
      pathname.endsWith(route + "/")
    );
  });

  return (
    <AuthProvider>
      {/* ✅ Only wrap in ProtectedRoute when route is NOT public */}
      {isPublic ? children : <ProtectedRoute>{children}</ProtectedRoute>}
    </AuthProvider>
  );
}
