import { Router, Request, Response } from "express";
import createError from "http-errors";
import { validateWorkshop } from "../validation/validateWorkshop";
import { validateUpdateWorkshop } from "../validation/validateUpdateWorkshop";
import { WorkshopService } from "../services/workshopsService";
import { CreateWorkshopResponse, UpdateWorkshopResponse } from "../interfaces/responses/workshopsResponses.interface";
import { authorizeRoles } from "../middleware/authorizeRoles.middleware";
import { StaffPosition } from "../constants/staffMember.constants";
import { UserRole } from "../constants/user.constants";
import { AdministrationRoleType } from "../constants/administration.constants";

const workshopService = new WorkshopService();

async function createWorkshop(
  req: Request,
  res: Response<CreateWorkshopResponse>
) {
  try {
    const professorid = req.params.professorId;

    // To be used when authentication is automatically handled by the frontend
    // const professorid = (req as any).user.id;

    let validationResult = validateWorkshop(req.body);

    // Handle Joi validation errors
    if (validationResult.error) {
      const message = validationResult.error.details
        .map((d) => d.message)
        .join(", ");
      throw createError(400, message);
    }

    const event = await workshopService.createWorkshop(req.body, professorid);
    res.status(201).json({
      success: true,
      data: event,
      message: "Workshop created successfully",
    });
  } catch (err: any) {
    console.error("Error creating workshop:", err);
    throw createError(500, err.message);
  }
}

// Update Workshop
async function updateWorkshop(
  req: Request,
  res: Response<UpdateWorkshopResponse>
) {
  try {
    // const professorid = (req as any).user.id;
    const professorid = req.params.professorId;
    const workshopId = req.params.workshopId;
    const validationResult = validateUpdateWorkshop(req.body);

    if (validationResult.error) {
      throw createError(
        400,
        validationResult.error.details.map((d) => d.message).join(", ")
      );
    }

    const updatedWorkshop = await workshopService.updateWorkshop(
      workshopId,
      req.body
    );

    res.status(200).json({
      success: true,
      data: updatedWorkshop,
      message: "Workshop updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating workshop:", err);
    throw createError(500, err.message);
  }
}

async function updateWorkshopStatus(
  req: Request,
  res: Response<UpdateWorkshopResponse>
) {
  try {
    const workshopId = req.params.id;
    const { approvalStatus, comments } = req.body;

    const { error } = validateUpdateWorkshop({ approvalStatus, comments });
    if (error) {
      throw createError(400, error.details.map((d) => d.message).join(", "));
    }

    const updatedWorkshop = await workshopService.updateWorkshopStatus(
      workshopId,
      { approvalStatus, comments }
    );

    res.status(200).json({
      success: true,
      data: updatedWorkshop,
      message: "Workshop status updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating workshop status:", err);
    throw createError(500, err.message);
  }
}

const router = Router();
router.post("/", authorizeRoles({ userRoles: [UserRole.STAFF_MEMBER], staffPositions: [StaffPosition.PROFESSOR] }), createWorkshop);
router.patch("/:professorId/:workshopId", authorizeRoles({ userRoles: [UserRole.STAFF_MEMBER], staffPositions: [StaffPosition.PROFESSOR] }), updateWorkshop);
router.patch("/:professorId/:workshopId/status", authorizeRoles({ userRoles: [UserRole.ADMINISTRATION], adminRoles: [AdministrationRoleType.EVENTS_OFFICE] }), updateWorkshopStatus);

export default router;
