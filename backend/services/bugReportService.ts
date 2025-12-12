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
import { AdministrationRoleType } from "../constants/administration.constants";
import { IAdministration } from "../interfaces/models/administration.interface";
import { BugReportData } from "../utils/pdfGenerator";
import { sendBugReportEmail } from "./emailService";
import { NotificationService } from "./notificationService";
import { Notification } from "./notificationService";
import ExcelJS from "exceljs";


export class BugReportService {
  private bugReportRepo: GenericRepository<IBugReport>;
  private userRepo: GenericRepository<IUser>;

  constructor() {
    this.bugReportRepo = new GenericRepository<IBugReport>(BugReport);
    this.userRepo = new GenericRepository(User);
  }

  async createBugReport(bugReportData: Partial<IBugReport>, userId: string): Promise<IBugReport> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error('Reporter user not found');
    }
    const newBugReport = await this.bugReportRepo.create({ ...bugReportData, createdBy: new mongoose.Types.ObjectId(userId), date: new Date(), status: BUG_REPORT_STATUS.PENDING });

    // notify admins about new bug report
    await NotificationService.sendNotification({
      role: [
        UserRole.ADMINISTRATION
      ],
      adminRole: [
        AdministrationRoleType.ADMIN
      ],
      type: "BUG_REPORT_SUBMITTED",
      title: "New Bug Report",
      message: `A new bug report titled "${bugReportData.title}" has been submitted and requires your attention.`,
      createdAt: new Date()
    } as Notification);

    return newBugReport;
  }

  async getAllBugReports(): Promise<IBugReport[]> {
    const bugReports = await this.bugReportRepo.findAll({}, {
      populate: {
        path: 'createdBy',
        select: 'email firstName lastName role gucId companyName ',
      } as any
    });
    return bugReports;
  }

  async updateBugReportStatus(bugReportId: string, status: BUG_REPORT_STATUS): Promise<void> {
    const updatedBugReport = await this.bugReportRepo.findById(bugReportId);
    if (!updatedBugReport) {
      throw new Error('Bug report not found');
    }
    if (status !== BUG_REPORT_STATUS.PENDING && status !== BUG_REPORT_STATUS.RESOLVED) {
      throw new Error('Invalid status value');
    }
    updatedBugReport.status = status;
    await updatedBugReport.save();

    if (status === BUG_REPORT_STATUS.RESOLVED) {
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

  async sendEmailToDevelopers(bugReport: IBugReport, email: string): Promise<void> {
    if (bugReport.status === BUG_REPORT_STATUS.RESOLVED) {
      throw createError(400, 'Bug report is already resolve');
    }
    const user = await this.userRepo.findById(bugReport.createdBy.toString());
    if (!user) {
      throw createError(404, 'Reporter user not found');
    }
    let reporterName: string = "Unknown";
    if (user.role === UserRole.ADMINISTRATION) {
      reporterName = (user as IAdministration).name
    }
    else {
      reporterName = `${(user as any).firstName} ${(user as any).lastName}`;
    }
    const bugReportData: BugReportData = {
      status: bugReport.status,
      submittedDate: bugReport.date,
      reportedBy: reporterName,
      title: bugReport.title,
      stepsToReproduce: bugReport.stepsToReproduce,
      expectedResult: bugReport.expectedBehavior,
      actualResult: bugReport.actualBehavior,
      environment: bugReport.environment,
      generationDate: new Date()

    }
    const buffer = await pdfGenerator.generateBugReportPDF(bugReportData);
    await sendBugReportEmail(email, bugReport.title, buffer);

  }

  async exportBugReportsToXLSX(): Promise<Buffer> {
    const BugReports = await this.bugReportRepo.findAll({}, {
      populate: {
        path: 'createdBy',
        select: 'email firstName lastName role gucId companyName ',
      } as any
    })


    if (BugReports.length === 0) {
      throw createError(404, "No bug reports found");
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(" Bug Reports");

    const applyHeaderStyle = (cell: ExcelJS.Cell) => {
      cell.font = { bold: true, size: 12, name: "Calibri" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9D9D9" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = { bottom: { style: "thin", color: { argb: "FF000000" } } };
    };

    worksheet.columns = [
      { header: "Title", key: "title", width: 30 },
      { header: "Reporter Name", key: "reporterName", width: 25 },
      { header: "Date Submitted", key: "date", width: 20 },
      { header: "Steps to Reproduce", key: "stepsToReproduce", width: 40 },
      { header: "Expected Behavior", key: "expectedBehavior", width: 40 },
      { header: "Actual Behavior", key: "actualBehavior", width: 40 },
      { header: "Environment", key: "environment", width: 25 },
      { header: "Status", key: "status", width: 15 },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => applyHeaderStyle(cell));

    BugReports.forEach((bugReport) => {
      const reporter = bugReport.createdBy as any;
      let reporterName = "Unknown";

      if (reporter) {
        if (reporter.role === UserRole.ADMINISTRATION) {
          reporterName = reporter.name || "Unknown";
        } else {
          reporterName = `${reporter.firstName || ""} ${reporter.lastName || ""}`.trim() || "Unknown";
        }
      }

      worksheet.addRow({
        title: bugReport.title,
        reporterName: reporterName,
        date: bugReport.date ? new Date(bugReport.date).toLocaleDateString() : "N/A",
        stepsToReproduce: bugReport.stepsToReproduce,
        expectedBehavior: bugReport.expectedBehavior,
        actualBehavior: bugReport.actualBehavior,
        environment: bugReport.environment,
        status: bugReport.status,
      });
    });

    // Auto-fit row heights for better readability
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.height = 20;
      }
    });

    return (await workbook.xlsx.writeBuffer()) as any;
  }

}