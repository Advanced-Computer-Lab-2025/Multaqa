import Joi from "joi";
import { FACULTY } from "../constants/workshops.constants";

export function validateWorkshop(data: any) {
  const schema = Joi.object({
    type: Joi.string().valid("workshop").required(),
    eventName: Joi.string().min(3).max(100).required(),
    location: Joi.string().valid("GUC Cairo", "GUC Berlin").required(),
    eventStartDate: Joi.date().required(),
    eventEndDate: Joi.date().greater(Joi.ref("eventStartDate")).required(),
    description: Joi.string().max(300).required(),
    fullAgenda: Joi.string().required(),
    associatedFaculty: Joi.string()
      .valid(...Object.keys(FACULTY))
      .required(),
    associatedProfs: Joi.array().items(Joi.string()).required(),
    requiredBudget: Joi.number().min(0).required(),
    fundingSource: Joi.string().valid("External", "GUC").required(),
    extraRequiredResources: Joi.array().items(Joi.string()).required(),
    capacity: Joi.number().integer().min(1).required(),
    registrationDeadline: Joi.date().required(),
    eventStartTime: Joi.string().required(),
    eventEndTime: Joi.string().required(),
    price: Joi.number().min(0).required(),
  });

  return schema.validate(data);
}
