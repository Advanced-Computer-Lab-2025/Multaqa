import { Request, Response, NextFunction } from "express";

export function dummyAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Dummy middleware
  next();
}
