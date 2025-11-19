import Joi from "joi";
import { GYM_SESSION_TYPES } from "../constants/gymSessions.constants";

export const editGymSessionValidationSchema = Joi.object({
  date: Joi.date().greater("now").messages({
    "date.greater": "Cannot set session date to a past date",
  }),
  time: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .messages({
      "string.pattern.base": "Time must be in HH:MM format",
    }),
  duration: Joi.number().messages({
    "number.base": "Duration must be a number",
  }),
})
  .min(1)
  .messages({
    "object.min":
      "At least one field (date, time, or duration) must be provided",
  })
  .custom((value, helpers) => {
    // Ensure only allowed fields are present
    const allowedFields = ["date", "time", "duration"];
    const providedFields = Object.keys(value);
    const invalidFields = providedFields.filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return helpers.error("any.invalid", {
        message: `Cannot update fields: ${invalidFields.join(
          ", "
        )}. Only date, time, and duration can be edited.`,
      });
    }

    return value;
  });
