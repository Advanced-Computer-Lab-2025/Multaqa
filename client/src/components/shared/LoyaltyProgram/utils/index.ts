import * as Yup from "yup";
import { toast } from "react-toastify";
import { FormikHelpers } from "formik";
import { api } from "@/api";
import { LoyaltyProgramFormValues } from "../types";

export const LOYALTY_PROGRAM_TERMS = [
  "The discount must be applicable to all GUC students and staff with a valid ID.",
  "Participation is subject to approval by the GUC administration.",
  "Vendors must adhere to the GUC code of conduct and ethical standards.",
  "Promo codes must remain active for a minimum of 6 months.",
  "The GUC reserves the right to review and revoke participation quarterly.",
  "Misuse of the program or complaints may lead to immediate termination.",
];

export const getValidationSchema = () =>
  Yup.object({
    discountRate: Yup.number()
      .typeError("Discount rate must be a number")
      .min(1, "Discount rate must be at least 1%")
      .max(100, "Discount rate cannot exceed 100%")
      .required("Discount rate is required"),
    promoCode: Yup.string().required("Promo code is required"),
    termsAndConditions: Yup.string().required(
      "Terms and conditions are required"
    ).min(20, "Terms and conditions must be at least 20 characters long"),
    agreedToTerms: Yup.boolean()
      .oneOf([true], "You must agree to the terms and conditions")
      .required("You must agree to the terms and conditions"),
  });

export const handleLoyaltyProgramSubmit = async (
  values: LoyaltyProgramFormValues,
  { setSubmitting, resetForm }: FormikHelpers<LoyaltyProgramFormValues>,
  onSuccess: () => void
) => {
  try {
    // Exclude agreedToTerms from the payload sent to backend
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { agreedToTerms, ...payload } = values;
    await api.post("/vendorEvents/loyalty-program", payload);

    toast.success("Successfully applied to the Loyalty Program!", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

    resetForm();
    onSuccess();
  } catch (err) {
    console.error("Loyalty Program application error:", err);
    const error = err as { response?: { data?: { error?: string } } };
    const errorMessage =
      error.response?.data?.error || "An error occurred while applying.";

    toast.error(errorMessage, {
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

export const handleCancelLoyaltyProgram = async (onSuccess: () => void) => {
  try {
    await api.delete("/vendorEvents/loyalty-program");

    toast.success(
      "Successfully cancelled participation in the Loyalty Program.",
      {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      }
    );

    onSuccess();
  } catch (err) {
    console.error("Loyalty Program cancellation error:", err);
    const error = err as { response?: { data?: { error?: string } } };
    const errorMessage =
      error.response?.data?.error ||
      "An error occurred while cancelling participation.";

    toast.error(errorMessage, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }
};
