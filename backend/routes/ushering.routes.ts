import { Router,Request,Response } from 'express';
import { UsheringService } from '../services/usheringService';
import { UsheringResponse, UsheringSlotResponse, UsheringTeamsResponse } from '../interfaces/responses/usheringResponse';
import createError from 'http-errors';
import { authorizeRoles } from '../middleware/authorizeRoles.middleware';
import { UserRole } from '../constants/user.constants';
import { AuthenticatedRequest } from '../middleware/verifyJWT.middleware';

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

async function addTeamReservationSlots(req: Request, res: Response<UsheringTeamsResponse>) {
    try {
        const { usheringId, teamId } = req.params;
        const slots = req.body.slots;
        await usheringService.addTeamReservationSlots(usheringId, teamId, slots);
        res.json({
            success: true,
            message: 'Reservation slots added successfully'
        });
    } catch (error: any) {
         throw createError(
              error.status || 500,
                error.message || "Error adding reservation slots"
            );
    }
}  

async function deleteSlot(req: Request, res: Response<UsheringTeamsResponse>) {
    try {
        const { usheringId, teamId, slotId } = req.params;
        await usheringService.deleteSlot(usheringId, teamId, slotId);
        res.json({
            success: true,
            message: 'Reservation slot deleted successfully'
        });
    } catch (error: any) {
         throw createError(
              error.status || 500,
                error.message || "Error deleting reservation slot"
            );
    }
}

async function bookSlot(req: AuthenticatedRequest, res: Response<UsheringTeamsResponse>) {
    try {
        const { usheringId, teamId, slotId } = req.params;  
        const studentId = req.user?.id;
        if (!studentId) {
            throw createError(401, 'Unauthorized: Student ID not found');
        }
        await usheringService.bookSlot(usheringId, teamId, slotId, studentId);
        res.json({
            success: true,
            message: 'Reservation slot booked successfully'
        });
    } catch (error: any) {
         throw createError(
              error.status || 500,
                error.message || "Error booking reservation slot"
            );
    }
}

async function cancelBooking(req: AuthenticatedRequest, res: Response<UsheringTeamsResponse>) {
    try {
        const { usheringId, teamId, slotId } = req.params;
        const studentId = req.user?.id;
        if (!studentId) {
            throw createError(401, 'Unauthorized: Student ID not found');
        }
        await usheringService.cancelBooking(usheringId, teamId, slotId, studentId);
        res.json({
            success: true,
            message: 'Reservation slot booking cancelled successfully'
        });
    } catch (error: any) {
         throw createError(
              error.status || 500,
                error.message || "Error cancelling reservation slot booking"
            );
    }
}

async function viewTeamInterviewSlots(req: Request, res: Response<UsheringSlotResponse>) {
    try {
        const { usheringId, teamId } = req.params;
        const slots = await usheringService.viewTeamInterviewSlots(usheringId, teamId);
        res.json({
            success: true,
            data: slots,
            message: 'Team interview slots retrieved successfully'
        });
    } catch (error: any) {
         throw createError(
              error.status || 500,  
                error.message || "Error retrieving team interview slots"
            );
    }
}


router.post('/', authorizeRoles({
    userRoles: [UserRole.USHER_ADMIN], 
  }), createUsheringTeams);
router.get('/', authorizeRoles({
    userRoles: [UserRole.USHER_ADMIN, UserRole.STUDENT], 
  }), getAllUsheringTeams);
router.patch('/:id/postTime', authorizeRoles({
    userRoles: [UserRole.USHER_ADMIN], 
  }), setUsheringPostTime);
router.patch('/:usheringId/teams/:teamId', authorizeRoles({
    userRoles: [UserRole.USHER_ADMIN], 
  }), editUsheringTeam);
router.delete('/:usheringId/teams/:teamId', authorizeRoles({
    userRoles: [UserRole.USHER_ADMIN], 
  }), deleteUsheringTeam);
router.post('/:usheringId/teams/:teamId/slots', authorizeRoles({
    userRoles: [UserRole.USHER_ADMIN], 
  }), addTeamReservationSlots);
  router.get('/:usheringId/teams/:teamId/slots', authorizeRoles({
    userRoles: [UserRole.USHER_ADMIN, UserRole.STUDENT], 
  }), viewTeamInterviewSlots);
router.delete('/:usheringId/teams/:teamId/slots/:slotId', authorizeRoles({
    userRoles: [UserRole.USHER_ADMIN], 
  }), deleteSlot);
router.post('/:usheringId/teams/:teamId/slots/:slotId/book', authorizeRoles({
    userRoles: [UserRole.STUDENT], 
  }), bookSlot);
router.post('/:usheringId/teams/:teamId/slots/:slotId/cancel', authorizeRoles({
    userRoles: [UserRole.STUDENT], 
  }), cancelBooking);

export default router;