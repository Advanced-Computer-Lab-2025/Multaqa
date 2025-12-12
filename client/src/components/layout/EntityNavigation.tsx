import React, { useEffect, useMemo } from "react";
import SidebarNavigation from "./SidebarNavigation";
import TopNavigation from "./TopNavigation";
import Tabs from "./Tabs";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  User,
  Calendar,
  Trophy,
  Dumbbell,
  Store,
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  ClipboardList,
  BarChart3,
  Archive,
  // CreditCard,
  QrCode,
  Award,
  Wallet,
  MessageSquareWarning,
  Bug,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserRoleKey } from "@/types";
// import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
// import StorefrontIcon from '@mui/icons-material/Storefront';
// import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
// import EventIcon from '@mui/icons-material/Event';
// import PollIcon from '@mui/icons-material/Poll';

interface CurrentUser {
  name?: string;
  profileImage?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  logoUrl?: string;
}

interface EntityNavigationProps {
  children?: React.ReactNode;
  headerTitle?: string;
  // Backend UserResponse object
  user: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

// Role-based navigation configuration
type RoleConfig = {
  headerTitle: string;
  icon: React.ReactNode;
  tabs: TabItem[];
  sections: SectionItem[];
  defaultTab?: string;
  defaultSection?: string;
};

type TabItem = { id: string; label: string };

type SectionItem = {
  key: string;
  label: string;
  icon: React.ElementType;
  tabs?: TabItem[];
};

// Helper: Map backend user to frontend role key for navigation config
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getUserRoleKey = (user: any): string => {
  if (!user) return "student";

  if (user.role === "student") return "student";
  if (user.role === "vendor") return "vendor";

  if (user.role === "staffMember") {
    if (user.position === "professor") return "professor";
    if (user.position === "TA") return "ta";
    if (user.position === "staff") return "staff";
    return "staff";
  }

  if (user.role === "administration") {
    if (user.roleType === "admin") return "admin";
    if (user.roleType === "eventsOffice") return "events-office";
    return "admin";
  }

  if (user.role === "usherAdmin") return "usher-admin";

  return "student";
};

// Helper: Format user data for display
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatUserData = (user: any): CurrentUser => {
  if (!user) return {};

  // For students and staff members
  if (user.firstName && user.lastName) {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`,
    };
  }

  // For vendors
  if (user.companyName) {
    return {
      name: user.companyName,
      companyName: user.companyName,
      logoUrl: user.logo?.url, // Extract logo URL from IFileInfo
    };
  }

  // For administration
  if (user.name) {
    return {
      name: user.name,
    };
  }

  return {
    name: user.email || "User",
  };
};

const roleNavigationConfig: Record<string, RoleConfig> = {
  student: {
    headerTitle: "Student Portal",
    icon: <User size={32} className="text-[#6299d0]" />,
    defaultTab: "browse-events",
    defaultSection: "events",
    tabs: [
      { id: "browse-events", label: "Browse Events" },
      { id: "my-registered", label: "My Registered Events" },
      { id: "favorites", label: "My Favorites" },
      { id: "reserve", label: "Reserve Courts" },
      { id: "my-reserved", label: "My Reservations" },
      { id: "browse-sessions", label: "Browse Sessions" },
      { id: "my-sessions", label: "My Registered Sessions" },
      { id: "overview", label: "Overview" },
      { id: "loyalty-partners", label: "Loyalty Program Partners" },
      { id: "teams-description", label: "Teams Description" },
      { id: "interview-slots", label: "Interview Slots" },
    ],
    sections: [
      {
        key: "events",
        label: "Events",
        icon: Calendar,
        tabs: [
          { id: "browse-events", label: "Browse Events" },
          { id: "my-registered", label: "My Registered Events" },
          { id: "favorites", label: "My Favorites" },
          { id: "polls", label: "Polls" },
        ],
      },
       {
        key: "graduation",
        label: "Guc Graduation",
        icon: Calendar,
        tabs: [
          { id: "teams-description", label: "Teams Description" },
          { id: "interview-slots", label: "Interview Slots" },
        ],
      },
      {
        key: "courts",
        label: "Courts",
        icon: Trophy,
        tabs: [{ id: "reserve", label: "Reserve Courts" }],
      },
      {
        key: "gym",
        label: "Gym Sessions",
        icon: Dumbbell,
        tabs: [
          { id: "browse-sessions", label: "Browse Sessions" },
          { id: "my-sessions", label: "My Registered Sessions" },
        ],
      },
      {
        key: "wallet",
        label: "Wallet",
        icon: Wallet,
        tabs: [{ id: "overview", label: "Overview" }],
      },
      {
        key: "vendors",
        label: "Loyalty Program",
        icon: Store,
        tabs: [{ id: "loyalty-partners", label: "Loyalty Program Partners" }],
      },
      {
        key: "bug-reporting",
        label: "Bug Reporting",
        icon: Bug,
        tabs: [{ id: "bug-reporting", label: "Bug Reporting" }],
      },
    ],
  },
  staff: {
    headerTitle: "Staff Portal",
    icon: <User size={32} className="text-[#6299d0]" />,
    defaultTab: "browse-events",
    defaultSection: "events",
    tabs: [
      { id: "browse-events", label: "Browse Events" },
      { id: "my-registered", label: "My Registered Events" },
      { id: "favorites", label: "My Favorites" },
      { id: "browse-sessions", label: "Browse Sessions" },
      { id: "my-sessions", label: "My Registered Sessions" },
      { id: "overview", label: "Overview" },
      { id: "loyalty-partners", label: "Loyalty Program Partners" },
    ],
    sections: [
      {
        key: "events",
        label: "Events",
        icon: Calendar,
        tabs: [
          { id: "browse-events", label: "Browse Events" },
          { id: "my-registered", label: "My Registered Events" },
          { id: "favorites", label: "My Favorites" },
          { id: "polls", label: "Polls" },
        ],
      },
      {
        key: "gym",
        label: "Gym Sessions",
        icon: Dumbbell,
        tabs: [
          { id: "browse-sessions", label: "Browse Sessions" },
          { id: "my-sessions", label: "My Registered Sessions" },
        ],
      },
      {
        key: "wallet",
        label: "Wallet",
        icon: Wallet,
        tabs: [{ id: "overview", label: "Overview" }],
      },
      {
        key: "vendors",
        label: "Loyalty Program",
        icon: Store,
        tabs: [{ id: "loyalty-partners", label: "Loyalty Program Partners" }],
      },
       {
        key: "bug-reporting",
        label: "Bug Reporting",
        icon: Bug,
        tabs: [{ id: "bug-reporting", label: "Bug Reporting" }],
      },
    ],
  },
  ta: {
    headerTitle: "TA Portal",
    icon: <User size={32} className="text-[#6299d0]" />,
    defaultTab: "browse-events",
    defaultSection: "events",
    tabs: [
      { id: "browse-events", label: "Browse Events" },
      { id: "my-registered", label: "My Registered Events" },
      { id: "favorites", label: "My Favorites" },
      { id: "overview", label: "Overview" },
      { id: "loyalty-partners", label: "Loyalty Program Partners" },
    ],
    sections: [
      {
        key: "events",
        label: "Events",
        icon: Calendar,
        tabs: [
          { id: "browse-events", label: "Browse Events" },
          { id: "my-registered", label: "My Registered Events" },
          { id: "favorites", label: "My Favorites" },
          { id: "polls", label: "Polls" },
        ],
      },
      {
        key: "gym",
        label: "Gym Sessions",
        icon: Dumbbell,
        tabs: [
          { id: "browse-sessions", label: "Browse Sessions" },
          { id: "my-sessions", label: "My Registered Sessions" },
        ],
      },
      {
        key: "wallet",
        label: "Wallet",
        icon: Wallet,
        tabs: [{ id: "overview", label: "Overview" }],
      },
      {
        key: "vendors",
        label: "Loyalty Program",
        icon: Store,
        tabs: [{ id: "loyalty-partners", label: "Loyalty Program Partners" }],
      },
       {
        key: "bug-reporting",
        label: "Bug Reporting",
        icon: Bug,
        tabs: [{ id: "bug-reporting", label: "Bug Reporting" }],
      },
    ],
  },
  professor: {
    headerTitle: "Professor Portal",
    icon: <User size={32} className="text-[#6299d0]" />,
    defaultTab: "",
    defaultSection: "workshops",
    tabs: [
      { id: "browse-events", label: "Browse Events" },
      { id: "my-registered", label: "My Registered Events" },
      { id: "favorites", label: "My Favorites" },
      { id: "browse-sessions", label: "Browse Sessions" },
      { id: "my-sessions", label: "My Registered Sessions" },
      { id: "loyalty-partners", label: "Loyalty Program Partners" },
    ],
    sections: [
      {
        key: "workshops",
        label: "My Workshops",
        icon: Calendar,
        tabs: [],
      },
      {
        key: "events",
        label: "Events",
        icon: Calendar,
        tabs: [
          { id: "browse-events", label: "Browse Events" },
          { id: "my-registered", label: "My Registered Events" },
          { id: "favorites", label: "My Favorites" },
          { id: "polls", label: "Polls" },
        ],
      },
      {
        key: "gym",
        label: "Gym Sessions",
        icon: Dumbbell,
        tabs: [
          { id: "browse-sessions", label: "Browse Sessions" },
          { id: "my-sessions", label: "My Registered Sessions" },
        ],
      },
      {
        key: "wallet",
        label: "Wallet",
        icon: Wallet,
      },
      {
        key: "vendors",
        label: "Loyalty Program",
        icon: Store,
        tabs: [{ id: "loyalty-partners", label: "Loyalty Program Partners" }],
      },
       {
        key: "bug-reporting",
        label: "Bug Reporting",
        icon: Bug,
        tabs: [{ id: "bug-reporting", label: "Bug Reporting" }],
      },
    ],
  },
  "events-office": {
    headerTitle: "Events Office",
    icon: <Calendar size={32} className="text-[#6299d0]" />,
    defaultTab: "",
    defaultSection: "events",
    tabs: [
      { id: "all-events", label: "All Events" },
      { id: "my-creations", label: "Creation Hub" },
      { id: "all-vendors", label: "All Vendors" },
      { id: "participation-requests", label: "Participation Requests" },
      { id: "loyalty-partners", label: "Loyalty Program Partners" },
      { id: "documents", label: "View Documents" },
      { id: "attendee-reports", label: "Attendee Reports" },
      { id: "sales-reports", label: "Sales Reports" },
      { id: "sessions-management", label: "Sessions Management" },
      { id: "vendor-polls", label: "Create Vendor Polls" },
    ],
    sections: [
      {
        key: "events",
        label: "Events Management",
        icon: Calendar,
        tabs: [{ id: "all-events", label: "All Events" }],
      },
      {
        key: "workshop-requests",
        label: "Workshop Requests",
        icon: FileText,
        tabs: [],
      },
      {
        key: "vendors",
        label: "Vendor Management",
        icon: Store,
        tabs: [
          { id: "all-vendors", label: "Vendors Details" },
          { id: "participation-requests", label: "Participation Requests" },
          { id: "loyalty-partners", label: "Loyalty Program Partners" },
          { id: "vendor-polls", label: "Vendor Polls" },
        ],
      },
      {
        key: "reports",
        label: "Reports",
        icon: BarChart3,
        tabs: [
          { id: "attendee-reports", label: "Attendee Reports" },
          { id: "sales-reports", label: "Sales Reports" },
        ],
      },
      {
        key: "gym",
        label: "Gym Management",
        icon: Dumbbell,
        tabs: [
          { id: "sessions-management", label: "Sessions Management" },
          { id: "browse-sessions", label: "Browse Sessions" },
        ],
      },
       {
        key: "bug-reporting",
        label: "Bug Reporting",
        icon: Bug,
        tabs: [{ id: "bug-reporting", label: "Bug Reporting" }],
      },
    ],
  },
  admin: {
    headerTitle: "Admin Panel",
    icon: <Settings size={32} className="text-[#6299d0]" />,
    defaultTab: "",
    defaultSection: "events-office",
    tabs: [
      { id: "all-users", label: "All Users" },
      { id: "all-events", label: "All Events" },
      { id: "block-users", label: "Block/Unblock Users" },
      { id: "assign-roles", label: "Assign Roles" },
      { id: "manage-eo-account", label: "Manage Accounts" },
      { id: "all-vendors", label: "All Vendors" },
      { id: "participation-requests", label: "Participation Requests" },
      { id: "loyalty-partners", label: "Loyalty Program Partners" },
      { id: "documents", label: "View Documents" },
      { id: "attendee-reports", label: "Attendee Reports" },
      { id: "sales-reports", label: "Sales Reports" },
    ],
    sections: [
      {
        key: "event-office",
        label: "Accounts Hub",
        icon: Calendar,
        tabs: [{ id: "manage-eo-account", label: "Manage Accounts" }],
      },
      {
        key: "users",
        label: "User Management",
        icon: Users,
        tabs: [
          { id: "all-users", label: "All Users" },
          { id: "block-users", label: "Block/Unblock Users" },
        ],
      },
      {
        key: "role-assignment",
        label: "Role Assignment",
        icon: ClipboardList,
        tabs: [{ id: "assign-roles", label: "Assign Roles" }],
      },
      {
        key: "events",
        label: "Events Management",
        icon: Calendar,
        tabs: [{ id: "all-events", label: "All Events" }],
      },
      {
        key: "reports",
        label: "Vendor Management",
        icon: Store,
        tabs: [
          { id: "all-vendors", label: "Vendors Details" },
          { id: "participation-requests", label: "Participation Requests" },
          { id: "loyalty-partners", label: "Loyalty Program Partners" },
        ],
      },
      {
        key: "sales-attendance",
        label: "Reports",
        icon: BarChart3,
        tabs: [
          { id: "attendee-reports", label: "Attendee Reports" },
          { id: "sales-reports", label: "Sales Reports" },
        ],
      },

      {
        key: "flagged-comments",
        label: "Flagged Comments",
        icon: MessageSquareWarning,
        tabs: [{ id: "overview", label: "Overview" }],
      },
       {
        key: "bug-reporting",
        label: "Bug Reports",
        icon: Bug,
        tabs: [{ id: "bug-reports", label: "Bug Reports" }],
      },
    ],
  },
  vendor: {
    headerTitle: "Vendor Portal",
    icon: <Store size={32} className="text-[#6299d0]" />,
    defaultTab: "bazaars",
    defaultSection: "opportunities",
    tabs: [
      { id: "bazaars", label: "Browse Bazaars" },
      { id: "available", label: "My Participations" },
      { id: "my-applications", label: "My Applications" },
      { id: "apply-booth", label: "Booth Hub" },
      { id: "program-status", label: "Program Status" },
      { id: "discount-rates", label: "Discount Rates" },
      { id: "partners", label: "View Partners" },
    ],
    sections: [
      {
        key: "opportunities",
        label: "Bazaars & Booths",
        icon: Store,
        tabs: [
          { id: "bazaars", label: "Browse Bazaars" },
          { id: "available", label: "My Participations" },
          { id: "my-applications", label: "My Applications" },
          { id: "apply-booth", label: "Booth Hub" },
        ],
      },
      {
        key: "loyalty",
        label: "Loyalty Program",
        icon: Award,
        tabs: [{ id: "program-status", label: "Program Details" }],
      },
    ],
  },
  company: {
    headerTitle: "Company Portal",
    icon: <Store size={32} className="text-[#6299d0]" />,
    defaultTab: "",
    defaultSection: "dashboard",
    tabs: [],
    sections: [
      {
        key: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        tabs: [],
      },
    ],
  },
  "usher-admin": {
    headerTitle: "Usher Admin Portal",
    icon: <Store size={32} className="text-[#6299d0]" />,
    defaultTab: "teams-description",
    defaultSection: "graduation",
     tabs: [
          { id: "teams-description", label: "Teams' Description" },
          { id: "interview-management", label: "Interview Management" },
          { id: "student-list", label: "Student List" },
        ],
    sections: [
      {
        key: "graduation",
        label: "GUC Graduation",
        icon: LayoutDashboard,
        tabs: [
          { id: "teams-description", label: "Teams' Description" },
          { id: "interview-management", label: "Interview Management" },
          { id: "student-list", label: "Student List" },
        ],
      },
    ],
  },
};


// Mock data for different user types
// const getMockUserData = (role: string) => {
//   const mockUsers: Record<string, CurrentUser> = {
//     student: {
//       name: "Ahmed Hassan",
//       firstName: "Ahmed",
//       lastName: "Hassan",
//     },
//     staff: {
//       name: "Sara Mohamed",
//       firstName: "Sara",
//       lastName: "Mohamed",
//     },
//     ta: {
//       name: "Omar Youssef",
//       firstName: "Omar",
//       lastName: "Youssef",
//     },
//     professor: {
//       name: "Dr. Fatma Ali",
//       firstName: "Fatma",
//       lastName: "Ali",
//     },
//     "events-office": {
//       name: "Events Office",
//     },
//     admin: {
//       name: "System Administrator",
//     },
//     vendor: {
//       name: "Tech Solutions Inc.",
//     },
//     company: {
//       name: "Microsoft Egypt",
//     },
//   };
//   return mockUsers[role] || mockUsers.student;
// };

export default function EntityNavigation({
  children,
  headerTitle,
  user,
}: EntityNavigationProps) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const { logout } = useAuth();
  const segments = pathname.split("/").filter(Boolean);
  // const locale = segments[0] || "en";

  // Detect stakeholder from path (first segment)
  const stakeholder = segments[0] || "";
  const section = segments[1] || "";
  const tab = segments[2] || "";

  // Track last valid route in sessionStorage
  useEffect(() => {
    // Get current path segments
    if (typeof window !== "undefined" && user) {
      const path = window.location.pathname;
      // Only store if route is valid (matches a section/tab for the user's role)
      const roleKey = getUserRoleKey(user);
      const config = roleNavigationConfig[roleKey];
      if (config) {
        const segments = path.split("/").filter(Boolean);
        // Find section and tab in path
        const section = segments[2] || "";
        const tab = segments[3] || "";
        const validSection = config.sections.find((s) => s.key === section);
        const validTab =
          validSection && validSection.tabs
            ? validSection.tabs.find((t) => t.id === tab)
            : null;
        // If valid section/tab, store route
        if (
          validSection &&
          (validTab || !validSection.tabs || validSection.tabs.length === 0)
        ) {
          sessionStorage.setItem("lastValidRoute", path);
        }
      }
    }
  }, [user]);
  // Get role key from backend user
  const userRoleKeyUnformated = getUserRoleKey(user);
  const userRoleKey = userRoleKeyUnformated.toLowerCase();
  const userData = formatUserData(user);
  const config: RoleConfig =
    roleNavigationConfig[userRoleKey] ?? roleNavigationConfig["student"];

  // If only /stakeholder is visited, redirect to default section/tab
  React.useEffect(() => {

    // Special routes that are always valid (not in navigation config)
    const specialRoutes = ["notifications"];
    const isSpecialRoute = specialRoutes.includes(section);

    // Fallback: if section or tab is not found, redirect to not-found page
    const sectionExists =
      section === "" || isSpecialRoute || config.sections.some((s) => s.key === section);
    const currentSectionForValidation = config.sections.find(
      (s) => s.key === section
    );
    const sectionTabs = currentSectionForValidation?.tabs || [];
    const effectiveTabs =
      sectionTabs.length === 0
        ? [{ id: "overview", label: "Overview" }]
        : sectionTabs;
    const tabExists =
      section === "" || tab === "" || isSpecialRoute || effectiveTabs.some((t) => t.id === tab);

    if (!sectionExists || !tabExists) {
      router.replace("/not-found");
      return;
    }

    if (
      segments.length === 1 &&
      stakeholder === userRoleKey &&
      config.defaultSection
    ) {
      // Clear session storage to ensure we start fresh on root visit
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("lastValidRoute");
      }

      const defaultSection = config.sections.find(
        (s) => s.key === config.defaultSection
      );
      const hasTabs = defaultSection?.tabs && defaultSection.tabs.length > 0;
      const tabToUse = config.defaultTab || (hasTabs ? "" : "overview");
      const tabPath = tabToUse ? `/${tabToUse}` : "";
      router.replace(`/${userRoleKey}/${config.defaultSection}${tabPath}`);
    }
  }, [segments, stakeholder, userRoleKey, config, section, tab, router]);

  // Get section configuration
  const sectionItems: SectionItem[] = config.sections;
  const sectionKeys: string[] = sectionItems.map((s) => s.key);

  // Get tabs for current section
  const currentSection = sectionItems.find((s) => s.key === section);
  const tabItems = useMemo(() => {
    const tabs = currentSection?.tabs || [];
    // Auto-assign default "Overview" tab if no tabs are defined
    return tabs.length === 0 ? [{ id: "overview", label: "Overview" }] : tabs;
  }, [currentSection]);

  // // Debug logging
  // console.log("EntityNavigation state:", {
  //   pathname,
  //   // entity,
  //   section,
  //   tab,
  //   userRoleKey,
  //   currentSection: currentSection?.key,
  //   tabItemsCount: tabItems.length,
  //   tabIds: tabItems.map((t) => t.id),
  //   sectionKeys,
  //   activeSectionIndex,
  //   sectionFromIndex: sectionKeys[activeSectionIndex],
  // });

  // Navigation paths don't need locale either
  const handleSectionChange = (index: number) => {
    const newSection = sectionItems[index];
    const hasTabs = newSection?.tabs && newSection.tabs.length > 0;

    let tabId = "overview";
    if (hasTabs && newSection.tabs) {
      // If switching to the default section, try to use the default tab
      if (newSection.key === config.defaultSection && config.defaultTab) {
        const defaultTabExists = newSection.tabs.some(t => t.id === config.defaultTab);
        if (defaultTabExists) {
          tabId = config.defaultTab;
        } else {
          tabId = newSection.tabs[0].id;
        }
      } else {
        tabId = newSection.tabs[0].id;
      }
    }

    const tabSeg = hasTabs ? `/${tabId}` : "/overview";

    // No locale prefix needed - i18n router adds it
    const newPath = `/${userRoleKey}/${newSection.key}${tabSeg}`;
    router.push(newPath);
  };

  const handleTabClick = (id: string) => {
    const sectionSeg = section ? `/${section}` : "";
    // No locale prefix needed
    router.push(`/${userRoleKey}${sectionSeg}/${id}`);
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const headerProps = {
    title: headerTitle ?? config.headerTitle,
    showBack: true,
    onBack: () => router.back(),
    leftIcon: config.icon,
  };

  return (
    <div className="flex flex-col h-screen bg-[#f9fbfc]">
      {/* Top Navigation - spans full width */}
      <TopNavigation
        companyName="Multaqa"
        header={headerProps}
        currentUser={userData}
        userRole={userRoleKey as UserRoleKey}
      />

      {/* Tabs Section - main navigation tabs */}
      {/* {sectionLabels.length > 0 && (
        <div className="bg-white border-b border-gray-300">
          <div className="px-6">
            <Tabs
              tabs={sectionLabels}
              activeTab={activeSectionIndex >= 0 ? activeSectionIndex : 0}
              onTabChange={handleSectionChange}
            />
          </div>
        </div>
      )} */}

      {/* Sidebar and main content below */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Fixed width sidebar - never gets squished */}
        <div className="flex-shrink-0">
          <SidebarNavigation
            activeItem={section}
            onItemClick={(key) => {
              const index = sectionKeys.indexOf(key);
              if (index >= 0) handleSectionChange(index);
            }}
            sectionItems={sectionItems.map((s) => ({
              id: s.key,
              label: s.label,
            }))}
            onLogout={handleLogout}
            currentUser={userData}
            userRole={userRoleKey as UserRoleKey}
          />
        </div>

        {/* Flexible main content area */}
        <div className="flex-1 bg-[##c0d2f0] p-4 min-h-screen min-w-0">
          <div
            className="flex-1 bg-white min-h-0 overflow-auto"
            style={{
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
              padding: "20px 28px",
              border: "1px solid #e5e7eb",
              maxHeight: "calc(100vh - 100px)",
              height: "fit-content",
            }}
          >
            {tabItems.length > 0 && !["notifications"].includes(section) && (
              <div className="bg-white border-b border-gray-300">
                <div className="px-6">
                  <Tabs
                    tabs={tabItems.map((t: TabItem) => t.label)}
                    activeTab={Math.max(
                      0,
                      tabItems.findIndex((t: TabItem) => t.id === tab)
                    )}
                    onTabChange={(index) => handleTabClick(tabItems[index].id)}
                  />
                </div>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
