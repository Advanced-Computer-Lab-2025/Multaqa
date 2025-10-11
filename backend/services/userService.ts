import { IStudent } from "../interfaces/student.interface";
import { IUser } from "../interfaces/user.interface";
import GenericRepository from "../repos/genericRepo";
import { User } from "../schemas/stakeholder-schemas/userSchema";

export class UserService {
  private userRepo: GenericRepository<IUser>;
  constructor() {
    this.userRepo = new GenericRepository(User);
  }
  async getAllUsers(): Promise<Partial<IUser>[]> {
    return this.userRepo.findAll(
      { isVerified: true },
      {
        select:
          "firstName lastName name email role gucId position roleType status companyName",
      }
    );
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await this.userRepo.findById(id);
  }
}
