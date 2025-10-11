import Joi from "joi";
import { Event_Request_Status } from "../constants/user.constants";

export function validateUpdateWorkshop(data: any) {
  const schema = Joi.object({
    type: Joi.string().valid("workshop").optional(),
    eventName: Joi.string().min(3).max(100).optional(),
    location: Joi.string().valid("GUC Cairo", "GUC Berlin").optional(),
    eventStartDate: Joi.date().optional(),
    eventEndDate: Joi.date().greater(Joi.ref("eventStartDate")).optional(),
    description: Joi.string().max(300).optional(),
    fullAgenda: Joi.string().optional(),
    facultyResponsible: Joi.string().optional(),
    associatedProfs: Joi.array().items(Joi.string()).optional(),
    requiredBudget: Joi.number().min(0).optional(),
    fundingSource: Joi.string().valid("external", "GUC").optional(),
    extraRequiredResources: Joi.array().items(Joi.string()).optional(),
    capacity: Joi.number().integer().min(1).optional(),
    registrationDeadline: Joi.date().optional(),
    eventStartTime: Joi.string().optional(),
    eventEndTime: Joi.string().optional(),
    price: Joi.number().min(0).optional(),
    approvalStatus: Joi.string()
      .valid(...Object.values(Event_Request_Status))
      .optional(),
  });

  return schema.validate(data);
}
