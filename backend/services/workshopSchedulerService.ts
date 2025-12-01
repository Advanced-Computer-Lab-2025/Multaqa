import cron from "node-cron";
import { WorkshopService } from "./workshopsService";

export class WorkshopScheduler {
  private workshopService = new WorkshopService();

  // Schedule a cron job to check for completed workshops every hour
  start(): void {
    // Run every minute
    cron.schedule("* * * * *", async () => {
      console.log("Running workshop completion check...");
      await this.workshopService.processCompletedWorkshops();
    });

    console.log("Workshop certificate scheduler started");
  }
}
