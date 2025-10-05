import { Router, Request, Response } from "express";
import { EventsService } from "../services/eventService";

const eventsService = new EventsService();

async function findAll(req: Request, res: Response) {
 try {
    const { search,type,location,startDate,endDate,sort } = req.query; // extract search param
    const events = await eventsService.getAllEvents({
      search: search as string, 
      type: type as string,
      location: location as string,
      startDate: startDate as string,
      endDate: endDate as string,
      sort: sort as unknown as boolean
    });
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
  res.json(deletedEvent);
  
}

const router = Router();
router.get("/events", findAll);
router.get("/events/:id", findOne);
router.delete("/events/:id", deleteEvent);

export default router;
