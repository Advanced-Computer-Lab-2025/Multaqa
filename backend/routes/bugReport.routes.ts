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


router.post('/', createBugReport);
router.get('/', getAllBugReports);
router.patch('/:bugReportId/status', updateBugReportStatus);
export default router;




