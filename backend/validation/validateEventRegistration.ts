import Joi from "joi";

export const eventRegistrationSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
  id: Joi.string().required(),
});

export function validateEventRegistration(data: any) {
  return eventRegistrationSchema.validate(data, { abortEarly: false });
}
