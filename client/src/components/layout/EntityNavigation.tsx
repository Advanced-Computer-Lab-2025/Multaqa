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
  Wallet
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
  defaultTab?: string;
  defaultSection?: string;
};

type TabItem = {
  key: string;
  label: string;
  icon: React.ElementType;
  sections?: SectionItem[];
};

type SectionItem = { id: string; label: string };

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
    defaultTab: "events",
    defaultSection: "browse-events",
    tabs: [
      {
        key: "events",
        label: "Events",
        icon: Calendar,
        sections: [
          { id: "browse-events", label: "Browse Events" },
          { id: "my-registered", label: "My Registered Events" },
          { id: "favorites", label: "My Favorites" },
        ],
      },
      {
        key: "courts",
        label: "Courts",
        icon: Trophy,
        sections: [
          { id: "reserve", label: "Reserve Courts" },
          { id: "my-reserved", label: "My Reservations" },
        ],
      },
      {
        key: "gym",
        label: "Gym Sessions",
        icon: Dumbbell,
        sections: [
          { id: "browse-sessions", label: "Browse Sessions" },
          { id: "my-sessions", label: "My Registered Sessions" },
        ],
      },
      {
        key: "wallet",
        label: "Wallet",
        icon: Wallet, 
        sections: [{id: "overview", label: "Overview"}],
      },
    ],
  },
  staff: {
    headerTitle: "Staff Portal",
    icon: <User size={32} className="text-[#6299d0]" />,
    defaultTab: "events",
    defaultSection: "browse-events",
    tabs: [
      {
        key: "events",
        label: "Events",
        icon: Calendar,
        sections: [
          { id: "browse-events", label: "Browse Events" },
          { id: "my-registered", label: "My Registered Events" },
          { id: "favorites", label: "My Favorites" },
        ],
      },
      {
        key: "gym",
        label: "Gym Sessions",
        icon: Dumbbell,
        sections: [
          { id: "browse-sessions", label: "Browse Sessions" },
          { id: "my-sessions", label: "My Registered Sessions" },
        ],
      },
      {
        key: "wallet",
        label: "Wallet",
        icon: Wallet, 
        sections: [{id: "overview", label: "Overview"}],
      },
    ],
  },
  ta: {
    headerTitle: "TA Portal",
    icon: <User size={32} className="text-[#6299d0]" />,
    defaultTab: "events",
    defaultSection: "browse-events",
    tabs: [
      {
        key: "events",
        label: "Events",
        icon: Calendar,
        sections: [
          { id: "browse-events", label: "Browse Events" },
          { id: "my-registered", label: "My Registered Events" },
          { id: "favorites", label: "My Favorites" },
        ],
      },
      {
        key: "wallet",
        label: "Wallet",
        icon: Wallet, 
        sections: [{id: "overview", label: "Overview"}],
      },
    ],
  },
  professor: {
    headerTitle: "Professor Portal",
    icon: <User size={32} className="text-[#6299d0]" />,
    defaultTab: "workshops",
    defaultSection: "",
    tabs: [
      {
        key: "workshops",
        label: "My Workshops",
        icon: Calendar,
        sections:[],
      },
      {
        key: "events",
        label: "Events",
        icon: Calendar,
        sections: [
          { id: "browse-events", label: "Browse Events" },
          { id: "my-registered", label: "My Registered Events" },
          { id: "favorites", label: "My Favorites" },
        ],
      },
       {
        key: "gym",
        label: "Gym Sessions",
        icon: Dumbbell,
        sections: [
          { id: "browse-sessions", label: "Browse Sessions" },
          { id: "my-sessions", label: "My Registered Sessions" },
        ],
      },
      {
        key: "wallet",
        label: "Wallet",
        icon: Wallet, 
        sections: [{id: "overview", label: "Overview"}],
      },
    ],
  },
  "events-office": {
    headerTitle: "Events Office",
    icon: <Calendar size={32} className="text-[#6299d0]" />,
    defaultTab: "events",
    defaultSection: "",
    tabs: [
      {
        key: "events",
        label: "Events Management",
        icon: Calendar,
        sections: [
          { id: "all-events", label: "All Events" },
          { id: "my-creations", label: "Creation Hub" },
        ],
      },
      {
        key: "workshop-requests",
        label: "Workshop Requests",
        icon: FileText,
        sections: [],
      },
      {
        key: "vendors",
        label: "Vendor Management",
        icon: Store,
        sections: [
          { id: "all-vendors", label: "All Vendors" },
          { id: "participation-requests", label: "Participation Requests" },
          { id: "loyalty-partners", label: "Loyalty Program Partners" },
          { id: "documents", label: "View Documents" },
        ],
      },
      {
        key: "reports",
        label: "Reports",
        icon: BarChart3,
        sections: [
          { id: "attendee-reports", label: "Attendee Reports" },
          { id: "sales-reports", label: "Sales Reports" },
        ],
      },
      {
        key: "gym",
        label: "Gym Management",
        icon: Dumbbell,
        sections: [
          { id: "sessions-management", label: "Sessions Management" },
          { id: "vendor-polls", label: "Create Vendor Polls" },
        ],
      },
      { key: "archive", label: "Archive", icon: Archive, sections: [] },
      {
        key: "notifications",
        label: "Notifications",
        icon: ClipboardList,
        sections: [],
      },
    ],
  },
  admin: {
    headerTitle: "Admin Panel",
    icon: <Settings size={32} className="text-[#6299d0]" />,
    defaultTab: "users",
    defaultSection: "",
    tabs: [
      {
        key: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        sections: [],
      },
      {
        key: "events",
        label: "Events Management",
        icon: Calendar,
        sections: [{ id: "all-events", label: "All Events" }],
      },
      {
        key: "users",
        label: "User Management",
        icon: Users,
        sections: [
          { id: "all-users", label: "All Users" },
          { id: "block-users", label: "Block/Unblock Users" },
        ],
      },
      {
        key: "role-assignment",
        label: "Role Assignment",
        icon: ClipboardList,
        sections: [{ id: "assign-roles", label: "Assign Roles" }],
      },
      {
        key: "event-office",
        label: "Accounts Hub",
        icon: Calendar,
        sections: [{ id: "manage-eo-account", label: "Manage Accounts" }],
      },
      {
        key: "reports",
        label: "Vendor Management",
        icon: Store,
        sections: [
          { id: "all-vendors", label: "All Vendors" },
          { id: "participation-requests", label: "Participation Requests" },
          { id: "loyalty-partners", label: "Loyalty Program Partners" },
          { id: "documents", label: "View Documents" },
        ],
      },
    ],
  },
  vendor: {
    headerTitle: "Vendor Portal",
    icon: <Store size={32} className="text-[#6299d0]" />,
    defaultTab: "opportunities",
    defaultSection: "bazaars",
    tabs: [
      {
        key: "opportunities",
        label: "Bazaars & Booths",
        icon: Store,
        sections: [
          { id: "bazaars", label: "Browse Bazaars" },
          { id: "available", label: "My Participations" },
          { id: "my-applications", label: "My Applications" },
          { id: "apply-booth", label: "Booth Hub" },
        ],
      },
      { key: "qr-codes", label: "QR Codes", icon: QrCode, sections: [] },
      {
        key: "loyalty",
        label: "Loyalty Program",
        icon: Award,
        sections: [
          { id: "program-status", label: "Program Status" },
          { id: "discount-rates", label: "Discount Rates" },
          { id: "partners", label: "View Partners" },
        ],
      },
    ],
  },
  company: {
    headerTitle: "Company Portal",
    icon: <Store size={32} className="text-[#6299d0]" />,
    defaultTab: "dashboard",
    defaultSection: "",
    tabs: [
      {
        key: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        sections: [],
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
  const tab = segments[1] || "";
  const section = segments[2] || "";

    // Track last valid route in sessionStorage
    useEffect(() => {
      // Get current path segments
      if (typeof window !== "undefined" && user) {
        const path = window.location.pathname;
        // Only store if route is valid (matches a tab/section for the user's role)
        const roleKey = getUserRoleKey(user);
        const config = roleNavigationConfig[roleKey];
        if (config) {
          const segments = path.split("/").filter(Boolean);
          // Find tab and section in path
          const tab = segments[2] || "";
          const section = segments[3] || "";
          const validTab = config.tabs.find(t => t.key === tab);
          const validSection = validTab && validTab.sections ? validTab.sections.find(s => s.id === section) : null;
          // If valid tab/section, store route
          if (validTab && (validSection || !validTab.sections || validTab.sections.length === 0)) {
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

  // If only /stakeholder is visited, redirect to default tab/section
  React.useEffect(() => {
    // Fallback: if tab or section is not found, redirect to not-found page
    const tabExists = tab === "" || config.tabs.some((t) => t.key === tab);
    const sectionExists =
      tab === "" || section === "" ||
      (config.tabs.find((t) => t.key === tab)?.sections || []).some((s) => s.id === section);

    if (!tabExists || !sectionExists) {
      router.replace("/not-found");
      return;
    }

    if (
      segments.length === 1 &&
      stakeholder === userRoleKey &&
      config.defaultTab && config.defaultSection
    ) {
      router.replace(`/${userRoleKey}/${config.defaultTab}/${config.defaultSection}`);
    }
  }, [segments, stakeholder, userRoleKey, config, tab, section, router]);

  // Get tab configuration
  const tabItems: TabItem[] = config.tabs;
  const tabKeys: string[] = tabItems.map((t) => t.key);
  const tabLabels: string[] = tabItems.map((t) => t.label);
  const activeTabIndex =
    tabKeys.length > 0 ? Math.max(0, tabKeys.indexOf(tab)) : -1;

  // Get sections for current tab
  const currentTab = tabItems.find((t) => t.key === tab);
  const sectionItems = useMemo(() => currentTab?.sections || [], [currentTab]);

  // // Debug logging
  // console.log("EntityNavigation state:", {
  //   pathname,
  //   // entity,
  //   tab,
  //   section,
  //   userRoleKey,
  //   currentTab: currentTab?.key,
  //   sectionItemsCount: sectionItems.length,
  //   sectionIds: sectionItems.map((s) => s.id),
  //   tabKeys,
  //   activeTabIndex,
  //   tabFromIndex: tabKeys[activeTabIndex],
  // });

  // Navigation paths don't need locale either
  const handleTabChange = (index: number) => {
    const newTab = tabItems[index];
    const sectionSeg =
      newTab?.sections && newTab.sections.length > 0
        ? `/${newTab.sections[0].id}`
        : "";

    // No locale prefix needed - i18n router adds it
    const newPath = `/${userRoleKey}/${newTab.key}${sectionSeg}`;
    router.push(newPath);
  };

  const handleSectionClick = (id: string) => {
    const tabSeg = tab ? `/${tab}` : "";
    // No locale prefix needed
    router.push(`/${userRoleKey}${tabSeg}/${id}`);
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
      <TopNavigation companyName="Multaqa" header={headerProps}  currentUser={userData}
            userRole={userRoleKey as UserRoleKey} />

      {/* Tabs Section - main navigation tabs */}
      {/* {tabLabels.length > 0 && (
        <div className="bg-white border-b border-gray-300">
          <div className="px-6">
            <Tabs
              tabs={tabLabels}
              activeTab={activeTabIndex >= 0 ? activeTabIndex : 0}
              onTabChange={handleTabChange}
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
            onItemClick={handleSectionClick}
            sectionItems={tab ? sectionItems : []}
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
              minHeight: "90vh",
              maxHeight: "90vh",
            }}
          >
          {tabLabels.length > 0 && (
          <div className="bg-white border-b border-gray-300">
           <div className="px-6">
            <Tabs
              tabs={tabLabels}
              activeTab={activeTabIndex >= 0 ? activeTabIndex : 0}
              onTabChange={handleTabChange}
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
