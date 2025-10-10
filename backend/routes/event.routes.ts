import { Router, Request, Response } from "express";
import { EventsService } from "../services/eventService";
import { create } from "domain";
import createError from "http-errors";
import { validateWorkshop } from "../validation/validateWorkshop";
import { validateConference } from "../validation/validateConference";

const eventsService = new EventsService();

async function findAll(req: Request, res: Response) {
  try {
    const { search, type, location, sort } = req.query;
    const events = await eventsService.getEvents(
      search as string,
      type as string,
      location as string,
      sort === "true"
    );
    if (!events || events.length === 0) {
      throw createError(404, "No events found");
    }
    res.json(events);
  } catch (err: any) {
    if (err.status || err.statusCode) {
      throw err;
    }
    throw createError(500, err.message);
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const event = await eventsService.getEventById(id);
    if (!event) {
      throw createError(404, "Event not found");
    }
    res.json(event);
  } catch (err: any) {
    throw createError(500, err.message);
  }
}
async function createEvent(req: Request, res: Response) {
  try {
    // Assuming req.user is set by auth middleware
    const user = (req as any).user || { id: "68e3f0de7908a3968faf13e2" };
    const { type } = req.body;
    let validationResult;

    switch (type) {
      case "conference":
        validationResult = validateConference(req.body);
        break;

      default:
        throw createError(400, "Invalid or unsupported event type");
    }

    // Handle Joi validation errors
    if (validationResult.error) {
      const message = validationResult.error.details
        .map((d) => d.message)
        .join(", ");
      throw createError(400, message);
    }

    const event = await eventsService.createEvent(user, req.body);
    res.status(201).json(event);
  } catch (err: any) {
    throw createError(500, err.message);
  }
}

async function deleteEvent(req: Request, res: Response) {
  const id = req.params.id;
  const deletedEvent = await eventsService.deleteEvent(id);
  res.json({ event: deletedEvent });
}

const router = Router();
router.get("/", findAll);
router.get("/:id", findOne);
router.post("/", createEvent);
router.delete("/:id", deleteEvent);

export default router;
