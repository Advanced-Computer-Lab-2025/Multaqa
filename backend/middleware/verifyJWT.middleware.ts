import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

dotenv.config();

export interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export default function verifyJWT(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const header = req.headers["authorization"];
  if(!header) {
    throw createError(401, 'You are unauthorized for accessing this route') 
  }

  const token = header && header.split(" ")[1];
  if (!token) {
    throw createError(401, 'You are unauthorized for accessing this route') 
  }

  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw createError(500, "Missing ACCESS_TOKEN_SECRET in environment variables");
  }

  jwt.verify(token, secret, (err, user) => {
    if (err){
      throw createError(403, 'Token is not valid or has expired')
    }
    
    req.user = user;
    next();
  });
}
