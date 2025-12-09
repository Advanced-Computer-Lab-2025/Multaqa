import GenericRepository from "../repos/genericRepo";
import { IBugReport } from '../interfaces/models/bugReport.interface';
import { BugReport } from '../schemas/misc/bugReportSchema';
import { BUG_REPORT_STATUS } from '../constants/bugReport.constants';
import { IUser } from "../interfaces/models/user.interface";
import { User } from "../schemas/stakeholder-schemas/userSchema";

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
        const newBugReport = await this.bugReportRepo.create({...bugReportData, reporter: user});
        return newBugReport;
    }
    async getAllBugReports(): Promise<IBugReport[]> {
        const bugReports = await this.bugReportRepo.findAll();
        return bugReports;
    }
    async updateBugReportStatus(bugReportId: string, status: BUG_REPORT_STATUS): Promise<void> {
        const updatedBugReport = await this.bugReportRepo.findById(bugReportId);
        if (!updatedBugReport) {
            throw new Error('Bug report not found');
        }
        updatedBugReport.status = status;
        updatedBugReport.updatedAt = new Date();
        await updatedBugReport.save();
    }
  
}