import Joi from "joi";
import { start } from "repl";

export function validateWorkshop(data: any) {
  const schema = Joi.object({
    type: Joi.string().valid("workshop").required(),
    name: Joi.string().min(3).max(100).required(),
    location: Joi.string().valid("GUC Cairo", "GUC Berlin").required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref("startDate")).required(),
    shortDescription: Joi.string().max(300).required(),
    fullAgenda: Joi.string().required(),
    facultyResponsible: Joi.string().required(),
    professors: Joi.array().items(Joi.string()).required(),
    budget: Joi.number().min(0).required(),
    fundingSource: Joi.string().valid("external", "GUC").required(),
    extraResources: Joi.string().allow(""),
    capacity: Joi.number().integer().min(1).required(),
    registrationDeadline: Joi.date().required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    price: Joi.number().min(0).required(),
  });

  return schema.validate(data);
}
