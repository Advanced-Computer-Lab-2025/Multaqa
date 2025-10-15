import Joi from "joi";

export function validateConference(data: any) {
  const schema = Joi.object({
    type: Joi.string().valid("conference").required(),

    // Base event fields
    eventName: Joi.string().min(3).max(300).required(),
    location: Joi.string().valid("").required(),
    eventStartDate: Joi.date().required(),
    eventEndDate: Joi.date().greater(Joi.ref("eventStartDate")).required(),
    registrationDeadline: Joi.date().required().default(new Date()),
    eventStartTime: Joi.string().required(),
    eventEndTime: Joi.string().required(),
    description: Joi.string().required(),

    // Conference-specific fields
    fullAgenda: Joi.string().required(),
    websiteLink: Joi.string().uri().required(),
    requiredBudget: Joi.number().min(0).required(),
    fundingSource: Joi.string().valid("external", "GUC").required(),
    extraRequiredResources: Joi.array().items(Joi.string()).optional(),
  });

  return schema.validate(data);
}
