import { validateUpdateWorkshop } from "../validation/validateUpdateWorkshop";
import { EventsOfficeService } from "../services/eventsOfficeService";
import { Router, Request, Response } from "express";
import createError from "http-errors";

const eventsOfficeService = new EventsOfficeService();

async function updateWorkshopStatus(req: Request, res: Response) {
  try {
    const workshopId = req.params.id;
    const { approvalStatus, comments } = req.body; // ✅ new payload format

    // ✅ Validate using your Joi validator
    const { error } = validateUpdateWorkshop({ approvalStatus, comments });
    if (error) {
      throw createError(400, error.details.map((d) => d.message).join(", "));
    }

    // ✅ Pass both approvalStatus and comments to the service
    const updatedWorkshop = await eventsOfficeService.updateWorkshopStatus(
      workshopId,
      { approvalStatus, comments }
    );

    res.status(200).json(updatedWorkshop);
  } catch (err: any) {
    console.error("Error updating workshop status:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}

const router = Router();
router.patch("/workshops/:id/status", updateWorkshopStatus);
export default router;
