import { UserRole } from "../constants/user.constants";
import { getAvailableCourtsResponse } from "../interfaces/responses/courtResponses.interface";
import { authorizeRoles } from "../middleware/authorizeRoles.middleware";
import { CourtService } from "../services/courtService";
import { Router, Request, Response } from "express";
import createError from "http-errors";
import { AuthenticatedRequest } from "../middleware/verifyJWT.middleware";

const courtService = new CourtService();

export async function getDayAvailableTimeSlots(req: Request, res: Response<getAvailableCourtsResponse>) {
  try {
    const courtId = req.params.courtId as string;
    const date = req.query.date as string;
    if (!date) {
      throw createError(400, "Date query parameter is required in YYYY-MM-DD format");
    }
    
    const result = await courtService.getDayAvailableTimeSlots(courtId, date);

    res.json({
      success: true,
      data: result,
      message: "Available slots retrieved successfully"
    });
  } catch (error: any) {
    throw createError(
      error.status || 500, 
      error.message || 'Error retrieving available slots'
    );
  }
}

async function getCourtDayAvailableTimeSlots(req: Request, res: Response<any>) {
  try {
    const result = await courtService.getAllCourtsAvailability();

    res.json({
      success: true,
      data: result,
      message: "Available slots retrieved successfully"
    });
  } catch (error: any) {
    throw createError(
      error.status || 500,
      error.message || 'Error retrieving available slots'
    );
  }
}

async function reserveCourtSlot(req: AuthenticatedRequest, res: Response<any>) {
  try {
    const courtId = req.params.courtId as string;
    const userId = req.user?.id;
    const { date, slot } = req.body;
    if (!date || !slot || !userId) {
      throw createError(400, "Date, slot, and userId are required in the request body");
    }
    await courtService.reserveCourtSlot(courtId,userId, date, slot);

    res.json({
      success: true,
      message: "Court slot reserved successfully"
    });
  } catch (error: any) {
    throw createError(
      error.status || 500,
      error.message || 'Error reserving court slot'
    );
  }
}

const router = Router();

router.get("/all", authorizeRoles({ userRoles: [UserRole.STUDENT] }), getCourtDayAvailableTimeSlots);
router.get("/:courtId/available-slots", authorizeRoles({ userRoles: [UserRole.STUDENT] }), getDayAvailableTimeSlots);
router.post("/:courtId/reserve", authorizeRoles({ userRoles: [UserRole.STUDENT] }), reserveCourtSlot);


export default router;