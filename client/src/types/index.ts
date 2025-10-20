// Shared type for user roles across the application
export type UserRoleKey = 
  | "student"
  | "staff"
  | "ta"
  | "professor"
  | "events-office"
  | "admin"
  | "vendor"
  | "company";

export type UserType = "university-member" | "vendor";

export interface RegistrationFormProps {
  UserType: UserType;
}