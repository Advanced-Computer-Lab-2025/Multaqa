import { UserRole } from "../constants/user.constants";
import { getAvailableCourtsResponse } from "../interfaces/responses/courtResponses.interface";
import { authorizeRoles } from "../middleware/authorizeRoles.middleware";
import { CourtService } from "../services/courtService";
import { Router, Request, Response } from "express";
import createError from "http-errors";

const courtService = new CourtService();

export async function getAvailableTimeSlots(req: Request, res: Response<getAvailableCourtsResponse>) {
  try {
    const courtId = req.params.courtId as string;
    const date = req.query.date as string;
    if (!date) {
      throw createError(400, "Date query parameter is required in YYYY-MM-DD format");
    }
    
    const result = await courtService.getAvailableTimeSlots(courtId, date);

    res.json({
      success: true,
      data: result,
      message: "Available slots retrieved successfully"
    });
  } catch (error) {
    if ((error as any).status || (error as any).statusCode) {
      throw error;
    }
    throw createError(500, "Error retrieving available slots: " + (error as Error).message);
  }
}

const router = Router();
router.get("/:courtId/available-slots", authorizeRoles({ userRoles: [UserRole.STUDENT] }), getAvailableTimeSlots);
export default router;