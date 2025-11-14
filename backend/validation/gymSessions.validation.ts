import Joi from "joi";
import { GYM_SESSION_TYPES } from "../constants/gymSessions.constants";

export const createGymSessionValidationSchema = Joi.object({
  trainer: Joi.string().min(2).max(100).messages({
    "string.min": "Trainer name must be at least 2 characters long",
    "string.max": "Trainer name must be at most 100 characters long",
  }),
  date: Joi.date().greater("now").required().messages({
    "date.greater": "Date must be in the future",
  }),
  time: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "Time must be in HH:MM format",
    }),
  duration: Joi.number().min(10).max(180).required().messages({
    "number.min": "Duration must be at least 10 minutes",
    "number.max": "Duration must be at most 180 minutes",
  }),
  capacity: Joi.number().min(1).max(100).default(10).messages({
    "number.min": "Capacity must be at least 1",
    "number.max": "Capacity must be at most 100",
  }),
  sessionType: Joi.string()
    .valid(...Object.values(GYM_SESSION_TYPES))
    .required()
    .messages({
      "any.only": `Session type must be one of: ${Object.values(
        GYM_SESSION_TYPES
      ).join(", ")}`,
    }),
});

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
