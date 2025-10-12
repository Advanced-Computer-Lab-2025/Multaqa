import Joi from "joi";

export function validateConference(data: any) {
  const schema = Joi.object({
    type: Joi.string().valid("conference").required(),

    // Base event fields
    eventName: Joi.string().min(3).max(100).required(),
    location: Joi.string().valid("GUC Cairo", "GUC Berlin").required(),
    eventStartDate: Joi.date().required(),
    eventEndDate: Joi.date().greater(Joi.ref("eventStartDate")).required(),
    registrationDeadline: Joi.date().required(),
    eventStartTime: Joi.string().required(),
    eventEndTime: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0).required(),

    // Conference-specific fields
    keynoteSpeaker: Joi.string().required(),
    fullAgenda: Joi.string().required(),
    websiteLink: Joi.string().uri().required(),
    requiredBudget: Joi.number().min(0).required(),
    fundingSource: Joi.string().valid("external", "GUC").required(),
    extraRequiredResources: Joi.array().items(Joi.string()).optional(),
    topics: Joi.array().items(Joi.string()).required(),
  });

  return schema.validate(data);
}
