"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import RegistrationForm from "@/components/shared/RegistrationForm/RegistrationForm";
import { useRouter } from "@/i18n/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userType, setUserType] = useState<
    "university-member" | "vendor" | null
  >(null);

  useEffect(() => {
    // Extract userType from URL query params
    const userTypeParam = searchParams.get("userType");

    if (userTypeParam === "university-member" || userTypeParam === "vendor") {
      setUserType(userTypeParam);
    } else {
      // If no valid userType provided, redirect to home page
      router.replace("/");
    }
  }, [searchParams, router]);

  // Show a loading state or nothing until we've determined the userType
  if (!userType) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div
        className="flex flex-col items-center justify-center"
        style={{ transform: "scale(0.8)" }}
      >
        <RegistrationForm UserType={userType} />
      </div>
      <ToastContainer />
    </>
  );
}