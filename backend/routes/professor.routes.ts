import { Router, Request, Response } from "express";
import { EventsService } from "../services/eventService";
import { create } from "domain";
import createError from "http-errors";
import { validateWorkshop } from "../validation/validateWorkshop";
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
      const essage = validationResult.error.details
        .map((d) => d.message)
        .join(", ");
      throw createError(400, message);
    }

    const event = await professorService.createWorkshop(req.body, professorid);
    res.status(201).json(event);
  } catch (err: any) {
    console.error("Error creating workshop:", err);
    throw createError(500, err.message);
  }
}

const router = Router();
router.post("/:id/workshops", createWorkshop);

export default router;
