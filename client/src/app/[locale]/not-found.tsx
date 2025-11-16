"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Helper: Get stakeholder default route
// disabled-next-line @typescript-eslint/no-explicit-any
const getDefaultRoute = (user: any): string => {
  if (!user) return "/";

  const roleMap: Record<string, { entity: string; tab: string; section: string }> = {
    student: { entity: "student", tab: "events", section: "browse-events" },
    vendor: { entity: "vendor", tab: "opportunities", section: "bazaars" },
    staff: { entity: "staff", tab: "events", section: "browse-events" },
    ta: { entity: "ta", tab: "events", section: "browse-events" },
    professor: { entity: "professor", tab: "workshops", section: "my-workshops" },
    "events-office": { entity: "events-office", tab: "events", section: "all-events" },
    admin: { entity: "admin", tab: "users", section: "all-users" },
  };

  let roleKey = "student";
  if (user.role === "student") roleKey = "student";
  else if (user.role === "vendor") roleKey = "vendor";
  else if (user.role === "staffMember") {
    if (user.position === "professor") roleKey = "professor";
    else if (user.position === "TA") roleKey = "ta";
    else roleKey = "staff";
  } else if (user.role === "administration") {
    if (user.roleType === "eventsOffice") roleKey = "events-office";
    else roleKey = "admin";
  }

  const config = roleMap[roleKey];
  return `/${config.entity}/${config.tab}/${config.section}`;
};

export default function NotFound() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [countdown, setCountdown] = useState(5);
  const [redirectPath, setRedirectPath] = useState<string>("/");

  useEffect(() => {
    // Determine redirect path
    if (!isLoading) {
      if (user) {
        // Try to get last valid route from sessionStorage
        const lastValidRoute = sessionStorage.getItem("lastValidRoute");
        if (lastValidRoute) {
          setRedirectPath(lastValidRoute);
        } else {
          // Fallback to stakeholder default
          setRedirectPath(getDefaultRoute(user));
        }
      } else {
        setRedirectPath("/");
      }
    }
  }, [user, isLoading]);

  useEffect(() => {
    if (isLoading || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.replace(redirectPath);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, redirectPath, router, isLoading]);

  const handleRedirectNow = () => {
    router.replace(redirectPath);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-pulse text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <svg
            className="mx-auto"
            width="400"
            height="300"
            viewBox="0 0 400 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Animated 404 */}
            <text
              x="200"
              y="150"
              fontSize="120"
              fontWeight="bold"
              fill="#6299d0"
              textAnchor="middle"
              className="animate-bounce"
            >
              404
            </text>
            {/* Magnifying glass */}
            <circle
              cx="320"
              cy="180"
              r="30"
              stroke="#6299d0"
              strokeWidth="4"
              fill="none"
              className="animate-pulse"
            />
            <line
              x1="340"
              y1="200"
              x2="365"
              y2="225"
              stroke="#6299d0"
              strokeWidth="4"
              strokeLinecap="round"
              className="animate-pulse"
            />
          </svg>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Don&apos;t worry, we&apos;ll get you back on track!
        </p>

        {/* Countdown */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg border-4 border-blue-500 mb-4">
            <span className="text-3xl font-bold text-blue-600">{countdown}</span>
          </div>
          <p className="text-sm text-gray-600">
            Redirecting you in {countdown} second{countdown !== 1 ? "s" : ""}...
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleRedirectNow}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
          >
            Take Me Back Now
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg shadow-md border border-gray-300 transition-all duration-200 transform hover:scale-105"
          >
            Go to Home
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-xs text-gray-400">
          <p>
            If you continue to experience issues, please contact support at{" "}
            <a href="mailto:support@multaqa.com" className="text-blue-500 hover:underline">
              support@multaqa.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}