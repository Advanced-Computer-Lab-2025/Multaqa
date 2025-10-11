import { GymSessionsService } from "../services/gymsessionsService";
import { Router, Request, Response } from "express";
import { createGymSessionValidationSchema } from "../validation/gymSessions.validation";
import createError from "http-errors";

const gymSessionsService = new GymSessionsService();

async function createGymSession(req: Request, res: Response) {
  try {
    const { value, error } = createGymSessionValidationSchema.validate(req.body);

    if (error) {
      const errorMessages = error.details.map(detail => detail.message).join('; ');
      throw createError(400, errorMessages);
    }

    const newSession = await gymSessionsService.createGymSession(value);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: newSession
    });

  } catch (err: any) {
    if (err.status || err.statusCode) {
      throw err;
    }
    throw createError(500, err.message);
  }
}

async function getAllGymSessions(req: Request, res: Response) {
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
    throw createError(500, err.message);
  }
}

const router = Router();
router.get("/", getAllGymSessions);
router.post("/", createGymSession);
export default router;




