import GenericRepository from "../repos/genericRepo";
import { IBugReport } from '../interfaces/models/bugReport.interface';
import { BugReport } from '../schemas/misc/bugReportSchema';
import { BUG_REPORT_STATUS } from '../constants/bugReport.constants';
import { IUser } from "../interfaces/models/user.interface";
import { User } from "../schemas/stakeholder-schemas/userSchema";
import mongoose from "mongoose";

const { Types } = require("mongoose");

export class BugReportService {
    private bugReportRepo: GenericRepository<IBugReport>;
    private userRepo: GenericRepository<IUser>;
    constructor() {
        this.bugReportRepo = new GenericRepository<IBugReport>(BugReport);
        this.userRepo = new GenericRepository(User);
    }
    async createBugReport(bugReportData: Partial<IBugReport>,userId: string): Promise<IBugReport> {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new Error('Reporter user not found');
        }
        const newBugReport = await this.bugReportRepo.create({...bugReportData, createdBy: new mongoose.Types.ObjectId(userId), date: new Date().toISOString() ,status: BUG_REPORT_STATUS.PENDING});
        return newBugReport;
    }
    async getAllBugReports(): Promise<IBugReport[]> {
        const bugReports = await this.bugReportRepo.findAll({}, { populate: {
            path: 'createdBy', 
            select: 'email firstName lastName role gucId companyName ', 
        } as any});
        return bugReports;
    }
    async updateBugReportStatus(bugReportId: string, status: BUG_REPORT_STATUS): Promise<void> {
        const updatedBugReport = await this.bugReportRepo.findById(bugReportId);
        if (!updatedBugReport) {
            throw new Error('Bug report not found');
        }
        updatedBugReport.status = status;
        await updatedBugReport.save();
    }
  
}