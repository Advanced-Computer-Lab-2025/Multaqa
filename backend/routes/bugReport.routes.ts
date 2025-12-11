import { Router, Request, Response } from 'express';
import { BugReportService } from '../services/bugReportService';
import  { AuthenticatedRequest } from '../middleware/verifyJWT.middleware';
import { Auth } from 'googleapis';
import { IBugReportResponse, IUpdateBugReportStatusResponse } from '../interfaces/responses/bugReportResponses';
import createError from 'http-errors';

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

async function exportUnresolvedBugReports(req: Request, res: Response) {
    try {
        const buffer = await bugReportService.exportUnresolvedBugReportsToXLSX();
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


router.post('/', createBugReport);
router.get('/', getAllBugReports);
router.patch('/:bugReportId', updateBugReportStatus);
router.post('/send-email/:bugReportId', sendBugReportEmail);
router.get('/export', exportUnresolvedBugReports);
export default router;




