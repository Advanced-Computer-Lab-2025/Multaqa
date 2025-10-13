import { Response, NextFunction } from "express";
import createError from "http-errors";
import { UserRole } from "../constants/user.constants";
import { AuthenticatedRequest } from "./verifyJWT.middleware";

export function applyRoleBasedFilters(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV === "development") return next();
  const user = req.user;

  if (user?.role === UserRole.VENDOR) {
    const typeQuery = req.query.type;

    // vendors are only allowed to query "bazaar"
    if (typeQuery && typeQuery !== "bazaar") {
      throw createError(403, "Vendors can only access bazaar events");
    }

    // if no type is provided, force it to "bazaar"
    req.query.type = "bazaar";
  }

  next();
}
