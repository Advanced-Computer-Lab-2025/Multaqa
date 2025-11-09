import cron from "node-cron";
import { WorkshopService } from "./workshopsService";

export class WorkshopScheduler {
  private workshopService = new WorkshopService();

  // Schedule a cron job to check for completed workshops every hour
  start(): void {
    // Run every hour at minute 0, so it runs once every hour at HH:00 (e.g., 1:00, 2:00, 3:00…).
    cron.schedule("0 * * * *", async () => {
      console.log("Running workshop completion check...");
      await this.workshopService.processCompletedWorkshops();
    });

    console.log("Workshop certificate scheduler started");
  }
}
