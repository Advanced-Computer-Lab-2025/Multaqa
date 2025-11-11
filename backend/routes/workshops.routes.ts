import { Router, Request, Response } from "express";
import createError from "http-errors";
import { validateWorkshop } from "../validation/validateWorkshop";
import { validateUpdateWorkshop } from "../validation/validateUpdateWorkshop";
import { WorkshopService } from "../services/workshopsService";
import {
  CreateWorkshopResponse,
  SendCertificatesResponse,
  UpdateWorkshopResponse,
} from "../interfaces/responses/workshopsResponses.interface";
import { authorizeRoles } from "../middleware/authorizeRoles.middleware";
import { StaffPosition } from "../constants/staffMember.constants";
import { UserRole } from "../constants/user.constants";
import { AdministrationRoleType } from "../constants/administration.constants";
import { AuthenticatedRequest } from "../middleware/verifyJWT.middleware";

const workshopService = new WorkshopService();

async function createWorkshop(
  req: AuthenticatedRequest,
  res: Response<CreateWorkshopResponse>
) {
  try {
    const professorid = req.user?.id;
    if (!professorid) {
      throw createError(401, "Unauthorized: Professor ID missing in token");
    }

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
    throw createError(
      err.status || 500, 
      err.message || 'Error creating workshop'
    );
  }
}

// Update Workshop
async function updateWorkshop(
  req: AuthenticatedRequest,
  res: Response<UpdateWorkshopResponse>
) {
  try {
    // const professorid = (req as any).user.id;
    const professorid = req.user?.id;
    if (!professorid) {
      throw createError(401, "Unauthorized: Professor ID missing in token");
    }
    const workshopId = req.params.workshopId;
    const validationResult = validateUpdateWorkshop(req.body);

    if (validationResult.error) {
      throw createError(
        400,
        validationResult.error.details.map((d) => d.message).join(", ")
      );
    }

    const updatedWorkshop = await workshopService.updateWorkshop(
      professorid,
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
    throw createError(
      err.status || 500,
      err.message || 'Error updating workshop'
    );
  }
}

async function updateWorkshopStatus(
  req: Request,
  res: Response<UpdateWorkshopResponse>
) {
  try {
    const { professorId, workshopId } = req.params;
    const { approvalStatus, comments } = req.body;

    const { error } = validateUpdateWorkshop({ approvalStatus, comments });
    if (error) {
      throw createError(400, error.details.map((d) => d.message).join(", "));
    }

    const updatedWorkshop = await workshopService.updateWorkshopStatus(
      professorId,
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
    throw createError(
      err.status || 500,
      err.message || 'Error updating workshop status'
    );
  }
}

export async function sendCertificatesManually(
  req: Request,
  res: Response<SendCertificatesResponse>
): Promise<void> {
  try {
    const { eventId } = req.params;

    await workshopService.sendCertificatesForWorkshop(eventId);

    res.status(200).json({
      success: true,
      message: 'Certificates sent successfully'
    });
  } catch (error: any) {
    console.error('Error sending certificates:', error);
    throw createError(
      error.status || 500,
      error.message || 'Error sending certificates'
    );
  }
}

const router = Router();

router.patch(
  "/:professorId/:workshopId/status",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION],
    adminRoles: [AdministrationRoleType.EVENTS_OFFICE],
  }),
  updateWorkshopStatus
);

// Used ONLY during testing for manual triggering of certificate sending
router.patch(
  "/:eventId/sendcertificates",
  authorizeRoles({
    userRoles: [UserRole.STAFF_MEMBER],
    staffPositions: [StaffPosition.PROFESSOR],
  }),
  sendCertificatesManually
);

router.post(
  "/",
  authorizeRoles({
    userRoles: [UserRole.STAFF_MEMBER],
    staffPositions: [StaffPosition.PROFESSOR],
  }),
  createWorkshop
);

router.patch(
  "/:workshopId",
  authorizeRoles({
    userRoles: [UserRole.STAFF_MEMBER],
    staffPositions: [StaffPosition.PROFESSOR],
  }),
  updateWorkshop
);

export default router;
