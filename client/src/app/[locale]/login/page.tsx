"use client";

import LoginForm from "@/components/shared/LoginForm/LoginForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FileUpload from "@/components/shared/FileUpload/FileUpload";

export default function LoginPage() {
  return (
    <>
      <div
        className="flex flex-col items-center justify-center gap-10"
        style={{ transform: "scale(0.8)" }}
      >
        <LoginForm />
        <FileUpload label="Upload your files" />
      </div>
      <ToastContainer aria-label={undefined} />
    </>
  );
}
