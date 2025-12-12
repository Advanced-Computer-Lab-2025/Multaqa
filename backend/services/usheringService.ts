import createError from "http-errors";
import { IUshering, ITeam, ISlot } from "../interfaces/models/ushering.interface";
import GenericRepository from "../repos/genericRepo";
import { ushering } from "../schemas/misc/usheringSchema";




export class UsheringService {
    private usheringRepo: GenericRepository<IUshering>;
    constructor() {
        this.usheringRepo = new GenericRepository<IUshering>(ushering);
    }

    async createUshering(usheringData: Partial<IUshering>): Promise<IUshering> {
        const newUshering = await this.usheringRepo.create(usheringData);
        return newUshering;
    }

    async setPostTime(postTime: Date,id: string): Promise<IUshering | null> {
        const usheringToUpdate = await this.usheringRepo.findById(id);
        if (!usheringToUpdate) {
            throw new Error('Ushering event not found');
        }
        if(postTime < new Date()){
            throw createError(400, 'Post time cannot be in the past');
        }
        usheringToUpdate.postTime = postTime;
        await usheringToUpdate.save();
        return usheringToUpdate;
    }



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
        
        transformedSlots.forEach(slot => {
            team.slots.push({
                StartDateTime: slot.StartDateTime!,
                EndDateTime: slot.EndDateTime!,
                location: slot.location ?? ''
            } as ISlot);
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

    async bookSlot(usheringId: string, teamId: string, slotId: string, studentId: string): Promise<void> {
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
        if (!slot.isAvailable) {
            throw createError(400, 'Slot is already reserved');
        }
        slot.isAvailable = false;
        slot.reservedBy = {
            studentId: studentId as any,
            reservedAt: new Date()
        };
        await ushering.save();
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


   async viewTeamInterviewSlots(usheringId: string,teamId: string): Promise<ISlot[]> {
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

     // Transform frontend slot format to database format
    private transformSlotData(frontendSlot: any): Partial<ISlot> {
        return {
            StartDateTime: new Date(frontendSlot.start),
            EndDateTime: new Date(frontendSlot.end),
            location: frontendSlot.location,
        };
    }
}