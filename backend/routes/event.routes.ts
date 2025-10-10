import { Router, Request, Response } from "express";
import { EventsService } from "../services/eventService";
import { create } from "domain";
import createError from "http-errors";

const eventsService = new EventsService();

async function findAll(req: Request, res: Response) {
 try {
    const { search,type,location,sort } = req.query; 
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

async function deleteEvent(req: Request, res: Response) {
  const id = req.params.id;
  const deletedEvent = await eventsService.deleteEvent(id);
  res.json({ event: deletedEvent });
}

const router = Router();
router.get("/", findAll);
router.get("/:id", findOne);
router.delete("/:id", deleteEvent);

export default router;
