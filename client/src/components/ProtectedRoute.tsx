"use client";

import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter, usePathname } from "@/i18n/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // List of pages that are public (not protected)
  const publicRoutes = ["/en", "/login", "/register", "/signup"];

  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  useEffect(() => {
    // Only redirect after loading is done
    if (!isLoading && !user && !isPublic) {
      router.replace("/login");
    }
  }, [isLoading, user, isPublic, router]);

  // Show loader until we know if user exists
  if (isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.2rem",
        }}
      >
        Loading...
      </div>
    );
  }

  // If it's public route → show content even if user = null
  if (isPublic) return <>{children}</>;

  // If user not logged in → block render (redirect will already happen)
  if (!user) return null;

  return <>{children}</>;
}
