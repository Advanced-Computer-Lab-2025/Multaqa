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

const router = Router();
router.get("/events", findAll);
router.get("/events/:id", findOne);

export default router;
