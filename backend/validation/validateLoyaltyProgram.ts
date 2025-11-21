import Joi from "joi";

export const loyaltyProgramSchema = Joi.object({
  discountRate: Joi.number().min(0).max(100).required().messages({
    "number.base": "Discount rate must be a number",
    "number.min": "Discount rate must be at least 0%",
    "number.max": "Discount rate cannot exceed 100%",
    "any.required": "Discount rate is required",
  }),
  promoCode: Joi.string()
    .trim()
    .uppercase()
    .min(1)
    .max(20)
    .required()
    .messages({
      "string.empty": "Promo code is required",
      "string.min": "Promo code must be at least 1 character",
      "string.max": "Promo code cannot exceed 20 characters",
      "any.required": "Promo code is required",
    }),
  termsAndConditions: Joi.string()
    .trim()
    .min(20)
    .max(2000)
    .required()
    .messages({
      "string.empty": "Terms and conditions are required",
      "string.min": "Terms and conditions must be at least 20 characters",
      "string.max": "Terms and conditions cannot exceed 2000 characters",
      "any.required": "Terms and conditions are required",
    }),
});
