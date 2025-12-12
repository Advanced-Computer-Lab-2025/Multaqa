import { Router, Request, Response } from "express";
import { WaitlistService } from "../services/waitlistService";
import { authorizeRoles } from "../middleware/authorizeRoles.middleware";
import { UserRole } from "../constants/user.constants";
import { StaffPosition } from "../constants/staffMember.constants";
import { AuthenticatedRequest } from "../middleware/verifyJWT.middleware";
import createError from "http-errors";

const router = Router();
const waitlistService = new WaitlistService();

async function joinWaitlist(req: AuthenticatedRequest, res: Response) {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw createError(401, "User not authenticated");
    }

    await waitlistService.joinWaitlist(eventId, userId);

    res.json({
      success: true,
      message: "Successfully joined the waitlist",
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error joining waitlist"
    );
  }
}

async function leaveWaitlist(req: AuthenticatedRequest, res: Response) {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw createError(401, "User not authenticated");
    }

    await waitlistService.leaveWaitlist(eventId, userId);

    res.json({
      success: true,
      message: "Successfully left the waitlist",
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error leaving waitlist"
    );
  }
}

async function getWaitlistStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw createError(401, "User not authenticated");
    }

    const status = await waitlistService.getWaitlistStatus(eventId, userId);

    res.json({
      success: true,
      data: status,
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error retrieving waitlist status"
    );
  }
}

/**
 * @route   POST /api/waitlist/:eventId
 * @desc    Join event waitlist
 * @access  Student, Staff (Professor, TA, Staff)
 */
router.post(
  "/:eventId",
  authorizeRoles({
    userRoles: [UserRole.STUDENT, UserRole.STAFF_MEMBER],
    staffPositions: [
      StaffPosition.PROFESSOR,
      StaffPosition.TA,
      StaffPosition.STAFF,
    ],
  }),
  joinWaitlist
);

/**
 * @route   DELETE /api/waitlist/:eventId
 * @desc    Leave event waitlist
 * @access  Student, Staff (Professor, TA, Staff)
 */
router.delete(
  "/:eventId",
  authorizeRoles({
    userRoles: [UserRole.STUDENT, UserRole.STAFF_MEMBER],
    staffPositions: [
      StaffPosition.PROFESSOR,
      StaffPosition.TA,
      StaffPosition.STAFF,
    ],
  }),
  leaveWaitlist
);

/**
 * @route   GET /api/waitlist/:eventId/status
 * @desc    Get waitlist status for user
 * @access  Student, Staff (Professor, TA, Staff)
 */
router.get(
  "/:eventId",
  authorizeRoles({
    userRoles: [UserRole.STUDENT, UserRole.STAFF_MEMBER],
    staffPositions: [
      StaffPosition.PROFESSOR,
      StaffPosition.TA,
      StaffPosition.STAFF,
    ],
  }),
  getWaitlistStatus
);

export default router;
