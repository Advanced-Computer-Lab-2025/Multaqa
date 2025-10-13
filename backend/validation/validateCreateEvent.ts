import Joi from "joi";
import { EVENT_TYPES } from "../constants/events.constants";

// Event base schema
const eventBaseSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(EVENT_TYPES))
    .required(),
  eventName: Joi.string().required(),
  eventStartDate: Joi.date().required(),
  eventEndDate: Joi.date().required(),
  eventStartTime: Joi.string().required(),
  eventEndTime: Joi.string().required(),
  registrationDeadline: Joi.date().required(),
  location: Joi.string().required(),
  description: Joi.string().required(),
});

// Bazaar event schema
const bazaarSchema = eventBaseSchema.keys({
  price: Joi.forbidden(),
});

// Trip event schema
const tripSchema = eventBaseSchema.keys({
  capacity: Joi.number().min(1).required(),
  price: Joi.number().min(0).required(),
});

export function validateCreateEvent(data: any) {
  switch (data.type) {
    case "bazaar":
      return bazaarSchema.validate(data, { abortEarly: false });
    case "trip":
      return tripSchema.validate(data, { abortEarly: false });
    default:
      return eventBaseSchema.validate(data, { abortEarly: false });
  }
}
