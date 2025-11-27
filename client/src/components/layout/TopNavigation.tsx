import React from "react";
import NotificationBell from "@/components/notifications/NotificationBell";
import { UserRoleKey } from "@/types";
import Image from "next/image";
import ScaledLogo from "../shared/MultaqaLogos/ScaledLogo";
import multaqaLogo from "../../../public/assets/images/multaqa-top-nav.png";
import multaqaIcon from "../../../public/assets/images/multaqa-icon-only.png";
import { Box, Typography } from "@mui/material";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  leftIcon?: React.ReactNode;
  tabs?: string[];
  activeTabIndex?: number;
  onTabChange?: (index: number) => void;
}
// style={{
//   background: "linear-gradient(135deg, #6299d0 0%, #b2cee2 30%, #e5ed6f 70%, #ffdf6f 100%)",
//   backgroundSize: "cover",
//   backgroundRepeat: "no-repeat",

// }}

interface CurrentUser {
  name?: string;
  profileImage?: string;
  firstName?: string;
  lastName?: string;
}
interface TopNavigationProps {
  companyName?: string;
  header?: HeaderProps;
  currentUser?: CurrentUser;
  userRole?: UserRoleKey;
}

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

// Generic roles that use initials (name-based)
const GENERIC_ROLES = ["events-office", "admin", "vendor", "company"];

const capitalizeFirstLetter = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Get display name based on role
const getDisplayName = (user?: CurrentUser, role?: string): string => {
  if (!user) return "";

  let displayName: string;

  // For generic roles (events-office, admin, vendor, company), use full name
  if (GENERIC_ROLES.includes(role || "")) {
    displayName = user.name || "User";
  } else {
    // For personal roles (student, staff, ta, professor), try firstName or fall back to name
    displayName = user.firstName || user.name || "User";
  }

  // Apply capitalization to the first letter of the resulting display name
  return capitalizeFirstLetter(displayName);
};

export default function TopNavigation({
  companyName = "Multaqa",
  header,
  currentUser,
  userRole,
}: TopNavigationProps) {
  const displayName = getDisplayName(currentUser, userRole);
  const initials = getInitials(currentUser, userRole);
  const roleLabel = getRoleLabel(userRole);
  return (
    <div className="bg-white border-b border-gray-300 w-full">
      {/* Company/App Bar with Back Button */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-gray-200 bg-gradient-to-r from-[#f9fbfc] to-[#f0f4f8]">
        {/* Left: Back Button (if applicable) */}
        {/* <div className="flex items-center gap-3">
          {header?.showBack && (
            <IconButton
              onClick={header.onBack}
              sx={{
                color: "#6299d0",
                backgroundColor: "rgba(98, 153, 208, 0.1)",
                "&:hover": {
                  transform: "scale(1.04) translateX(-2px)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                width: 36,
                height: 36,
              }}
            >
              <ArrowLeft size={20} />
            </IconButton>
          )}
        </div> */}

        <div className="flex items-center justify-between w-full px-4">
          <Box
            sx={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <ScaledLogo
              image={multaqaIcon}
              transparent
              iconOnly
              small
            />
            <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "var(--font-jost)", textTransform: "uppercase" }}>
              Multaqa
            </Typography>
          </Box>
          {/* <span className="text-2xl font-heading font-bold text-gray-800 tracking-wide">
            {companyName}
          </span> */}

          {currentUser && (
            <div className="w-fit">
              <div
                className="px-4 py-2 rounded-xl border-2"
                style={{
                  backgroundColor: "#f9fbfc",
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
                        color: "#3a4f99",
                        margin: 0,
                        fontSize: "0.9rem",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Hi, {displayName} !
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Notification Bell */}
        <div className="flex items-center gap-3">
          <NotificationBell />
        </div>
      </div>

      {/* Tabs Section */}
      {header && header.tabs && header.tabs.length > 0 && (
        <div className="border-t border-gray-200 bg-white">
          <div className="flex gap-1 px-6">
            {header.tabs.map((tab, index) => {
              const isActive = header.activeTabIndex === index;
              return (
                <button
                  key={index}
                  onClick={() => header.onTabChange?.(index)}
                  className={`py-3 px-6 text-sm font-medium font-heading transition-all relative ${
                    isActive
                      ? "text-[#6299d0] font-bold"
                      : "text-gray-600 hover:text-[#6299d0]"
                  }`}
                  style={{
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {tab}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6299d0] to-[#4a7ba7]"
                      style={{
                        boxShadow: "0 -1px 3px rgba(98, 153, 208, 0.4)",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
