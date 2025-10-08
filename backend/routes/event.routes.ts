import { Router, Request, Response } from "express";
import { EventsService } from "../services/eventService";

const eventsService = new EventsService();

async function findAll(req: Request, res: Response) {
  const events = await eventsService.getAllEvents();
  console.log(events);
  res.json(events);
}

async function findOne(req: Request, res: Response) {
  const id = req.params.id;
  const event = await eventsService.getEventById(id);
  res.json(event);
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
