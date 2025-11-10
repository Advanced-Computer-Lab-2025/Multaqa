"use client";

import LoginForm from "@/components/shared/LoginForm/LoginForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FileUpload, UploadID } from "@/components/shared/FileUpload";
export default function LoginPage() {
  return (
    <>
      <div
        className="flex flex-col items-center justify-center gap-20"
        style={{ transform: "scale(0.8)" }}
      >
        <LoginForm />
        <FileUpload label="Upload Document" variant="folder" />
        <FileUpload
          label="Upload Tax Card"
          variant="tax-card"
          accept=".pdf,.jpg"
        />
        <FileUpload label="Upload Logo" variant="logo" accept="image/*" />
        <UploadID label="Upload ID"  accept=".jpg,.png" />
      </div>
      <ToastContainer aria-label={undefined} />
    </>
  );
}
