import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

export interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];

  if (!token) {
    res.sendStatus(401); // Unauthorized
    return;  
  }

  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    console.error("Missing ACCESS_TOKEN_SECRET in environment variables");
    res.sendStatus(500);
    return;
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      res.sendStatus(403); // Forbidden
      return;
    }

    req.user = user;
    next();
  });
}
