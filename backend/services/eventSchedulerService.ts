import cron from "node-cron";
import { EventsService } from "./eventService";

export class EventScheduler {
  private eventService: EventsService;

  constructor() {
    this.eventService = new EventsService();
  }

  // Schedule a cron job to check for upcoming events every hour
  start(): void {
    // Run every hour at minute
    cron.schedule("* * * * *", async () => {
      console.log("Running upcoming event reminder check...");
      await this.eventService.checkUpcomingEvents();
      await this.eventService.clearWaitlistsForStartedEvents();
    });

    console.log("Event reminder scheduler started");
  }
}
