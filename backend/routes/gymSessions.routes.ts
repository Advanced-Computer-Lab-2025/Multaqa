import { GymSessionsService } from "../services/gymsessionsService";
import { Router, Request, Response } from "express";
import { createGymSessionValidationSchema } from "../validation/gymSessions.validation";
import createError from "http-errors";
import { CreateGymSessionResponse, GetAllGymSessionsResponse } from "../interfaces/responses/gymSessionsResponses.interface";
import { authorizeRoles } from "../middleware/authorizeRoles.middleware";
import { UserRole } from "../constants/user.constants";
import { AdministrationRoleType } from "../constants/administration.constants";
import { StaffPosition } from "../constants/staffMember.constants";

const gymSessionsService = new GymSessionsService();

async function createGymSession(req: Request, res: Response<CreateGymSessionResponse>) {
  try {
    const { value, error } = createGymSessionValidationSchema.validate(req.body);

    if (error) {
      const errorMessages = error.details.map(detail => detail.message).join('; ');
      throw createError(400, errorMessages);
    }

    const newSession = await gymSessionsService.createGymSession(value);

    res.status(201).json({
      success: true,
      message: 'Gym Session registered successfully',
      data: newSession
    });

  } catch (err: any) {
    throw createError(
      err.status || 500, 
      err.message || 'Error creating gym session'
    );
  }
}

async function getAllGymSessions(req: Request, res: Response<GetAllGymSessionsResponse>) {
  try {
    const sessions = await gymSessionsService.getAllGymSessions();

    if (!sessions || sessions.length === 0) {
      throw createError(404, "No gym sessions found");
    }

    res.json({
      success: true,
      data: sessions,
      message: "Gym sessions retrieved successfully"
    });
  } catch (err: any) {
    throw createError(
      err.status || 500, 
      err.message || 'Error retrieving gym sessions'
    );
  }
}

const router = Router();
router.get("/", authorizeRoles({ userRoles: [UserRole.ADMINISTRATION, UserRole.STAFF_MEMBER, UserRole.STUDENT], adminRoles: [AdministrationRoleType.EVENTS_OFFICE], staffPositions: [StaffPosition.PROFESSOR, StaffPosition.STAFF, StaffPosition.TA] }), getAllGymSessions);
router.post("/", authorizeRoles({ userRoles: [UserRole.ADMINISTRATION], adminRoles: [AdministrationRoleType.EVENTS_OFFICE] }), createGymSession);

export default router;