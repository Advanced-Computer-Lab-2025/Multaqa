"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import RegistrationForm from "@/components/shared/RegistrationForm/RegistrationForm";
import { redirect } from "next/navigation";

export default function RegisterPage() {
  const searchParams = useSearchParams();
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
      redirect("/");
    }
  }, [searchParams]);

  // Show a loading state or nothing until we've determined the userType
  if (!userType) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-background">
      <RegistrationForm UserType={userType} />
    </div>
  );
}
