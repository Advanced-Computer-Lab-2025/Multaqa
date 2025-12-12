import * as cron from "node-cron";
import { UsheringService } from "./usheringService";
import { UserService } from "./userService";
import { sendInterviewReminderEmail, sendSlotOpeningReminderEmail } from "./emailService";
import { NotificationService } from "./notificationService";
import { NotificationType, UserRole } from "../constants/user.constants";
import { Notification } from "./notificationService";

/**
 * Ushering Scheduler Service
 */
export class UsheringSchedulerService {
	private usheringService: UsheringService;
	private userService: UserService;
	private cronJob: cron.ScheduledTask | null = null;
	private slotOpeningCronJob: cron.ScheduledTask | null = null;
	private sentSlotOpeningReminders: Set<string> = new Set();

	constructor() {
		this.usheringService = new UsheringService();
		this.userService = new UserService();
	}

	start() {
		// Runs every minute - check for interview reminders (24 hours before)
		this.cronJob = cron.schedule("* * * * *", async () => {
			try {
				console.log("🔔 Running interview reminder check...");
				await this.sendInterviewReminders();
			} catch (error) {
				console.error("Error in ushering scheduler:", error);
			}
		});

		// Runs every minute - check for slot opening reminders (5 minutes before)
		this.slotOpeningCronJob = cron.schedule("* * * * *", async () => {
			try {
				console.log("⏰ Running slot opening reminder check...");
				await this.sendSlotOpeningReminders();
			} catch (error) {
				console.error("Error in slot opening scheduler:", error);
			}
		});

		console.log("✅ Ushering interview reminder scheduler started");
		console.log("✅ Ushering slot opening reminder scheduler started");
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

	/**
	 * Check all ushering post times and send reminders 5 minutes before slots open
	 */
	private async sendSlotOpeningReminders() {
		try {
			const now = new Date();

			// Get all ushering documents
			const allUsherings = await this.usheringService.getAllTeams();

			let remindersSent = 0;

			for (const ushering of allUsherings) {
				// Check if this ushering has a post time
				if (!ushering.postTime || !ushering.postTime.startDateTime) {
					continue;
				}
				console.log("Checking ushering post time:", ushering.postTime.startDateTime);
				console.log("Current time:", now.toISOString());

				const postTime = new Date(ushering.postTime.startDateTime);
				const usheringId = ushering._id?.toString();

				// Check if we already sent a reminder for this ushering
				if (!usheringId || this.sentSlotOpeningReminders.has(usheringId)) {
					continue;
				}

				// Calculate time difference in minutes
				console.log("Post time:", postTime.toISOString());
				console.log("Five minutes from now:",  new Date(now.toISOString()));

				const timeDiff = new Date(postTime.toISOString()).getTime() - new Date(now.toISOString()).getTime();
				const minutesDiff = Math.floor(timeDiff / (60 * 1000));

				// Send reminder if slots open in exactly 5 minutes (within 1-minute window)
				if (minutesDiff === 5 || minutesDiff === 4) {
					try {

						// Get all students and send them emails
					const allStudents = await this.userService.getAllStudents();
						for (const student of allStudents) {
							try {
								await sendSlotOpeningReminderEmail(
									student.email,
									(student as any).firstName || "Student",
									postTime
								);
							} catch (emailError) {
								console.error(`Failed to send opening reminder email to ${student.email}:`, emailError);
							}
						}

						// Mark as sent to avoid duplicates
						this.sentSlotOpeningReminders.add(usheringId);
						remindersSent++;
						console.log(`⏰ Sent slot opening reminders for ushering ${usheringId}`);
					} catch (err) {
						console.error(`Failed to send slot opening reminders for ushering ${usheringId}:`, err);
					}
				}

				// Clean up old entries from tracking set (older than 1 hour)
				if (postTime.getTime() < now.getTime() - 60 * 60 * 1000) {
					if (usheringId) {
						this.sentSlotOpeningReminders.delete(usheringId);
					}
				}
			}

			if (remindersSent > 0) {
				console.log(`✅ Sent ${remindersSent} slot opening reminder(s)`);
			}
		} catch (error) {
			console.error("Slot opening scheduler error:", error);
		}
	}
}

export const usheringScheduler = new UsheringSchedulerService();