import { Schema } from "mongoose";
import { IUser } from "../../interfaces/models/user.interface";
import { User } from "./userSchema";


const usheringAccountSchema = new Schema<IUser>({});

export const UsheringAccount = User.discriminator<IUser>("usheringAccount", usheringAccountSchema);


 