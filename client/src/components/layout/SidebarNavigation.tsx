import React from "react";
import { LogOut } from "lucide-react";
import Image from "next/image";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import { UserRoleKey } from "@/types";

interface SectionItem {
  id: string;
  label: string;
}

interface CurrentUser {
  name?: string;
  profileImage?: string;
  firstName?: string;
  lastName?: string;
}

interface SidebarNavigationProps {
  activeItem?: string;
  onItemClick?: (id: string) => void;
  sectionItems?: SectionItem[];
  onLogout?: () => void;
  currentUser?: CurrentUser;
  userRole?: UserRoleKey;
}

// Generic roles that use initials (name-based)
const GENERIC_ROLES = ["events-office", "admin", "vendor", "company"];

// Generate initials from name or role
const getInitials = (user?: CurrentUser, role?: string): string => {
  if (!user) return "?";

  // Always try to use first and last name if available
  if (user.firstName && user.lastName) {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(
      0
    )}`.toUpperCase();
  }

  // Fallback to full name if available
  if (user.name) {
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(
        0
      )}`.toUpperCase();
    }
    return user.name.charAt(0).toUpperCase();
  }

  // If no name available, use role-based initials
  const roleInitials: Record<string, string> = {
    student: "S",
    staff: "ST",
    ta: "TA",
    professor: "P",
    "events-office": "EO",
    admin: "A",
    vendor: "V",
    company: "C",
  };
  return roleInitials[role || ""] || "?";
};

// Get display name based on role
const getDisplayName = (user?: CurrentUser, role?: string): string => {
  if (!user) return "";

  // For generic roles (events-office, admin, vendor, company), use full name
  if (GENERIC_ROLES.includes(role || "")) {
    return user.name || "User";
  }

  // For personal roles (student, staff, ta, professor), try firstName or fall back to name
  return user.firstName || user.name || "User";
};

// Get role label
const getRoleLabel = (role?: string): string => {
  const roleLabels: Record<string, string> = {
    student: "Student",
    staff: "Staff",
    ta: "Teaching Assistant",
    professor: "Professor",
    "events-office": "Events Office",
    admin: "Administrator",
    vendor: "Vendor",
    company: "Company",
  };
  return roleLabels[role || ""] || "User";
};

export default function SidebarNavigation({
  activeItem = "",
  onItemClick,
  sectionItems = [],
  onLogout,
  currentUser,
  userRole = "student",
}: SidebarNavigationProps) {
  const displayName = getDisplayName(currentUser, userRole);
  const initials = getInitials(currentUser, userRole);
  const roleLabel = getRoleLabel(userRole);

  return (
    <div className="w-[240px] bg-[#f9fbfc] h-full flex flex-col p-4 overflow-y-auto min-h-full">
      {sectionItems.length > 0 && (
        <div className="mb-4 flex-1">
          <p className="text-xs font-semibold text-[#6299d0] tracking-wider mb-3 px-2 font-heading">
            SECTIONS
          </p>

          <nav className="space-y-1">
            {sectionItems.map((item) => {
              const isActive = activeItem === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onItemClick?.(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-all font-sans text-sm ${
                    isActive
                      ? "bg-[#598bbd] text-white font-semibold shadow-md"
                      : "text-[#1E1E1E] hover:bg-[#b2cee2] hover:shadow-sm hover:scale-[1.02]"
                  }`}
                  style={{
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* When no sections, wrap profile and logout in flex-end container */}
      {sectionItems.length === 0 ? (
        <div className="flex flex-col justify-end flex-1">
          {/* User Profile Section */}
          {currentUser && (
            <div className="mb-4">
              <div
                className="w-full px-4 py-2 rounded-xl border-2"
                style={{
                  backgroundColor: "#f9fbfc",
                  borderColor: "#6299d0",
                  boxShadow: "0 2px 6px rgba(98, 153, 208, 0.15)",
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Profile Avatar */}
                  <div className="flex-shrink-0">
                    {currentUser.profileImage ? (
                      <Image
                        src={currentUser.profileImage}
                        alt={displayName}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#6299d0] text-white flex items-center justify-center font-bold text-xs">
                        {initials}
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h1
                      className="font-bold font-heading tracking-wide"
                      style={{
                        color: "#6299d0",
                        margin: 0,
                        fontSize: "0.9rem",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {displayName}
                    </h1>
                    <p className="text-xs text-[#6299d0] font-medium mt-0.5">
                      {roleLabel}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Logout Button */}
          {onLogout && (
            <div className="pt-4 border-t border-[#b2cee2]">
              <CustomButton
                width="100%"
                variant="contained"
                color="error"
                size="medium"
                onClick={onLogout}
                startIcon={<LogOut size={18} />}
                sx={{
                  width: "100%",
                  fontFamily: "var(--font-poppins), system-ui, sans-serif",
                  fontWeight: 500,
                  textTransform: "none",
                  fontSize: "0.875rem",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.3s ease-in-out",
                }}
              >
                Logout
              </CustomButton>
            </div>
          )}
        </div>
      ) : (
        /* When sections exist, render profile and logout normally */
        <>
          {/* User Profile Section */}
          {currentUser && (
            <div className="mb-4">
              <div
                className="w-full px-4 py-2 rounded-xl border-2"
                style={{
                  backgroundColor: "#f9fbfc",
                  borderColor: "#6299d0",
                  boxShadow: "0 2px 6px rgba(98, 153, 208, 0.15)",
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Profile Avatar */}
                  <div className="flex-shrink-0">
                    {currentUser.profileImage ? (
                      <Image
                        src={currentUser.profileImage}
                        alt={displayName}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#6299d0] text-white flex items-center justify-center font-bold text-xs">
                        {initials}
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h1
                      className="font-bold font-heading tracking-wide"
                      style={{
                        color: "#6299d0",
                        margin: 0,
                        fontSize: "0.9rem",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {displayName}
                    </h1>
                    <p className="text-xs text-[#6299d0] font-medium mt-0.5">
                      {roleLabel}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Logout Button */}
          {onLogout && (
            <div className="mt-auto pt-4 border-t border-[#b2cee2]">
              <CustomButton
                width="100%"
                variant="contained"
                color="error"
                size="medium"
                onClick={onLogout}
                startIcon={<LogOut size={18} />}
                sx={{
                  width: "100%",
                  fontFamily: "var(--font-poppins), system-ui, sans-serif",
                  fontWeight: 500,
                  textTransform: "none",
                  fontSize: "0.875rem",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.3s ease-in-out",
                }}
              >
                Logout
              </CustomButton>
            </div>
          )}
        </>
      )}
    </div>
  );
}
