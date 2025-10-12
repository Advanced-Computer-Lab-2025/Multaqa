import Joi from "joi";

export function validateWorkshop(data: any) {
  const schema = Joi.object({
    type: Joi.string().valid("workshop").required(),
    eventName: Joi.string().min(3).max(100).required(),
    location: Joi.string().valid("GUC Cairo", "GUC Berlin").required(),
    eventStartDate: Joi.date().required(),
    eventEndDate: Joi.date().greater(Joi.ref("eventStartDate")).required(),
    description: Joi.string().max(300).required(),
    fullAgenda: Joi.string().required(),
    facultyResponsible: Joi.string().required(),
    associatedProfs: Joi.array().items(Joi.string()).required(),
    requiredBudget: Joi.number().min(0).required(),
    fundingSource: Joi.string().valid("external", "GUC").required(),
    extraRequiredResources: Joi.array().items(Joi.string()).required(),
    capacity: Joi.number().integer().min(1).required(),
    registrationDeadline: Joi.date().required(),
    eventStartTime: Joi.string().required(),
    eventEndTime: Joi.string().required(),
    price: Joi.number().min(0).required(),
  });

  return schema.validate(data);
}
