"use client";

import LoginForm from "@/components/shared/LoginForm/LoginForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  return (
    <>
      <div
        className="flex flex-col items-center justify-center"
        style={{ transform: "scale(0.8)" }}
      >
        <LoginForm />
        {/* <CustomSearchBar icon /> */}
      </div>
      <ToastContainer aria-label={undefined} />
    </>
  );
}