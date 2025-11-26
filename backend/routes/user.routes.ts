import e, { Router, Request, Response } from "express";
import { UserService } from "../services/userService";
import createError from "http-errors";
import { EventsService } from "../services/eventService";
import { validateEventRegistration } from "../validation/validateEventRegistration";
import mongoose, { Schema } from "mongoose";
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
  GetAllStaffResponse,
  AddToFavoritesResponse,
  RemoveFromFavoritesResponse,
  GetFavoritesResponse,
  PayWithWalletResponse,
} from "../interfaces/responses/userResponses.interface";
import { AdministrationRoleType } from "../constants/administration.constants";
import { UserRole } from "../constants/user.constants";
import { authorizeRoles } from "../middleware/authorizeRoles.middleware";
import { StaffPosition } from "../constants/staffMember.constants";
import { AuthenticatedRequest } from "../middleware/verifyJWT.middleware";

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
    throw createError(
      err.status || 500,
      err.message || "Error retrieving users"
    );
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
    throw createError(
      err.status || 500,
      err.message || "Error retrieving user"
    );
  }
}

async function getUserNotifications(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError(401, "Unauthorized: missing user in token");
    }

    const notifications = await userService.getUserNotifications(userId);
    res.json({
      success: true,
      data: notifications,
      message: "Notifications retrieved successfully",
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error retrieving notifications"
    );
  }
}

// this will come back in sprint 2 guys (Stripe API)
async function registerForEvent(
  req: AuthenticatedRequest,
  res: Response<RegisterUserResponse>
) {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;
    if (!userId)
      throw createError(401, "Unauthorized: User ID missing in token");

    const validatedData = validateEventRegistration(req.body);
    if (validatedData.error) {
      throw createError(
        400,
        validatedData.error.details.map((d) => d.message).join(", ")
      );
    }

    const updatedEvent = await eventsService.registerUserForEvent(
      eventId,
      userId
    );

    // TODO: Remove this after testing
    await userService.addEventToUser(
      userId,
      // updatedEvent._id
      updatedEvent._id as mongoose.Types.ObjectId
    );

    res.json({
      success: true,
      message: "User registered for event successfully",
      data: updatedEvent,
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error registering for event"
    );
  }
}

// Add event to user's favorites
async function addToFavorites(
  req: AuthenticatedRequest,
  res: Response<AddToFavoritesResponse>
) {
  try {
    const eventId = req.params.eventId;

    // get user id from authenticated token
    const userId = req.user?.id;
    if (!userId) {
      throw createError(401, "Unauthorized: missing user in token");
    }

    if (!eventId) {
      throw createError(400, "Missing eventId in params");
    }

    const updatedUser = await userService.addToFavorites(userId, eventId);

    res.json({
      success: true,
      message: "Event added to favorites",
      data: updatedUser,
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error adding to favorites"
    );
  }
}

// Remove event from user's favorites
async function removeFromFavorites(
  req: AuthenticatedRequest,
  res: Response<RemoveFromFavoritesResponse>
) {
  try {
    const eventId = req.params.eventId;

    // get user id from authenticated token
    const userId = req.user?.id;
    if (!userId) {
      throw createError(401, "Unauthorized: missing user in token");
    }

    if (!eventId) {
      throw createError(400, "Missing eventId in params");
    }

    const updatedUser = await userService.removeFromFavorites(userId, eventId);

    res.json({
      success: true,
      message: "Event removed from favorites",
      data: updatedUser,
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error removing from favorites"
    );
  }
}

// Get all favorites for the authenticated user
async function getAllFavorites(
  req: AuthenticatedRequest,
  res: Response<GetFavoritesResponse>
) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError(401, "Unauthorized: missing user in token");
    }

    const userWithFavorites = await userService.getFavorites(userId);
    const favorites = (userWithFavorites as any).favorites || [];

    res.json({
      success: true,
      message: "Favorites retrieved successfully",
      data: favorites,
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error retrieving favorites"
    );
  }
}

async function blockUser(req: Request, res: Response<BlockUserResponse>) {
  try {
    const userId = req.params.id;
    console.log("🔒 Blocking user:", userId);

    await userService.blockUser(userId);

    console.log("✅ User blocked successfully");

    res.json({
      success: true,
      message: "User blocked successfully",
    });
  } catch (err: any) {
    console.error("❌ Failed to block user:", err.message);
    throw createError(err.status || 500, err.message || "Error blocking user");
  }
}

async function unBlockUser(req: Request, res: Response<UnblockUserResponse>) {
  try {
    const userId = req.params.id;
    console.log("🔓 Unblocking user:", userId);

    await userService.unBlockUser(userId);

    console.log("✅ User unblocked successfully");

    res.json({
      success: true,
      message: "User unblocked successfully",
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error unblocking user"
    );
  }
}

async function getAllUnAssignedStaffMembers(
  req: Request,
  res: Response<GetAllUnAssignedStaffMembersResponse>
) {
  try {
    const staffMembers = await userService.getAllUnAssignedStaffMembers();
    return res.json({
      success: true,
      data: staffMembers,
      message: "Unassigned staff members retrieved successfully",
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error retrieving unassigned staff members"
    );
  }
}

async function getAllTAs(req: Request, res: Response<GetAllTAsResponse>) {
  try {
    const staffMembers = await userService.getAllTAs();
    return res.json({
      success: true,
      data: staffMembers,
      message: "TAs retrieved successfully",
    });
  } catch (err: any) {
    throw createError(err.status || 500, err.message || "Error retrieving TAs");
  }
}

async function getAllStaff(req: Request, res: Response<GetAllStaffResponse>) {
  try {
    const staffMembers = await userService.getAllStaff();
    return res.json({
      success: true,
      data: staffMembers,
      message: "Staff retrieved successfully",
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error retrieving staff members"
    );
  }
}

// Assign role to staffMember and send verification email
async function assignRole(req: Request, res: Response<AssignRoleResponse>) {
  try {
    const { userId } = req.params;
    const { position } = req.body;

    const user = await userService.assignRoleAndSendVerification(
      userId,
      position
    );

    res.json({
      success: true,
      message: "Role assigned and verification email sent successfully",
      user: user,
    });
  } catch (error: any) {
    throw createError(
      error.status || 500,
      error.message || "Failed to assign role and send verification email"
    );
  }
}

async function getAllProfessors(
  req: Request,
  res: Response<GetAllProfessorsResponse>
) {
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
    throw createError(
      err.status || 500,
      err.message || "Error retrieving professors"
    );
  }
}

async function getUserTransactions(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError(401, "Unauthorized: missing user in token");
    }

    const user = await userService.getUserById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }

    // Format transactions for frontend (with event_name field)
    const transactions = ((user as any).transactions || []).map((t: any) => ({
      _id: t._id,
      event_name: t.eventName,
      amount: t.amount,
      wallet_amount: t.walletAmount || 0,
      card_amount: t.cardAmount || 0,
      type: t.type,
      date: t.date,
    }));

    res.json({
      success: true,
      data: {
        transactions,
        currentBalance: (user as any).walletBalance || 0,
      },
      message: "Transactions retrieved successfully",
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error retrieving transactions"
    );
  }
}

const router = Router();

router.get(
  "/",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION],
    adminRoles: [AdministrationRoleType.ADMIN],
  }),
  getAllUsers
);

router.get(
  "/notifications",
  authorizeRoles({
    userRoles: [
      UserRole.ADMINISTRATION,
      UserRole.STAFF_MEMBER,
      UserRole.STUDENT,
      UserRole.VENDOR,
    ],
    adminRoles: [AdministrationRoleType.ADMIN, AdministrationRoleType.EVENTS_OFFICE],
    staffPositions: [
      StaffPosition.PROFESSOR,
      StaffPosition.TA,
      StaffPosition.STAFF,
    ],
  }),
  getUserNotifications
);

router.get(
  "/favorites",
  authorizeRoles({
    userRoles: [UserRole.STUDENT, UserRole.STAFF_MEMBER],
    staffPositions: [
      StaffPosition.PROFESSOR,
      StaffPosition.TA,
      StaffPosition.STAFF,
    ],
  }),
  getAllFavorites
);

router.get(
  "/transactions",
  authorizeRoles({
    userRoles: [UserRole.STUDENT, UserRole.STAFF_MEMBER],
    staffPositions: [
      StaffPosition.PROFESSOR,
      StaffPosition.TA,
      StaffPosition.STAFF,
    ],
  }),
  getUserTransactions
);

router.get(
  "/unassigned-staff",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION],
    adminRoles: [AdministrationRoleType.ADMIN],
  }),
  getAllUnAssignedStaffMembers
);
router.get(
  "/tas",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION],
    adminRoles: [AdministrationRoleType.ADMIN],
  }),
  getAllTAs
);
router.get(
  "/professors",
  authorizeRoles({
    userRoles: [
      UserRole.ADMINISTRATION,
      UserRole.STAFF_MEMBER,
      UserRole.STUDENT,
      UserRole.VENDOR,
    ],
    adminRoles: [AdministrationRoleType.ADMIN],
    staffPositions: [
      StaffPosition.PROFESSOR,
      StaffPosition.TA,
      StaffPosition.STAFF,
    ],
  }),
  getAllProfessors
);
router.get(
  "/staff",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION],
    adminRoles: [AdministrationRoleType.ADMIN],
  }),
  getAllStaff
);
router.post(
  "/register/:eventId",
  authorizeRoles({
    userRoles: [UserRole.STUDENT, UserRole.STAFF_MEMBER],
    staffPositions: [
      StaffPosition.PROFESSOR,
      StaffPosition.TA,
      StaffPosition.STAFF,
    ],
  }),
  registerForEvent
);

router.post(
  "/favorites/:eventId",
  authorizeRoles({
    userRoles: [UserRole.STUDENT, UserRole.STAFF_MEMBER],
    staffPositions: [
      StaffPosition.PROFESSOR,
      StaffPosition.TA,
      StaffPosition.STAFF,
    ],
  }),
  addToFavorites
);

router.post(
  "/:userId/assign-role",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION],
    adminRoles: [AdministrationRoleType.ADMIN],
  }),
  assignRole
);

router.delete(
  "/favorites/:eventId",
  authorizeRoles({
    userRoles: [UserRole.STUDENT, UserRole.STAFF_MEMBER],
    staffPositions: [
      StaffPosition.PROFESSOR,
      StaffPosition.TA,
      StaffPosition.STAFF,
    ],
  }),
  removeFromFavorites
);
router.get(
  "/:id",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION],
    adminRoles: [AdministrationRoleType.ADMIN],
  }),
  getUserById
);

router.post(
  "/favorites/:eventId",
  authorizeRoles({
    userRoles: [UserRole.STUDENT, UserRole.STAFF_MEMBER],
    staffPositions: [
      StaffPosition.PROFESSOR,
      StaffPosition.TA,
      StaffPosition.STAFF,
    ],
  }),
  addToFavorites
);

router.delete(
  "/favorites/:eventId",
  authorizeRoles({
    userRoles: [UserRole.STUDENT, UserRole.STAFF_MEMBER],
    staffPositions: [
      StaffPosition.PROFESSOR,
      StaffPosition.TA,
      StaffPosition.STAFF,
    ],
  }),
  removeFromFavorites
);
router.post(
  "/:id/block",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION],
    adminRoles: [AdministrationRoleType.ADMIN],
  }),
  blockUser
);
router.post(
  "/:id/unblock",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION],
    adminRoles: [AdministrationRoleType.ADMIN],
  }),
  unBlockUser
);
export default router;
