import { User } from "../schemas/stakeholder-schemas/userSchema";
import { UserRole } from "../constants/user.constants";

export class UserRepository {
  async findAllWithSpecificFields() {
    const users = await User.aggregate([
      {
        $project: {
          email: 1,
          role: 1,
          status: 1,

          name: {
            $cond: [{ $eq: ["$role", UserRole.ADMINISTRATION] }, "$name", "$$REMOVE"]
          },
          roleType: {
            $cond: [{ $eq: ["$role", UserRole.ADMINISTRATION] }, "$roleType", "$$REMOVE"]
          },

          firstName: {
             $cond: [
              { $in: ["$role", [UserRole.STUDENT, UserRole.STAFF_MEMBER]] },
              "$firstName",
              "$$REMOVE"
            ]
          },
        lastName: {
             $cond: [
              { $in: ["$role", [UserRole.STUDENT, UserRole.STAFF_MEMBER]] },  
             "$lastName", 
             "$$REMOVE"
         ]
        },
        gucId: {
            $cond: [
             { $in: ["$role", [UserRole.STUDENT, UserRole.STAFF_MEMBER]] },  
            "$gucId", 
            "$$REMOVE"
        ]
        },
         position: {
            $cond: [{ $eq: ["$role", UserRole.STAFF_MEMBER] }, "$position", "$$REMOVE"]
          },
        }
      }
    ]);

    return users;
  }
}