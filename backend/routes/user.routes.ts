import { Router, Request, Response } from "express";
import { UserService } from "../services/userService";
import createError from "http-errors";
import { EventsService } from "../services/eventService";
import { validateEventRegistration } from "../validation/validateEventRegistration";
import { Schema } from "mongoose";
import {
  GetAllUsersResponse,
  GetUserByIdResponse,
  BlockUserResponse,
  RegisterUserResponse,
  AssignRoleResponse,
  UnblockUserResponse,
  GetAllUnAssignedStaffMembersResponse,
  GetAllProfessorsResponse,
  GetAllTAsResponse,
  GetAllStaffResponse
} from "../interfaces/responses/userResponses.interface";
import { AdministrationRoleType } from "../constants/administration.constants";
import { UserRole } from "../constants/user.constants";
import { authorizeRoles } from "../middleware/authorizeRoles.middleware";
import { StaffPosition } from "../constants/staffMember.constants";

const userService = new UserService();
const eventsService = new EventsService();

async function getAllUsers(req: Request, res: Response<GetAllUsersResponse>) {
  try {
    const users = await userService.getAllUsers();
    if (!users || users.length === 0) {
      throw createError(404, "No users found");
    }
    res.json({
      success: true,
      data: users,
      message: "Users retrieved successfully",
    });
  } catch (err: any) {
    if (err.status || err.statusCode) {
      throw err;
    }
    throw createError(500, err.message);
  }
}

async function getUserById(req: Request, res: Response<GetUserByIdResponse>) {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      throw createError(404, "User not found");
    }
    res.json({
      success: true,
      data: user,
      message: "User retrieved successfully",
    });
  } catch (err: any) {
    throw createError(500, err.message);
  }
}

// this will come back in sprint 2 guys (Stripe API)
async function registerForEvent(
  req: Request,
  res: Response<RegisterUserResponse>
) {
  const { eventId, id } = req.params;

  const validatedData = validateEventRegistration(req.body);
  if (validatedData.error) {
    throw createError(
      400,
      validatedData.error.details.map((d) => d.message).join(", ")
    );
  }

  const updatedEvent = await eventsService.registerUserForEvent(eventId, id);

  await userService.addEventToUser(
    id,
    updatedEvent._id as Schema.Types.ObjectId
  );

  res.json({
    success: true,
    message: "User registered for event successfully",
    data: updatedEvent,
  });
}

async function blockUser(req: Request, res: Response<BlockUserResponse>) {
  try {
    const userId = req.params.id;
    console.log('🔒 Blocking user:', userId);

    await userService.blockUser(userId);

    console.log('✅ User blocked successfully');

    res.json({
      success: true,
      message: "User blocked successfully",
    });
  } catch (err: any) {
    console.error('❌ Failed to block user:', err.message);
    throw createError(500, err.message);
  }
}

async function unBlockUser(req: Request, res: Response<UnblockUserResponse>) {
  try {
    const userId = req.params.id;
    console.log('🔓 Unblocking user:', userId);

    await userService.unBlockUser(userId);

    console.log('✅ User unblocked successfully');

    res.json({
      success: true,
      message: "User unblocked successfully",
    });
  } catch (err: any) {
    throw createError(500, err.message);
  }
}

async function getAllUnAssignedStaffMembers(req: Request, res: Response<GetAllUnAssignedStaffMembersResponse>) {
  try {
    const staffMembers = await userService.getAllUnAssignedStaffMembers();
    return res.json({
      success: true,
      data: staffMembers,
      message: "Unassigned staff members retrieved successfully"
    });
  }
  catch (err: any) {
    throw createError(500, err.message);
  }
}

async function getAllTAs(req: Request, res: Response<GetAllTAsResponse>) {
  try {
    const staffMembers = await userService.getAllTAs();
    return res.json({
      success: true,
      data: staffMembers,
      message: "Unassigned staff members retrieved successfully"
    });
  }
  catch (err: any) {
    throw createError(500, err.message);
  }
}

async function getAllProfessors(req: Request, res: Response<GetAllProfessorsResponse>) {
  try {
    const staffMembers = await userService.getAllProfessors();
    return res.json({
      success: true,
      data: staffMembers,
      message: "Unassigned staff members retrieved successfully"
    });
  }
  catch (err: any) {
    throw createError(500, err.message);
  }
}

async function getAllStaff(req: Request, res: Response<GetAllStaffResponse>) {
  try {
    const staffMembers = await userService.getAllStaff();
    return res.json({
      success: true,
      data: staffMembers,
      message: "Unassigned staff members retrieved successfully"
    });
  }
  catch (err: any) {
    throw createError(500, err.message);
  }
}


// Assign role to staffMember and send verification email
async function assignRole(req: Request, res: Response<AssignRoleResponse>) {
  try {
    const { userId } = req.params;
    const { position } = req.body;

    const result = await userService.assignRoleAndSendVerification(
      userId,
      position
    );

    res.json({
      success: true,
      message: "Role assigned and verification email sent successfully",
      user: result,
    });
  } catch (error: any) {
    throw createError(
      error.status || 500,
      error.message || "Failed to assign role and send verification email"
    );
  }
}

  async function getAllProfessors(req: Request, res: Response<GetAllUsersResponse>) {
    try {
      const professors = await userService.getAllProfessors();
      if (!professors || professors.length === 0) {
        throw createError(404, "No professors found");
      }
      res.json({
        success: true,
        data: professors,
        message: "Professors retrieved successfully",
      });
    } catch (err: any) {
      if (err.status || err.statusCode) {
        throw err;
      }
      throw createError(500, err.message);
    }
  }


const router = Router();
router.get("/unassigned-staff", authorizeRoles({ userRoles: [UserRole.ADMINISTRATION], adminRoles: [AdministrationRoleType.ADMIN] }), getAllUnAssignedStaffMembers);
router.get("/tas", authorizeRoles({ userRoles: [UserRole.ADMINISTRATION], adminRoles: [AdministrationRoleType.ADMIN] }), getAllTAs);
router.get("/professors", authorizeRoles({ userRoles: [UserRole.ADMINISTRATION], adminRoles: [AdministrationRoleType.ADMIN] }), getAllProfessors);
router.get("/staff", authorizeRoles({ userRoles: [UserRole.ADMINISTRATION], adminRoles: [AdministrationRoleType.ADMIN] }), getAllStaff);
router.get("/", authorizeRoles({ userRoles: [UserRole.ADMINISTRATION], adminRoles: [AdministrationRoleType.ADMIN] }), getAllUsers);
router.post("/:id/block", authorizeRoles({ userRoles: [UserRole.ADMINISTRATION], adminRoles: [AdministrationRoleType.ADMIN] }), blockUser);
router.post("/:id/unblock", authorizeRoles({ userRoles: [UserRole.ADMINISTRATION], adminRoles: [AdministrationRoleType.ADMIN] }), unBlockUser);
router.post("/:id/register/:eventId", authorizeRoles({ userRoles: [UserRole.STUDENT, UserRole.STAFF_MEMBER], staffPositions: [StaffPosition.PROFESSOR, StaffPosition.TA, StaffPosition.STAFF] }), registerForEvent);
router.post('/:userId/assign-role', authorizeRoles({ userRoles: [UserRole.ADMINISTRATION], adminRoles: [AdministrationRoleType.ADMIN] }), assignRole);
router.get("/:id", authorizeRoles({ userRoles: [UserRole.ADMINISTRATION], adminRoles: [AdministrationRoleType.ADMIN] }), getUserById);

export default router;
