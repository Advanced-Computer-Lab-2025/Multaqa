import Joi from "joi";
import { EVENT_TYPES } from "../constants/events.constants";
import { UserRole } from "../constants/user.constants";

// Event base schema
const eventBaseSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(EVENT_TYPES))
    .required(),
  allowedUsers: Joi.array()
    .items(Joi.string().valid(...Object.values(UserRole)))
    .optional(),
  eventName: Joi.string().optional(),
  eventStartDate: Joi.date().optional(),
  eventEndDate: Joi.date().optional(),
  eventStartTime: Joi.string().optional(),
  eventEndTime: Joi.string().optional(),
  registrationDeadline: Joi.date().optional(),
  location: Joi.string().optional(),
  description: Joi.string().optional(),
});

// Bazaar event schema
const bazaarSchema = eventBaseSchema.keys({
  price: Joi.forbidden(),
});

// Trip event schema
const tripSchema = eventBaseSchema.keys({
  capacity: Joi.number().min(1).optional(),
  price: Joi.number().min(0).optional(),
});

export function validateUpdateEvent(data: any) {
  switch (data.type) {
    case "bazaar":
      return bazaarSchema.validate(data, { abortEarly: false });
    case "trip":
      return tripSchema.validate(data, { abortEarly: false });
    default:
      return eventBaseSchema.validate(data, { abortEarly: false });
  }
}
