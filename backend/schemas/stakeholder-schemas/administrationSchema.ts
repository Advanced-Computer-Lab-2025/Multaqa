import { Schema } from "mongoose";
import { User } from "./userSchema";
import { IAdministration } from "../../interfaces/models/administration.interface";
import { AdministrationRoleType } from "../../constants/administration.constants";

const administrationSchema = new Schema<IAdministration>({
  name: { type: String, required: true },
  roleType: { type: String, enum: Object.values(AdministrationRoleType), required: true }
});

export const Administration = User.discriminator<IAdministration>(
  "administration",
  administrationSchema
);
