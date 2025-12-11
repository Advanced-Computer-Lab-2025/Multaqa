import { Router,Request,Response } from 'express';
import { UsheringService } from '../services/usheringService';
import { UsheringResponse } from '../interfaces/responses/usheringResponse';
import createError from 'http-errors';

const usheringService = new UsheringService();

const router = Router();

async function createUsheringTeams(req: Request, res: Response<UsheringResponse>) {
    try {
        const usheringData = req.body;
        const newUshering = await usheringService.createUshering(usheringData);
        res.json({
            success: true,
            data: newUshering,
            message: 'Ushering teams created successfully'
        });
       
    } catch (error: any) {
         throw createError(
              error.status || 500,
              error.message || "Error creating ushering teams"
            );
    }
}

async function setUsheringPostTime(req: Request, res: Response<UsheringResponse>) {
    try {
        const { id } = req.params;  
        const { postTime } = req.body;
        const updatedUshering = await usheringService.setPostTime(new Date(postTime),id);
        res.json({
            success: true,
            data: updatedUshering,
            message: 'Ushering post time set successfully'
        });
    } catch (error: any) {
         throw createError(
              error.status || 500,
                error.message || "Error setting ushering post time"
            );
    }
}

async function editUsheringTeam(req: Request, res: Response<UsheringResponse>) {
    try {
        const { usheringId, teamId } = req.params;
        const teamData = req.body;
        const updatedUshering = await usheringService.editTeam(usheringId, teamId, teamData);
        res.json({
            success: true,
            data: updatedUshering,
            message: 'Ushering team edited successfully'
        });
    } catch (error: any) {
         throw createError(
              error.status || 500,
                error.message || "Error editing ushering team"
            );
    }
}



async function deleteUsheringTeam(req: Request, res: Response<UsheringResponse>) {
    try {
        const { usheringId, teamId } = req.params;  
        const updatedUshering = await usheringService.deleteTeam(usheringId, teamId);
        res.json({
            success: true,
            data: updatedUshering,
            message: 'Ushering team deleted successfully'
        });
    } catch (error: any) {
         throw createError(
              error.status || 500,
                error.message || "Error deleting ushering team"
            );
    }
}

async function getAllUsheringTeams(req: Request, res: Response<UsheringResponse>) {
    try {
        const usheringEvents = await usheringService.getAllTeams();
        res.json({
            success: true,
            data: usheringEvents,
            message: 'Ushering teams retrieved successfully'
        });
    } catch (error: any) {
         throw createError(
              error.status || 500,
                error.message || "Error retrieving ushering teams"
            );
    }
}




router.post('/', createUsheringTeams);
router.get('/', getAllUsheringTeams);
router.patch('/:id/postTime', setUsheringPostTime);
router.patch('/:usheringId/teams/:teamId', editUsheringTeam);
router.delete('/:usheringId/teams/:teamId', deleteUsheringTeam);

export default router;