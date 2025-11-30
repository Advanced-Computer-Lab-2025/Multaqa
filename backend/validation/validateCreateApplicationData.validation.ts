import Joi from "joi";
import { BoothSizeEnum } from "../constants/booth.constants";
import { fileformatValidationSchema } from "./auth.validation";

const attendeeSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  nationalId: fileformatValidationSchema
});

const bazaarSchema = Joi.object({
  eventType: Joi.string().valid("bazaar").required(),
  bazaarAttendees: Joi.array().items(attendeeSchema).min(1).max(5).required(),
  boothSize: Joi.string()
    .valid(...BoothSizeEnum)
    .required(),
  participationFee: Joi.number().required(),
  location: Joi.string()
    .valid(
      "platform",
      "b building",
      "d building",
      "a building",
      "c building",
      "football court"
    )
    .required(),
});

const platformBoothSchema = Joi.object({
  eventType: Joi.string().valid("platform_booth").required(),
  boothAttendees: Joi.array().items(attendeeSchema).min(1).max(5).required(),
  boothSize: Joi.string()
    .valid(...BoothSizeEnum)
    .required(),
  boothLocation: Joi.string().required(),
  boothSetupDuration: Joi.number().integer().min(1).max(4).required(),
  participationFee: Joi.number().required(),
});

export function validateCreateApplicationData(data: any) {
  if (data.eventType === "bazaar") {
    return bazaarSchema.validate(data, { abortEarly: false });
  }
  if (data.eventType === "platform_booth") {
    return platformBoothSchema.validate(data, { abortEarly: false });
  }
  return { error: { message: "Invalid event type" } };
}
