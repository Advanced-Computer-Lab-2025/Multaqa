import { User } from "../schemas/stakeholder-schemas/userSchema";
import { UserRole } from "../constants/user.constants";

export class UserRepository {

async findUsers() {
    return await User.find({ isVerified: true })
      .select('firstName lastName name email role gucId position roleType status companyName')
      .lean()
      .exec();
  }
}