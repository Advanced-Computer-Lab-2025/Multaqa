import Joi from "joi";

export const eventRegistrationSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(3).max(100).required(),
});

export function validateEventRegistration(data: any) {
  return eventRegistrationSchema.validate(data, { abortEarly: false });
}
