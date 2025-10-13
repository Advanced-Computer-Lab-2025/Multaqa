import { mapEntityToRole } from "@/utils";
import { useParams } from "next/navigation";

/**
 * Custom hook to get the current user's role from the URL
 * @returns Object containing the role and helper booleans for each role type
 */
export const useUserRole = () => {
  const params = useParams() as { entity?: string };
  const entity = params.entity ?? "";
  const role = mapEntityToRole(entity);

  return {
    role,
    isStudent: role === "student",
    isStaff: role === "staff",
    isTA: role === "ta",
    isProfessor: role === "professor",
    isEventsOffice: role === "events-office",
    isAdmin: role === "admin",
    isVendor: role === "vendor",
  };
};

