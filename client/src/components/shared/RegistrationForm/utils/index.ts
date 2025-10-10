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
    case "student":
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
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: confirmPasswordSchema,
      });

    case "staff":
      return Yup.object({
        firstName: Yup.string()
          .max(15, "First name cannot be more than 15 characters.")
          .required("Please enter your first name."),
        lastName: Yup.string()
          .max(20, "Last name cannot be more than 20 characters.")
          .required("Please enter your last name."),
        gucId: Yup.string().required("Please enter your Staff ID."),
        email: emailSchema,
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
