import { Router, Request, Response } from "express";
import { EventsService } from "../services/eventService";
import { create } from "domain";
import createError from "http-errors";
import { validateWorkshop } from "../validation/validateWorkshop";
import { validateConference } from "../validation/validateConference";
import { date } from "joi";
import { setDefaultCACertificates } from "tls";
import { validateCreateEvent } from "../validation/validateCreateEvent";
import { validateUpdateConference } from "../validation/validateUpdateConference";

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
    res.json({
      success: true,
      data: events,
      message: "Events retrieved successfully"
    });
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
    res.json({
      success: true,
      date: event,
      message: "Event retrieved successfully"
    });
  } catch (err: any) {
    throw createError(500, err.message);
  }
}

async function createEvent(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { type } = req.body;
    let validationResult;

    switch (type) {
      case "conference":
        validationResult = validateConference(req.body);
        break;
      case "bazaar":
      case "trip":
        validationResult = validateCreateEvent(req.body);
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
    res.status(201).json({
      success: true,
      data: event,
      message: "Event created successfully"
    });
  } catch (err: any) {
    throw createError(500, err.message);
  }
}

async function updateEvent(req: Request, res: Response) {
  try {
    const eventId = req.params.id;
    const updateData = req.body;

    let validationResult;

    //have to specifcy type in postman since it needs it to validate
    switch (req.body.type) {
      case "conference":
        // Validate conference-specific fields
        validationResult = validateUpdateConference(req.body);
        break;

      default:
        throw createError(400, "Invalid or unsupported event type");
    }

    if (validationResult.error) {
      const message = validationResult.error.details
        .map((d) => d.message)
        .join(", ");
      throw createError(400, message);
    }

    const updatedEvent = await eventsService.updateEvent(eventId, updateData);

    res.status(200).json(updatedEvent);
  } catch (err: any) {
    console.error("Error updating Event:", err);
    throw createError(500, err.message);
  }
}

async function deleteEvent(req: Request, res: Response) {
  const id = req.params.id;
  const deletedEvent = await eventsService.deleteEvent(id);
  res.json({ 
    success: true,
    event: deletedEvent,
    message: "Event deleted successfully"
  });
}

const router = Router();
router.get("/", findAll);
router.get("/:id", findOne);
router.post("/", createEvent);
router.delete("/:id", deleteEvent);
router.patch("/:id", updateEvent);

export default router;
