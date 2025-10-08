import { IStudent } from "../interfaces/student.interface";
import { IUser } from "../interfaces/user.interface";
import GenericRepository from "../repos/genericRepo";
import { UserRepository } from "../repos/userRepo";
import { User } from "../schemas/stakeholder-schemas/userSchema";


export class UserService {
  private userRepo: GenericRepository<IUser>;
  private userRepository: UserRepository;
  constructor() {
    this.userRepo = new GenericRepository(User);
    this.userRepository = new UserRepository();
  }
   async getAllUsers(): Promise<Partial<IUser>[]> {
    return this.userRepository.findUsers();
  }

    async getUserById(id: string): Promise<IUser | null> {
    return await this.userRepo.findById(id);
  }
}