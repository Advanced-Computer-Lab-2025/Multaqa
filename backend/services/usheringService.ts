import createError from "http-errors";
import { IUshering, ITeam, ISlot } from "../interfaces/models/ushering.interface";
import GenericRepository from "../repos/genericRepo";
import { ushering } from "../schemas/misc/usheringSchema";
import { Types } from "mongoose";

export class UsheringService {
	private usheringRepo: GenericRepository<IUshering>;
	constructor() {
		this.usheringRepo = new GenericRepository<IUshering>(ushering);
	}

	async createUshering(usheringData: Partial<IUshering>): Promise<IUshering> {
		const newUshering = await this.usheringRepo.create(usheringData);
		return newUshering;
	}

	async setPostTime(postTime: Date, id: string): Promise<IUshering | null> {
		const usheringToUpdate = await this.usheringRepo.findById(id);
		if (!usheringToUpdate) {
			throw new Error('Ushering event not found');
		}
		if (postTime < new Date()) {
			throw createError(400, 'Post time cannot be in the past');
		}
		usheringToUpdate.postTime = postTime;
		await usheringToUpdate.save();
		return usheringToUpdate;
	}

	async getPostTime(id: string): Promise<Date | null> {
		const ushering = await this.usheringRepo.findById(id);
		if (!ushering) {
			throw new Error('Ushering event not found');
		}
		return ushering.postTime || null;
	}

	//send notification when teams are edited
	async editTeam(usheringId: string, teamId: string, teamData: Partial<ITeam>): Promise<IUshering | null> {
		const ushering = await this.usheringRepo.findById(usheringId);
		if (!ushering) {
			throw createError(404, 'Ushering event not found');
		}
		if (ushering.postTime && new Date(Date.now()) >= new Date(new Date(ushering.postTime).getTime() - 2 * 24 * 60 * 60 * 1000)) {
			throw createError(400, 'Cannot edit teams within 2 days before the interview posting date.');
		}

		const teamIndex = ushering.teams.findIndex(t => t._id?.toString() === teamId);
		if (teamIndex === -1) {
			throw createError(404, 'Team not found');
		}

		if (teamData.title !== undefined && teamData.title !== null) {
			ushering.teams[teamIndex].title = teamData.title;
		}
		if (teamData.description !== undefined && teamData.description !== null) {
			ushering.teams[teamIndex].description = teamData.description;
		}
		if (teamData.slots !== undefined && teamData.slots !== null) {
			ushering.teams[teamIndex].slots = teamData.slots;
		}

		await ushering.save();
		return ushering;
	}

	async deleteTeam(usheringId: string, teamId: string): Promise<IUshering | null> {
		const ushering = await this.usheringRepo.findById(usheringId);
		if (!ushering) {
			throw createError(404, 'Ushering event not found');
		}
		if (ushering.postTime && new Date(Date.now()) >= new Date(new Date(ushering.postTime).getTime() - 2 * 24 * 60 * 60 * 1000)) {
			throw createError(400, 'Cannot delete teams within 2 days before the interview posting date.');
		}
		const teamIndex = ushering.teams.findIndex(t => t._id?.toString() === teamId);
		if (teamIndex === -1) {
			throw createError(404, 'Team not found');
		}
		ushering.teams.splice(teamIndex, 1);
		await ushering.save();
		return ushering;
	}

	async getAllTeams(): Promise<IUshering[]> {
		const usheringEvents = await this.usheringRepo.findAll();
		return usheringEvents;
	}

	async addTeamReservationSlots(usheringId: string, teamId: string, slots: any[]): Promise<void> {
		const ushering = await this.usheringRepo.findById(usheringId);
		if (!ushering) {
			throw createError(404, 'Ushering event not found');
		}
		const team = ushering.teams.find(t => t._id?.toString() === teamId);
		if (!team) {
			throw createError(404, 'Team not found');
		}

		// Transform slots from frontend format {start, end} to DB format {StartDateTime, EndDateTime}
		const transformedSlots = slots.map(slot => this.transformSlotData(slot));

		// Only add slots that don't overlap with existing slots
		transformedSlots.forEach(slot => {
			const hasOverlap = team.slots.some(existingSlot => {
				const newStart = new Date(slot.StartDateTime!).getTime();
				const newEnd = new Date(slot.EndDateTime!).getTime();
				const existingStart = new Date(existingSlot.StartDateTime).getTime();
				const existingEnd = new Date(existingSlot.EndDateTime).getTime();

				// Check for any overlap: new slot starts before existing ends AND new slot ends after existing starts
				return newStart < existingEnd && newEnd > existingStart;
			});

			// Only add if there's no overlap
			if (!hasOverlap) {
				team.slots.push({
					StartDateTime: slot.StartDateTime!,
					EndDateTime: slot.EndDateTime!,
					location: slot.location ?? ''
				} as ISlot);
			}
		});
		await ushering.save();
	}

	async deleteSlot(usheringId: string, teamId: string, slotId: string): Promise<void> {
		const ushering = await this.usheringRepo.findById(usheringId);
		if (!ushering) {
			throw createError(404, 'Ushering event not found');
		}
		const team = ushering.teams.find(t => t._id?.toString() === teamId);
		if (!team) {
			throw createError(404, 'Team not found');
		}
		const slotIndex = team.slots.findIndex(s => s._id?.toString() === slotId);
		if (slotIndex === -1) {
			throw createError(404, 'Slot not found');
		}
		if (!team.slots[slotIndex].isAvailable) {
			throw createError(400, 'Cannot delete a reserved slot');
		}
		team.slots.splice(slotIndex, 1);
		await ushering.save();
	}

	// send an email a day before the booked slot
	async bookSlot(usheringId: string, teamId: string, slotId: string, studentId: string): Promise<void> {
		// Perform an atomic update in the database to avoid race conditions.
		// The query ensures the slot is still available and the student hasn't
		// already booked any slot inside this ushering document.
		const result = await ushering.findOneAndUpdate(
			{
				_id: usheringId,
				'teams._id': teamId,
				'teams.slots._id': slotId,
				'teams.slots.isAvailable': true,
				'teams.slots.reservedBy.studentId': { $ne: new Types.ObjectId(studentId) }
			},
			{
				$set: {
					'teams.$[team].slots.$[slot].isAvailable': false,
					'teams.$[team].slots.$[slot].reservedBy': {
						studentId: new Types.ObjectId(studentId),
						reservedAt: new Date()
					}
				}
			},
			{
				arrayFilters: [
					{ 'team._id': teamId },
					{ 'slot._id': slotId }
				],
				new: true
			}
		);

		// If null, the update didn't match — determine why and throw a clear error.
		if (!result) {
			const usheringDoc = await this.usheringRepo.findById(usheringId);
			if (!usheringDoc) throw createError(404, 'Ushering event not found');

			// Has the student already booked anywhere?
			const hasExistingBooking = usheringDoc.teams.some(team =>
				team.slots.some(slot => slot.reservedBy?.studentId?.toString() === studentId)
			);
			if (hasExistingBooking) {
				throw createError(400, 'You have already booked an interview slot.');
			}

			const team = usheringDoc.teams.find(t => t._id?.toString() === teamId);
			if (!team) throw createError(404, 'Team not found');

			const slot = team.slots.find(s => s._id?.toString() === slotId);
			if (!slot) throw createError(404, 'Slot not found');

			if (!slot.isAvailable) throw createError(409, 'Slot is already reserved');

			// Fallback
			throw createError(500, 'Failed to book slot');
		}
	}

	async cancelBooking(usheringId: string, teamId: string, slotId: string, studentId: string): Promise<void> {
		const ushering = await this.usheringRepo.findById(usheringId);
		if (!ushering) {
			throw createError(404, 'Ushering event not found');
		}
		const team = ushering.teams.find(t => t._id?.toString() === teamId);
		if (!team) {
			throw createError(404, 'Team not found');
		}
		const slot = team.slots.find(s => s._id?.toString() === slotId);
		if (!slot) {
			throw createError(404, 'Slot not found');
		}
		if (slot.isAvailable || slot.reservedBy?.studentId.toString() !== studentId) {
			throw createError(400, 'Slot is not reserved by this student');
		}
		slot.isAvailable = true;
		slot.reservedBy = undefined;
		await ushering.save();
	}


	async viewTeamInterviewSlots(usheringId: string, teamId: string): Promise<ISlot[]> {
		const ushering = await this.usheringRepo.findById(usheringId, {
			populate: [{
				path: 'teams.slots.reservedBy.studentId',
				select: 'firstName lastName gucId email'
			}] as any
		});
		if (!ushering) {
			throw createError(404, 'Ushering event not found');
		}
		const team = ushering.teams.find(t => t._id?.toString() === teamId);
		if (!team) {
			throw createError(404, 'Team not found');
		}
		return team.slots;
	}

	async getUserRegisteredSlot(usheringId: string, studentId: string): Promise<{
		team: {
			title: string;
			description: string;
		};
		slot: ISlot;
	} | null> {
		const ushering = await this.usheringRepo.findById(usheringId, {
			populate: [{
				path: 'teams.slots.reservedBy.studentId',
				select: 'firstName lastName gucId email'
			}] as any
		});

		if (!ushering) {
			throw createError(404, 'Ushering event not found');
		}

		// Loop through teams to find the user's registration
		for (const team of ushering.teams) {
			// Loop through slots in each team
			for (const slot of team.slots) {
				// Check if this slot is reserved by the user
				// Handle both ObjectId and populated user object
				if (slot.reservedBy && slot.reservedBy.studentId) {
					// If studentId is populated (an object), access its _id
					const studentIdValue: any = slot.reservedBy.studentId;
					const reservedStudentId = studentIdValue._id
						? studentIdValue._id.toString()
						: studentIdValue.toString();

					if (reservedStudentId === studentId) {
						return {
							team: {
								title: team.title,
								description: team.description
							},
							slot: slot
						};
					}
				}
			}
		}

		// User is not registered to any slot
		throw createError(404, 'No registered slot found ');
	}

	// Transform frontend slot format to database format
	private transformSlotData(frontendSlot: any): Partial<ISlot> {
		return {
			StartDateTime: new Date(frontendSlot.start),
			EndDateTime: new Date(frontendSlot.end),
			location: frontendSlot.location,
		};
	}
}