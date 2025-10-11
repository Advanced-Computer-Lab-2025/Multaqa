import { Router, Request, Response } from "express";
import { UserService } from "../services/userService";
import createError from "http-errors";

const userService = new UserService();

async function getAllUsers(req: Request, res: Response) {
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

async function getUserById(req: Request, res: Response) {
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

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);

export default router;