import Joi from "joi";
import { GYM_SESSION_TYPES } from "../constants/events.constants";

export const createGymSessionValidationSchema = Joi.object({
  trainer: Joi.string().min(2).max(100).messages({
    "string.min": "Trainer name must be at least 2 characters long",
    "string.max": "Trainer name must be at most 100 characters long",
  }),
  date: Joi.date().greater("now").required().messages({
    "date.greater": "Date must be in the future",
  }),
  time: Joi.string().pattern(/^\d{2}:\d{2}$/).required().messages({
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
    .required().messages({
      "any.only": `Session type must be one of: ${Object.values(GYM_SESSION_TYPES).join(", ")}`,
    }),
});


