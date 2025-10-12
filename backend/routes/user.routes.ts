import { Router, Request, Response } from "express";
import { UserService } from "../services/userService";
import createError from "http-errors";
import { GetAllUsersResponse, GetUserByIdResponse, BlockUserResponse } from "../interfaces/responses/userResponses.interface";
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

async function blockUser(req: Request, res: Response<BlockUserResponse>) {
  try {
    const userId = req.params.id;
    await userService.blockUser(userId);
    res.json({
      success: true,
      message: "User blocked successfully"
    });
  } catch (err: any) {
    throw createError(500, err.message);
  }
}

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/:id/block", blockUser);

export default router;