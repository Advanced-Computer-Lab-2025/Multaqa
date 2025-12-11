import * as cron from "node-cron";
import { WaitlistService } from "./waitlistService";
import { EventsService } from "./eventService";
import { EVENT_TYPES } from "../constants/events.constants";
import { IEvent } from "../interfaces/models/event.interface";

/**
 * Waitlist Scheduler Service
 * Runs every minute to check for expired payment deadlines on waitlists
 * and automatically promotes the next users in line
 */
export class WaitlistSchedulerService {
  private eventsService: EventsService;
  private waitlistService: WaitlistService;
  private cronJob: cron.ScheduledTask | null = null;

  constructor() {
    this.eventsService = new EventsService();
    this.waitlistService = new WaitlistService();
  }

  /**
   * Start the waitlist scheduler
   * Runs every minute to process expired payment deadlines
   */
  start() {
    // Run every minute
    this.cronJob = cron.schedule("* * * * *", async () => {
      try {
        await this.processExpiredPaymentDeadlines();
      } catch (error) {
        console.error("Error in waitlist scheduler:", error);
      }
    });

    console.log("✅ Waitlist scheduler started");
  }

  /**
   * Stop the waitlist scheduler
   */
  stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      console.log("⏹️ Waitlist scheduler stopped");
    }
  }

  /**
   * Process all events with waitlists and remove expired payment deadlines
   */
  private async processExpiredPaymentDeadlines() {
    try {
      // Fetch events and process expired waitlist entries
      const events = await this.eventsService.getEvents();
      const eventsWithWaitlists = events.filter(
        (event: any) =>
          (event.type === EVENT_TYPES.TRIP ||
            event.type === EVENT_TYPES.WORKSHOP) &&
          event.waitlist &&
          event.waitlist.length > 0 &&
          event.waitlist.some(
            (entry: any) =>
              entry.status === "pending_payment" && entry.paymentDeadline
          )
      );

      // Process each event and count removed entries
      let totalRemoved = 0;
      for (const event of eventsWithWaitlists) {
        const eventDoc = event as IEvent & { _id: any };
        const removed = await this.waitlistService.removeExpiredWaitlistEntries(
          eventDoc._id.toString()
        );
        totalRemoved += removed;
      }

      // Only log when removals actually occurred to keep logs concise
      if (totalRemoved > 0) {
        console.log(
          `Waitlist scheduler: removed ${totalRemoved} expired waitlist entries across ${eventsWithWaitlists.length} events.`
        );
      }
    } catch (error) {
      console.error("Waitlist scheduler error:", error);
    }
  }
}

// Create and export a singleton instance
export const waitlistScheduler = new WaitlistSchedulerService();
