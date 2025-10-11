import { Router, Request, Response } from "express";
import { UserService } from "../services/userService";
import createError from "http-errors";
import { EventsService } from "../services/eventService";
import { validateEventRegistration } from "../validation/validateEventRegistration";
import { Schema } from "mongoose";

const userService = new UserService();
const eventsService = new EventsService();

async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await userService.getAllUsers();
    if (!users || users.length === 0) {
      throw createError(404, "No users found");
    }
    res.json(users);
  } catch (err: any) {
    if (err.status || err.statusCode) {
      throw err;
    }
    throw createError(500, err.message);
  }
}

async function getUserById(req: Request, res: Response) {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      throw createError(404, "User not found");
    }
    res.json(user);
  } catch (err: any) {
    throw createError(500, err.message);
  }
}

// this will come back in sprint 2 guys (Stripe API)
async function registerForEvent(req: Request, res: Response) {
  const { eventId, id } = req.params;
  const validatedData = validateEventRegistration(req.body);
  if (validatedData.error) {
    throw createError(
      400,
      validatedData.error.details.map((d) => d.message).join(", ")
    );
  }
  const updatedEvent = await eventsService.registerUserForEvent(
    eventId,
    validatedData.value
  );

  await userService.addEventToUser(
    id,
    updatedEvent._id as Schema.Types.ObjectId
  );

  res.json({
    success: true,
    message: "User registered for event successfully",
    data: updatedEvent,
  });
}
const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/:id/register/:eventId", registerForEvent);

export default router;
