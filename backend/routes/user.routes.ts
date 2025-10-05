import { Router, Request, Response } from "express";
import { IStudent } from "../interfaces/student.interface";
import { IUser } from "../interfaces/user.interface";
import GenericRepository from "../repos/genericRepo";
import { User } from "../schemas/stakeholder-schemas/userSchema";
import { UserService } from "../services/userService";
import { get } from "http";

const userService=new UserService();

async function getAllUsers(req: Request, res: Response) {
  const users = await userService.getAllUsers();
  res.json(users);
}

async function getUserById(req: Request, res: Response) {
  const user = await userService.getUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
}

const router=Router();

router.get("/user/all",getAllUsers);
router.get("/user/:id",getUserById);

export default router;