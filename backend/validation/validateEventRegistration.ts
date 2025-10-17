import Joi from "joi";

export const eventRegistrationSchema = Joi.object({
  email: Joi.string().email().required(),
});

export function validateEventRegistration(data: any) {
  return eventRegistrationSchema.validate(data, { abortEarly: false });
}
