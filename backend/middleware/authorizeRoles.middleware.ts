import { Response, NextFunction } from "express";
import createError from "http-errors";
import { UserRole } from "../constants/user.constants";
import { AdministrationRoleType } from "../constants/administration.constants";
import { StaffPosition } from "../constants/staffMember.constants";
import { AuthenticatedRequest } from "./verifyJWT.middleware";


export function authorizeRoles(options: {
  userRoles?: UserRole[];
  adminRoles?: AdministrationRoleType[];
  staffPositions?: StaffPosition[];
}) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      throw createError(401, "Not authenticated");
    }

    const { userRoles = [], adminRoles = [], staffPositions = [] } = options;

    // Case 1: Top-level UserRole matches
    if (userRoles.includes(user.role)) return next();

    // Case 2: Administration role matches (only if user is administration)
    if (user.role === UserRole.ADMINISTRATION && user.adminRole && adminRoles.includes(user.adminRole)) {
      return next();
    }

    // Case 3: Staff role matches 
    if (user.role === UserRole.STAFF_MEMBER && user.staffPosition && staffPositions.includes(user.staffPosition)) {
      return next();
    }

    throw createError(403, "Access denied: insufficient role or permissions");
  };
}
