import { validateUpdateWorkshop } from "../validation/validateUpdateWorkshop";
import { EventsOfficeService } from "../services/eventsOfficeService";
import { Router, Request, Response } from "express";
import createError from "http-errors";
import { UpdateWorkshopResponse } from "../interfaces/responses/eventOfficeResponses.interface";
import { ObjectId } from "mongodb";

const eventsOfficeService = new EventsOfficeService();

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

    const updatedWorkshop = await eventsOfficeService.updateWorkshopStatus(
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
router.patch("/workshops/:id/status", updateWorkshopStatus);
export default router;
