import * as Yup from "yup";
import { UserType } from "../types";
import { api } from "../../../../api";
import { FileUploadResponse } from "../../../../../../backend/interfaces/responses/fileUploadResponse.interface";
import { IFileInfo } from "../../../../../../backend/interfaces/fileData.interface";
import { toast } from "react-toastify";
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

// Helper function to get nested value from object by string path
//eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNestedValue = (obj: any, path: string) => {
  try {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  } catch (e) {
    console.error("Error getting nested value:", e);
    return undefined;
  }
};

export const createDocumentHandler = (
  setCurrentFile: (file: File | null) => void,
  setDocumentStatus: (
    status: "idle" | "uploading" | "success" | "error"
  ) => void,
  setFormikField: (field: string, value: IFileInfo | null) => void,
  fieldName: string,
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: any
) => {
  return async (file: File | null) => {
    if (file) {
      // User selected a new file to upload
      setCurrentFile(file);
      setDocumentStatus("uploading");
      console.log("field name", fieldName);
      try {
        // Upload to server
        const formData = new FormData();

        let response;
        if (fieldName === "taxCard") {
          formData.append("taxCard", file);
          response = await api.post<FileUploadResponse>(
            "/uploads/taxCard",
            formData
          );
        } else if (fieldName === "logo") {
          formData.append("logo", file);
          response = await api.post<FileUploadResponse>(
            "/uploads/logo",
            formData
          );
        } else {
          formData.append("nationalId", file);
          response = await api.post<FileUploadResponse>(
            `/vendorEvents/uploadNationalId`,
            formData
          );
        }

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
      } catch (error) {
        console.error("Upload error:", error);
        setDocumentStatus("error");
      }
    } else {
      // User clicked the delete button (X) - file is null

      
      // Get the file object from Formik using the helper
      const fileObject = getNestedValue(formik.values, fieldName);
      console.log("fileObject to delete:", fileObject);

      // Get the publicId
      const publicId = fileObject?.publicId;
      console.log("publicId to delete:", publicId);

      // Update local state
      setCurrentFile(null);
      setDocumentStatus("idle");

      // Clear Formik field
      setFormikField(fieldName, null);

      // Delete it from the server
      if (publicId) {
        try {
          await api.delete("/uploads/deletefile", {
            data: { publicId: publicId },
          });
        } catch (err) {
          const error = err as { response?: { data?: { error?: string } } };
          toast.error(
            error.response?.data?.error || "Failed to delete file from server.",
            {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
        }
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
