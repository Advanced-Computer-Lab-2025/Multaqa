import { getAvailableCourtsResponse } from "../interfaces/responses/courtResponses.interface";
import { Court } from "../schemas/court-schema/courtSchema";
import { CourtService } from "../services/courtService";
import { Router,Request,Response } from "express";
import createError from "http-errors";


const courtService= new CourtService();

    export async function getAvailableTimeSlots(req:Request, res:Response<getAvailableCourtsResponse>) {
        const courtId = req.params.courtId as string;
        const date = req.query.date as string;
        try {
            if (!date) {
                throw createError(400, "Date query parameter is required in YYYY-MM-DD format");
            }
            const result = await courtService.getAvailableTimeSlots(courtId, date);
            if (!result || result.availableSlots.length === 0) {
               throw createError(404, "No available slots found for this court on the specified date");
            }
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
    router.get("/:courtId/available-slots", getAvailableTimeSlots);
    export default router;