import * as Yup from "yup";
import { UserType } from "../types";
import { api } from "../../../../api";
import { FileUploadResponse } from "../../../../../../backend/interfaces/responses/fileUploadResponse.interface";
import { IFileInfo } from "../../../../../../backend/interfaces/fileData.interface";
export const getValidationSchema = (userType: UserType) => {
  const passwordSchema = Yup.string()
    .min(8, "Password must be at least 8 characters long.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must include at least one uppercase letter, one lowercase letter, and one number."
    )
    .required("Please enter your password.");

  const confirmPasswordSchema = Yup.string()
    .min(8)
    .oneOf([Yup.ref("password")], "The passwords do not match.")
    .required("Please confirm your password.");

  const emailSchema = Yup.string()
    .email("Please enter a valid email address.")
    .required("Please enter your email address.");

  switch (userType) {
    case "university-member":
      return Yup.object({
        firstName: Yup.string()
          .max(15, "First name cannot be more than 15 characters.")
          .required("Please enter your first name."),
        lastName: Yup.string()
          .max(20, "Last name cannot be more than 20 characters.")
          .required("Please enter your last name."),
        gucId: Yup.string()
          .matches(
            /^[0-9]{1,2}-[0-9]{4,5}$/,
            "Please enter a valid GUC ID format (e.g., 49-12345)."
          )
          .required("Please enter your GUC ID."),
        email: emailSchema.matches(
          /^[a-zA-Z0-9._%+-]+@(guc\.edu\.eg|student\.guc\.edu\.eg)$/,
          "Email must be a GUC or student GUC email address."
        ),
        password: passwordSchema,
        confirmPassword: confirmPasswordSchema,
      });

    case "vendor":
      return Yup.object({
        companyName: Yup.string()
          .min(2, "Company name must be at least 2 characters long.")
          .required("Please enter your company name."),
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: confirmPasswordSchema,
        taxCard: Yup.object().required("Please upload your tax card document."),
        logo: Yup.object().required("Please upload your company logo."),
      });

    default:
      return Yup.object({
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: confirmPasswordSchema,
      });
  }
};
// Create a handler factory that returns a proper callback function
export const createDocumentHandler = (
  setCurrentFile: (file: File | null) => void,
  setDocumentStatus: (
    status: "idle" | "uploading" | "success" | "error"
  ) => void,
  setFormikField: (field: string, value: IFileInfo | string) => void,
  fieldName: string,
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: any
) => {
  return async (file: File | null) => {
    if (file) {
      // User selected a new file to upload
      setCurrentFile(file);
      setDocumentStatus("uploading");

      try {
        // Upload to server
        const formData = new FormData();

        // Replace with your actual API endpoint
        if (fieldName === "taxCard") {
          formData.append("taxCard", file);
          const response = await api.post<FileUploadResponse>(
            "/uploads/taxCard",
            formData
          );

          if (response.data?.success) {
            const fileObject = response.data.data;

            if (fileObject) {
              setDocumentStatus("success");
              setFormikField(fieldName, fileObject);
            } else {
              setDocumentStatus("error");
            }
          } else {
            setDocumentStatus("error");
          }
        } else {
          formData.append("logo", file);
          const response = await api.post<FileUploadResponse>(
            "/uploads/logo",
            formData
          );

          if (response.data?.success) {
            const fileObject = response.data.data;

            if (fileObject) {
              setDocumentStatus("success");
              setFormikField(fieldName, fileObject);
            } else {
              setDocumentStatus("error");
            }
          } else {
            setDocumentStatus("error");
          }
        }
      } catch (error) {
        console.error("Upload error:", error);
        setDocumentStatus("error");
      }
    } else {
      // User clicked the delete button (X) - file is null
      setCurrentFile(null);
      setDocumentStatus("idle");
      setFormikField(fieldName, "");

      // Delete from server
      const fileObject = formik.values[fieldName];

      const publicId = fileObject?.publicId;

      // Check if a publicId actually exists before trying to delete
      if (publicId) {
        await api.delete("/uploads/deletefile", {
          data: { publicId: publicId },
        });

        // clear the field in Formik
        formik.setFieldValue(fieldName, null);
        setDocumentStatus("idle");
      }
    }
  };
};

// Create a retry handler factory
export const createRetryHandler = (
  currentFile: File | null,
  documentHandler: (file: File | null) => Promise<void>
) => {
  return () => {
    if (currentFile) {
      documentHandler(currentFile);
    }
  };
};
