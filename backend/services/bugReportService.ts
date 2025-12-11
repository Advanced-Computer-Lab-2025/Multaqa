import GenericRepository from "../repos/genericRepo";
import { IBugReport } from '../interfaces/models/bugReport.interface';
import { BugReport } from '../schemas/misc/bugReportSchema';
import { BUG_REPORT_STATUS } from '../constants/bugReport.constants';
import { IUser } from "../interfaces/models/user.interface";
import { User } from "../schemas/stakeholder-schemas/userSchema";
import mongoose from "mongoose";
import { pdfGenerator } from "../utils/pdfGenerator";
import createError from "http-errors";
import { UserRole } from "../constants/user.constants";
import { IAdministration } from "../interfaces/models/administration.interface";
import { BugReportData } from "../utils/pdfGenerator";
import { sendBugReportEmail } from "./emailService";
import { NotificationService } from "./notificationService";
import { Notification } from "./notificationService";


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
        const newBugReport = await this.bugReportRepo.create({...bugReportData, createdBy: new mongoose.Types.ObjectId(userId), date: new Date(), status: BUG_REPORT_STATUS.PENDING});
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
        if (status === BUG_REPORT_STATUS.RESOLVED) {
            const reporter = await this.userRepo.findById(updatedBugReport.createdBy.toString());
            if (reporter && reporter.email) {
                await this.sendEmailToDevelopers(updatedBugReport,reporter.email);
            }
        }
        await updatedBugReport.save();
        if (status === BUG_REPORT_STATUS.RESOLVED){
         await NotificationService.sendNotification({
              userId: updatedBugReport.createdBy.toString(), 
              type: "BUG_RESOLVED",
              title: "Bug Report Status Updated",
              message: `Your bug report titled "${updatedBugReport.title}" has been resolved.`,
              createdAt: new Date(),
            } as Notification);
    }
}

   async getBugReportById(bugReportId: string): Promise<IBugReport | null> {
        const bugReport = await this.bugReportRepo.findById(bugReportId);
        return bugReport;
    }

    async sendEmailToDevelopers(bugReport: IBugReport,email: string): Promise<void> {
        if (bugReport.status === BUG_REPORT_STATUS.RESOLVED) {
            throw createError(400, 'Bug report is already resolve');
        }
        const user = await this.userRepo.findById(bugReport.createdBy.toString());
        if (!user) {
            throw createError(404, 'Reporter user not found');
        }
        let reporterName: string="Unknown";
        if (user.role === UserRole.ADMINISTRATION) {
           reporterName =(user as IAdministration).name
        }
        else {
          reporterName = `${(user as any).firstName} ${(user as any).lastName}`;
        }
        const bugReportData:BugReportData={ 
            status: bugReport.status,
            submittedDate: bugReport.date,
            reportedBy: reporterName,
            title: bugReport.title,
            stepsToReproduce: bugReport.stepsToReproduce,
            expectedResult: bugReport.expectedBehavior,
            actualResult: bugReport.actualBehavior,
            environment: bugReport.enviroment,
            generationDate: new Date()
       
        }
        const buffer= await pdfGenerator.generateBugReportPDF(bugReportData);
        await sendBugReportEmail(email, bugReport.title, buffer);

    }
  
}