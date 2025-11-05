import * as Yup from "yup";
import { UserType } from "../types";
import { toast } from "react-toastify";
import { FormikHelpers } from "formik";

interface RegistrationValues {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword: string;
  gucId?: string;
  companyName?: string;
}

interface SignupData {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  gucId?: string;
  companyName?: string;
  type: string;
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
}

export const handleRegistrationSubmit = async (
  values: RegistrationValues,
  { setSubmitting }: FormikHelpers<RegistrationValues>,
  userType: UserType,
  handleRegistration: (data: SignupData) => Promise<unknown>
) => {
  try {
    // Prepare data for signup based on user type
    const signupData: SignupData =
      userType !== "vendor"
        ? {
            firstName: values.firstName as string,
            lastName: values.lastName as string,
            email: values.email,
            password: values.password,
            gucId: values.gucId as string,
            type: "studentOrStaff",
          }
        : {
            companyName: values.companyName as string,
            email: values.email,
            password: values.password,
            type: "vendor",
          };

    await handleRegistration(signupData);

    toast.success(
      "Registration successful! Please check your email for verification.",
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
  } catch (error: unknown) {
    const apiError = error as ApiError;
    const message =
      apiError?.response?.data?.error ||
      apiError?.message ||
      "Something went wrong. Please try again.";

    toast.error(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  } finally {
    setSubmitting(false);
  }
};

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
      });

    default:
      return Yup.object({
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: confirmPasswordSchema,
      });
  }
};
