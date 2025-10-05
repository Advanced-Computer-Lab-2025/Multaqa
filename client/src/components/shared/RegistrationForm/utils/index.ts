import * as Yup from "yup";
import { UserType } from "../types";

export const getValidationSchema = (userType: UserType) => {
  const passwordSchema = Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required");

  const confirmPasswordSchema =  Yup.string()
    .min(8)
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required();

  const emailSchema = Yup.string()
    .email("Invalid email address")
    .required("Email is required");

  switch (userType) {
    case "student":
      return Yup.object({
        firstName: Yup.string()
          .max(15, "Must be 15 characters or less")
          .required("First name is required"),
        lastName: Yup.string()
          .max(20, "Must be 20 characters or less")
          .required("Last name is required"),
        gucId: Yup.string()
          .matches(
            /^[0-9]{1,2}-[0-9]{1,5}$/, 
            "Invalid GUC ID format (e.g. XX-XXXXX or X-XXXXX)"
          )
          .required("Student ID is required"),
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: confirmPasswordSchema,
      });

    case "staff":
      return Yup.object({
        firstName: Yup.string()
          .max(15, "Must be 15 characters or less")
          .required("First name is required"),
        lastName: Yup.string()
          .max(20, "Must be 20 characters or less")
          .required("Last name is required"),
        gucId: Yup.string().required("Staff ID is required"),
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: confirmPasswordSchema,
      });

    case "vendor":
      return Yup.object({
        companyName: Yup.string()
          .min(3, "Company name must be at least 3 characters")
          .required("Company name is required"),
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
