import { AdministrationRoleType } from "../../constants/administration.constants";
import { StaffPosition } from "../../constants/staffMember.constants";
import { UserRole } from "../../constants/user.constants";
import { Document, Types } from "mongoose";

export interface INotification extends Document {
  userId?: string;
  role?: UserRole[];
  adminRole?: AdministrationRoleType[];
  staffPosition?: StaffPosition[];
  type: string;
  title: string;
  message: string;
  read: boolean;
  delivered: boolean;
  createdAt: Date;
}