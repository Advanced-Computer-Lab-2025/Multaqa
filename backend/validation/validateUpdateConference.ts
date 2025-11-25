import Joi from "joi";
import { StaffPosition } from "../constants/staffMember.constants";
import { UserRole } from "../constants/user.constants";

export function validateUpdateConference(data: any) {
  const schema = Joi.object({
    type: Joi.string().valid("conference").optional(),

    // Base event fields
    eventName: Joi.string().min(3).max(100).optional(),
    location: Joi.string().optional(),
    eventStartDate: Joi.date().optional(),
    eventEndDate: Joi.date().greater(Joi.ref("eventStartDate")).optional(),
    registrationDeadline: Joi.date().optional(),
    eventStartTime: Joi.string().optional(),
    eventEndTime: Joi.string().optional(),
    description: Joi.string().optional(),
    archived: Joi.boolean().optional(),
    allowedUsers: Joi.array()
      .items(
        Joi.string().valid(
          ...Object.values(UserRole),
          ...Object.values(StaffPosition)
        )
      )
      .optional(),

    // Conference-specific fields
    fullAgenda: Joi.string().optional(),
    websiteLink: Joi.string().uri().optional(),
    requiredBudget: Joi.number().min(0).optional(),
    fundingSource: Joi.string().valid("external", "GUC").optional(),
    extraRequiredResources: Joi.array().items(Joi.string()).optional(),
  }); // ensures at least one field is provided for update

  return schema.validate(data);
}
