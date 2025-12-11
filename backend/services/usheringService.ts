import createError from "http-errors";
import { IUshering, ITeam } from "../interfaces/models/ushering.interface";
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
        if (teamData.color !== undefined && teamData.color !== null) {
            ushering.teams[teamIndex].color = teamData.color;
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
}