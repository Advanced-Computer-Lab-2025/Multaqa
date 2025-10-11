import { Router, Request, Response } from "express";
import { EventsService } from "../services/eventService";
import { create } from "domain";
import createError from "http-errors";
import { validateWorkshop } from "../validation/validateWorkshop";
import { validateUpdateWorkshop } from "../validation/validateUpdateWorkshop";
import { ProfessorService } from "../services/professorService";

const professorService = new ProfessorService();

async function createWorkshop(req: Request, res: Response) {
  try {
    // Assuming req.user is set by auth middleware
    const professorid = req.params.id;
    const { type } = req.body;
    let validationResult;

    validationResult = validateWorkshop(req.body);

    // Handle Joi validation errors
    if (validationResult.error) {
      const message = validationResult.error.details
        .map((d) => d.message)
        .join(", ");
      throw createError(400, message);
    }

    const event = await professorService.createWorkshop(req.body, professorid);
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
async function updateWorkshop(req: Request, res: Response) {
  try {
    const workshopId = req.params.workshopId;
    const validationResult = validateUpdateWorkshop(req.body);

    if (validationResult.error) {
      throw createError(
        400,
        validationResult.error.details.map((d) => d.message).join(", ")
      );
    }

    const updatedWorkshop = await professorService.updateWorkshop(
      workshopId,
      req.body
    );
    res.status(200).json(updatedWorkshop);
  } catch (err: any) {
    console.error("Error updating workshop:", err);
    throw createError(500, err.message);
  }
}
const router = Router();
router.post("/:id/workshops", createWorkshop);
router.patch("/:id/workshops/:workshopId", updateWorkshop);

export default router;
