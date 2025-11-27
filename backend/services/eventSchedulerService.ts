import cron from "node-cron";
import { EventsService } from "./eventService";

export class EventScheduler {
  private eventService: EventsService;

  constructor() {
    this.eventService = new EventsService();
  }

  // Schedule a cron job to check for upcoming events every hour
  start(): void {
    // Run every hour at minute 0, so it runs once every hour at HH:00 (e.g., 1:00, 2:00, 3:00…).
    cron.schedule("0 * * * *", async () => {
      console.log("Running upcoming event reminder check...");
      await this.eventService.checkUpcomingEvents();
    });

    console.log("Event reminder scheduler started");
  }
}
