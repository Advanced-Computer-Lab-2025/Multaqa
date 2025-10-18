import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import { UserRole } from '../constants/user.constants';
import { AdministrationRoleType } from "../constants/administration.constants";
import { StaffPosition } from "../constants/staffMember.constants";

dotenv.config();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    adminRole?: AdministrationRoleType;
    staffPosition?: StaffPosition;
  };
}

export default function verifyJWT(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const header = req.headers["authorization"];
  if (!header) {
    throw createError(401, "You are unauthorized for accessing this route, missing authorization header");
  }

  const token = header && header.split(" ")[1];
  if (!token) {
    throw createError(401, "You are unauthorized for accessing this route, missing token");
  }

  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw createError(
      500,
      "Missing ACCESS_TOKEN_SECRET in environment variables"
    );
  }

  try {
    const decoded = jwt.verify(token, secret) as { id: string; role: UserRole };
    req.user = decoded;
    next();
  } catch (err) {
    console.log("expired token")
    throw createError(403, "Invalid or expired token");
  }
}
