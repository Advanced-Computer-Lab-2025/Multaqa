import { Router, Request, Response } from "express";
import { UserService } from "../services/userService";
import createError from "http-errors";
import { GetAllUsersResponse, GetUserByIdResponse } from "../interfaces/responses/userResponses.interface";
import { AssignRoleResponse } from "../interfaces/responses/administrationResponses.interface";

const userService = new UserService();

async function getAllUsers(req: Request, res: Response<GetAllUsersResponse>) {
  try {
    const users = await userService.getAllUsers();
    if (!users || users.length === 0) {
      throw createError(404, "No users found");
    }
    res.json({
      success: true,
      data: users, 
      message: "Users retrieved successfully"
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
      message: "User retrieved successfully"
    });

  } catch (err: any) {
    throw createError(500, err.message);
  }
}

// Assign role to staffMember and send verification email
async function assignRole(req: Request, res: Response<AssignRoleResponse>) {
  try {
    const { userId } = req.params;
    const { position } = req.body;

    const result = await userService.assignRoleAndSendVerification(userId, position);

    res.json({
      success: true,
      message: "Role assigned and verification email sent successfully",
      user: result
    });
  } catch (error: any) {
    throw createError(error.status || 500, error.message || 'Failed to assign role and send verification email');
  }
}

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post('/:userId/assign-role', assignRole);

export default router;