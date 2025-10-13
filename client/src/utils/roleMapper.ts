/**
 * Maps an entity string to its corresponding user role
 * @param entity - The entity string from the URL (e.g., 'admin', 'student', 'events-office')
 * @returns The corresponding role for the entity
 */
export const mapEntityToRole = (
  entity: string
):
  | "student"
  | "staff"
  | "ta"
  | "professor"
  | "events-office"
  | "admin"
  | "vendor" => {
  switch (entity) {
    case "admin":
      return "admin";
    case "events-office":
      return "events-office";
    case "vendor":
      return "vendor";
    case "professor":
      return "professor";
    case "ta":
      return "ta";
    case "staff":
      return "staff";
    case "student":
    default:
      return "student";
  }
};

/**
 * Type definition for user roles
 */
export type UserRole =
  | "student"
  | "staff"
  | "ta"
  | "professor"
  | "events-office"
  | "admin"
  | "vendor";

