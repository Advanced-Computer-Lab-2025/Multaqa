import { Router, Request, Response } from 'express';
import { BugReportService } from '../services/bugReportService';
import  { AuthenticatedRequest } from '../middleware/verifyJWT.middleware';
import { Auth } from 'googleapis';
import { IBugReportResponse, IUpdateBugReportStatusResponse } from '../interfaces/responses/bugReportResponses';
import createError from 'http-errors';
import { AdministrationRoleType } from '../constants/administration.constants';
import { UserRole } from '../constants/user.constants';
import { authorizeRoles } from '../middleware/authorizeRoles.middleware';
import { StaffPosition } from '../constants/staffMember.constants';

 const router = Router();
const bugReportService = new BugReportService();

async function createBugReport(req:AuthenticatedRequest, res: Response<IBugReportResponse>) {
    try {
        const userId =  req.user?.id;
        if (!userId) {
              throw createError(401, "Unauthorized: missing user in token");
            }
        const bugReportData = req.body;
        const newBugReport = await bugReportService.createBugReport(bugReportData, userId);
        res.json({
            success: true,
            data: newBugReport,
            message: 'Bug report created successfully'
        });
    } catch (err:any) {
        throw createError(
              err.status || 500,
              err.message || "Error retrieving notifications"
            );
        
    }
}

async function getAllBugReports(req:Request, res: Response<IBugReportResponse>) {
    try {
        const bugReports = await bugReportService.getAllBugReports();
        res.json({
            success: true,
            data: bugReports,
            message: 'Bug reports retrieved successfully'
        });
    } catch (err:any) {
        throw createError(
              err.status || 500,
                err.message || "Error retrieving bug reports"
            );
    }
}

async function updateBugReportStatus(req:Request, res: Response<IUpdateBugReportStatusResponse>) {
    try {
        const { bugReportId } = req.params;
        const { status } = req.body;
        await bugReportService.updateBugReportStatus(bugReportId, status);
        res.json({
            success: true,
            message: 'Bug report status updated successfully'
        });
    } catch (err:any) {
        throw createError(
              err.status || 500,
                err.message || "Error updating bug report status"
            );
    }
}

async function sendBugReportEmail(req:Request, res: Response) {
    try {
        const {bugReportId} = req.params;
        const { recipientEmail } = req.body;
        const bugReport = await bugReportService.getBugReportById(bugReportId);
        if (!bugReport) {
            throw createError(404, 'Bug report not found');
        }
        await bugReportService.sendEmailToDevelopers(bugReport, recipientEmail);
        res.json({
            success: true,
            message: 'Bug report email sent successfully'
        });
    } catch (err:any) {
        throw createError(
              err.status || 500,
                err.message || "Error sending bug report email"
            );
    }
}

async function exportBugReports(req: Request, res: Response) {
    try {
        const buffer = await bugReportService.exportBugReportsToXLSX();
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
         const date = new Date();
        const dateStr = date.toISOString().split('T')[0]; 
        const filename = `unresolved-bug-reports-${dateStr}.xlsx`;
        res.setHeader(
            'Content-Disposition',
             `attachment; filename="${filename}"`
        );
        res.send(buffer);
    } catch (err: any) {
        throw createError(
            err.status || 500,
            err.message || "Error exporting bug reports"
        );
    }
}


router.post('/', authorizeRoles({
       userRoles: [
          UserRole.ADMINISTRATION,
          UserRole.STAFF_MEMBER,
          UserRole.STUDENT,
        ],
        adminRoles: [
          AdministrationRoleType.EVENTS_OFFICE,
        ],
        staffPositions: [
          StaffPosition.PROFESSOR,
          StaffPosition.STAFF,
          StaffPosition.TA,
        ],
      }),
  createBugReport);
router.get('/' ,authorizeRoles({ 
        userRoles: [
          UserRole.ADMINISTRATION,
        ],
        adminRoles: [
          AdministrationRoleType.ADMIN
        ],
      }),
     getAllBugReports);
router.patch('/:bugReportId',authorizeRoles({ 
        userRoles: [
          UserRole.ADMINISTRATION,
        ],
        adminRoles: [
          AdministrationRoleType.ADMIN
        ],
      }), updateBugReportStatus);
router.post('/send-email/:bugReportId',authorizeRoles({ 
        userRoles: [
          UserRole.ADMINISTRATION,
        ],
        adminRoles: [
          AdministrationRoleType.ADMIN
        ],
      }), sendBugReportEmail);
router.get('/export' ,authorizeRoles({ 
        userRoles: [
          UserRole.ADMINISTRATION,
        ],
        adminRoles: [
          AdministrationRoleType.ADMIN
        ],
      }),exportBugReports);
export default router;




