import * as cron from "node-cron";
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
  private cronJob: cron.ScheduledTask | null = null;

  constructor() {
    this.eventsService = new EventsService();
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

    console.log("✅ Waitlist scheduler started - checking every minute");
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
    console.log(
      "🔍 [SCHEDULER] Running waitlist check at",
      new Date().toISOString()
    );
    try {
      // Get all events with waitlists (trips and workshops only)
      const events = await this.eventsService.getEvents(
        undefined, // search
        undefined, // type
        undefined, // location
        false, // sort
        undefined, // startDate
        undefined, // endDate
        undefined, // userRole
        undefined // userPosition
      );

      console.log(`🔍 [SCHEDULER] Total events found: ${events.length}`);

      // Filter for events with waitlists that have pending_payment entries
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

      console.log(
        `🔍 [SCHEDULER] Events with pending payments: ${eventsWithWaitlists.length}`
      );

      if (eventsWithWaitlists.length === 0) {
        console.log("🔍 [SCHEDULER] No events with pending payments found");
        return; // No events with pending payments
      }

      // Log details of events being processed
      eventsWithWaitlists.forEach((event: any) => {
        const pendingEntries = event.waitlist.filter(
          (e: any) => e.status === "pending_payment"
        );
        console.log(`🔍 [SCHEDULER] Event ${event._id}:`, {
          name: event.eventName,
          pendingCount: pendingEntries.length,
          deadlines: pendingEntries.map((e: any) => ({
            userId: e.userId,
            deadline: e.paymentDeadline,
            expired: new Date(e.paymentDeadline) < new Date(),
          })),
        });
      });

      // Process each event
      let totalRemoved = 0;
      for (const event of eventsWithWaitlists) {
        const eventDoc = event as IEvent & { _id: any };
        const removed = await this.eventsService.removeExpiredWaitlistEntries(
          eventDoc._id.toString()
        );
        totalRemoved += removed;
      }

      if (totalRemoved > 0) {
        console.log(
          `📋 Waitlist scheduler: Removed ${totalRemoved} expired payment deadline(s) and promoted next users`
        );
      } else {
        console.log("🔍 [SCHEDULER] No expired deadlines found to remove");
      }
    } catch (error) {
      console.error(
        "❌ [SCHEDULER] Error processing expired payment deadlines:",
        error
      );
    }
  }
}

// Create and export a singleton instance
export const waitlistScheduler = new WaitlistSchedulerService();
