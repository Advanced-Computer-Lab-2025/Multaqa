import { Router, Request, Response } from "express";
import { EventsService } from "../services/eventService";

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
    res.json(events);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
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
router.get("/events", findAll);
router.get("/events/:id", findOne);
router.delete("/events/:id", deleteEvent);

export default router;
