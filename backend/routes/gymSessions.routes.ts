import { GymSessionsService } from "../services/gymsessionsService";
import { Router, Request, Response } from "express";
import { createGymSessionValidationSchema } from "../validation/gymSessions.validation";
import { editGymSessionValidationSchema } from "../validation/validateEditGymSession";
import createError from "http-errors";
import {
  CreateGymSessionResponse,
  GetAllGymSessionsResponse,
} from "../interfaces/responses/gymSessionsResponses.interface";
import { authorizeRoles } from "../middleware/authorizeRoles.middleware";
import { UserRole } from "../constants/user.constants";
import { AdministrationRoleType } from "../constants/administration.constants";
import { StaffPosition } from "../constants/staffMember.constants";
import { AuthenticatedRequest } from "../middleware/verifyJWT.middleware";

const gymSessionsService = new GymSessionsService();

async function createGymSession(
  req: Request,
  res: Response<CreateGymSessionResponse>
) {
  try {
    const { value, error } = createGymSessionValidationSchema.validate(
      req.body
    );

    if (error) {
      throw createError(400, "Validation error: ", error.message);
    }

    const newSession = await gymSessionsService.createGymSession(value);

    res.status(201).json({
      success: true,
      message: "Gym Session registered successfully",
      data: newSession,
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error creating gym session"
    );
  }
}

async function getAllGymSessions(
  req: Request,
  res: Response<GetAllGymSessionsResponse>
) {
  try {
    const date= req.query.date as string | undefined;
    const sessions = await gymSessionsService.getAllGymSessions(date);

    res.json({
      success: true,
      data: sessions || [],
      message: "Gym sessions retrieved successfully",
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error retrieving gym sessions"
    );
  }
}

 async function editGymSession(
  req: Request,
  res: Response<CreateGymSessionResponse>
) {
  try {
    const sessionId = req.params.sessionId;
      if (!sessionId) {
      throw createError(400, "Session ID is required");
    }
    const { value, error } = editGymSessionValidationSchema.validate(req.body);
    if (error) {
      throw createError(400, "Validation error: ", error.message);
    }
    const updatedSession = await gymSessionsService.editGymSession(
      sessionId,
      value
    );

    res.json({
      success: true,
      message: "Gym Session updated successfully",
      data: updatedSession,
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error updating gym session"
    );
  }
}

async function cancelGymSession(
  req: Request,
  res: Response<{ success: boolean; message: string }>
) {
  try {
    const sessionId = req.params.sessionId;
     if (!sessionId) {
      throw createError(400, "Session ID is required");
    }
    await gymSessionsService.cancelGymSession(sessionId);
    res.json({
      success: true,
      message: "Gym Session cancelled successfully",
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error cancelling gym session"
    );
  }
}

async function registerUserToSession(
  req: AuthenticatedRequest,
  res: Response<CreateGymSessionResponse>
) {
  try {
    const sessionId = req.params.sessionId;
    const userId = req.user?.id;
    if (!sessionId) {
      throw createError(400, "Session ID is required");
    }
    if (!userId) {
      throw createError(400, "User ID is required");
    }
    const updatedSession = await gymSessionsService.registerUserToSession(
      sessionId,
      userId
    );
    res.json({
      success: true,
      message: "User registered to gym session successfully",
      data: updatedSession,
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error registering user to gym session"
    );
  }
}

async function getUserRegisteredSessions(
  req: AuthenticatedRequest,
  res: Response<GetAllGymSessionsResponse>
) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError(400, "User ID is required");
    }
    const sessions = await gymSessionsService.getUserRegisteredSessions(userId);
    if (!sessions || sessions.length === 0) {
      throw createError(404, "No registered gym sessions found for user");
    }
    res.json({
      success: true,
      data: sessions,
      message: "User registered gym sessions retrieved successfully",
    });

  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error retrieving user registered gym sessions"
    );
  }
}

const router = Router();
router.get(
  "/",
  authorizeRoles({
    userRoles: [
      UserRole.ADMINISTRATION,
      UserRole.STAFF_MEMBER,
      UserRole.STUDENT,
    ],
    adminRoles: [AdministrationRoleType.EVENTS_OFFICE],
    staffPositions: [
      StaffPosition.PROFESSOR,
      StaffPosition.STAFF,
      StaffPosition.TA,
    ],
  }),
  getAllGymSessions
);
router.post(
  "/",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION],
    adminRoles: [AdministrationRoleType.EVENTS_OFFICE],
  }),
  createGymSession
);

router.get(
  "/registered",
  authorizeRoles({
    userRoles: [
      UserRole.STAFF_MEMBER,
      UserRole.STUDENT,
    ],
    staffPositions: [
      StaffPosition.PROFESSOR,
      StaffPosition.STAFF,
      StaffPosition.TA,
    ],
  }),
  getUserRegisteredSessions
);

router.patch(
  "/:sessionId",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION],
    adminRoles: [AdministrationRoleType.EVENTS_OFFICE],
  }),
  editGymSession
);

router.delete(
  "/:sessionId",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION],
    adminRoles: [AdministrationRoleType.EVENTS_OFFICE],
  }),
  cancelGymSession
);
router.post(
  "/:sessionId/register",
  authorizeRoles({
    userRoles: [
      UserRole.STAFF_MEMBER,
      UserRole.STUDENT,
    ],
    staffPositions: [
      StaffPosition.PROFESSOR,
      StaffPosition.STAFF,
      StaffPosition.TA,
    ],
  }),
  registerUserToSession
);

export default router;
