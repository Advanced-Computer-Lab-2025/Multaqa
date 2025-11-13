"use client";

import LoginForm from "@/components/shared/LoginForm/LoginForm";

export default function LoginPage() {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ transform: "scale(0.8)" }}
    >
      <LoginForm />
    </div>
  );
}
