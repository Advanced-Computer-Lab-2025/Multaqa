import * as cron from "node-cron";
import { UsheringService } from "./usheringService";
import { UserService } from "./userService";
import { sendInterviewReminderEmail } from "./emailService";

/**
 * Ushering Scheduler Service
 * Sends reminders 24 hours before the scheduled interview time
 */
export class UsheringSchedulerService {
	private usheringService: UsheringService;
	private userService: UserService;
	private cronJob: cron.ScheduledTask | null = null;

	constructor() {
		this.usheringService = new UsheringService();
		this.userService = new UserService();
	}

	start() {
		// Runs every minute
		this.cronJob = cron.schedule("* * * * *", async () => {
			try {
				console.log("🔔 Running interview reminder check...");
				await this.sendInterviewReminders();
			} catch (error) {
				console.error("Error in ushering scheduler:", error);
			}
		});

		console.log("✅ Ushering interview reminder scheduler started");
	}

	/**
	 * Check all booked interview slots and send reminders for those happening in ~24 hours
	 */
	private async sendInterviewReminders() {
		try {
			const now = new Date();
			const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

			// Get all ushering documents
			const allUsherings = await this.usheringService.getAllTeams();

			let remindersSent = 0;

			for (const ushering of allUsherings) {
				for (const team of ushering.teams) {
					for (const slot of team.slots) {
						// Only check booked slots (not available and has a reservation)
						if (!slot.isAvailable && slot.reservedBy?.studentId) {
							const interviewTime = new Date(slot.StartDateTime);

							// Check if the interview is happening roughly 24 hours from now (within an hour window)
							// This ensures we catch it during one of the hourly cron runs
							if (interviewTime == tomorrow) {
								try {
									const student = await this.userService.getUserById(
										slot.reservedBy.studentId.toString()
									);

									if (student) {
										await sendInterviewReminderEmail(
											student.email,
											(student as any).firstName || 'Student',
											team.title,
											interviewTime,
											slot.location || 'TBA'
										);
										remindersSent++;
										console.log(`📧 Interview reminder sent to ${student.email} for ${team.title}`);
									}
								} catch (err) {
									console.error(`Failed to send reminder for slot ${slot._id}:`, err);
								}
							}
						}
					}
				}
			}

			if (remindersSent > 0) {
				console.log(`✅ Sent ${remindersSent} interview reminder(s)`);
			}
		} catch (error) {
			console.error("Ushering scheduler error:", error);
		}
	}
}

// Create and export a singleton instance
export const usheringScheduler = new UsheringSchedulerService();
