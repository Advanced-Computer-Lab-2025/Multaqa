import * as Yup from "yup";
import { UserType } from "../types";


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
        taxCardPath: Yup.string().required(
          "Please upload your tax card document."
        ),
        logoPath: Yup.string().required("Please upload your company logo."),
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
  setFormikField: (field: string, value: string) => void,
  fieldName: string
) => {
  return async (file: File | null) => {
    if (file) {
      // User selected a new file to upload
      setCurrentFile(file);
      setDocumentStatus("uploading");

      try {
        // Upload to server
        const formData = new FormData();
        formData.append("document", file);

        // Replace with your actual API endpoint
        // const response = await fetch("/api/upload-document", {
        //   method: "POST",
        //   body: formData,
        // });
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const response = true;
        if (response) {
          // const data = await response.json();
          // const filePath = data.filePath || data.path || data.url; // Adjust based on your API response
          const filePath = "lalalla";
          setDocumentStatus("success");
          // Update Formik field with the file path
          setFormikField(fieldName, filePath);
          console.log(`✅ Document uploaded successfully: ${filePath}`);
        } else {
          setDocumentStatus("error");
          console.error("❌ Upload failed");
        }
      } catch (error) {
        setDocumentStatus("error");
        console.error("❌ Upload error:", error);
      }
    } else {
      // User clicked the delete button (X) - file is null
      console.log("🗑️ Document removed by user - resetting to idle");
      setCurrentFile(null);
      setDocumentStatus("idle");
      // Clear the Formik field
      setFormikField(fieldName, "");

      // Optional: Delete from server if needed
      // await fetch('/api/delete-document', {
      //   method: 'DELETE',
      //   body: JSON.stringify({ filePath })
      // });
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
