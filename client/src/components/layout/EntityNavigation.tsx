import React from "react";
import SidebarNavigation from "./SidebarNavigation";
import TopNavigation from "./TopNavigation";
import Tabs from "./Tabs";
import { usePathname, useRouter } from "next/navigation";
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
  CreditCard,
  QrCode,
  Award,
} from "lucide-react";

interface EntityNavigationProps {
  children?: React.ReactNode;
  headerTitle?: string;
  userRole?:
    | "student"
    | "staff"
    | "ta"
    | "professor"
    | "events-office"
    | "admin"
    | "vendor";
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
        label: "Courts Booking",
        icon: Trophy,
        sections: [
          { id: "reserve", label: "Reserve Courts" },
          // Future: { id: "my-reservations", label: "My Reservations" },
        ],
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
        key: "courts",
        label: "Courts Booking",
        icon: Trophy,
        sections: [
          { id: "reserve", label: "Reserve Courts" },
        ],
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
        key: "courts",
        label: "Courts Booking",
        icon: Trophy,
        sections: [
          { id: "reserve", label: "Reserve Courts" },
        ],
      },
    ],
  },
  professor: {
    headerTitle: "Professor Portal",
    icon: <User size={32} className="text-[#6299d0]" />,
    defaultTab: "events",
    defaultSection: "create-workshop",
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
        label: "Courts Booking",
        icon: Trophy,
        sections: [
          { id: "reserve", label: "Reserve Courts" },
        ],
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
        ],
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
        sections: [
          { id: "assign-roles", label: "Assign Roles" },
        ],
      },
      {
        key: "event-office",
        label: "Event Office Accounts",
        icon: Calendar,
        sections: [{ id: "manage-eo-account", label: "Manage Accounts" }],
      },
    ],
  },
  vendor: {
    headerTitle: "Vendor Portal",
    icon: <Store size={32} className="text-[#6299d0]" />,
    defaultTab: "opportunities",
    defaultSection: "available",
    tabs: [
      // TODO: Add your first page and sections here
      // {
      //   key: "opportunities",
      //   label: "Bazaars & Booths",
      //   icon: Store,
      //   sections: [
      //     { id: "available", label: "Available Opportunities" },
      //     { id: "apply-bazaar", label: "Apply for Bazaar" },
      //     { id: "apply-booth", label: "Apply for Booth" },
      //     { id: "my-applications", label: "My Applications" },
      //   ],
      // },
    ],
  },
};

export default function EntityNavigation({
  children,
  headerTitle,
  userRole = "student",
}: EntityNavigationProps) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0] || "en";
  const entity = segments[1] || "";
  const tab = segments[2] || ""; // This is now the main tab/page
  const section = segments[3] || ""; // This is now the sidebar section

  const config: RoleConfig =
    roleNavigationConfig[userRole] ?? roleNavigationConfig["student"];

  // Get tab configuration
  const tabItems: TabItem[] = config.tabs;
  const tabKeys: string[] = tabItems.map((t) => t.key);
  const tabLabels: string[] = tabItems.map((t) => t.label);
  const activeTabIndex =
    tabKeys.length > 0 ? Math.max(0, tabKeys.indexOf(tab)) : -1;

  // Get sections for current tab
  const currentTab = tabItems.find((t) => t.key === tab);
  const sectionItems = currentTab?.sections || [];

  const handleTabChange = (index: number) => {
    if (tabKeys.length === 0) return;

    const tabKey = tabKeys[index];
    const base = `/${locale}`;
    const entitySeg = entity ? `/${entity}` : "";

    // If the new tab has sections, navigate to first section
    const newTab = tabItems[index];
    const sectionSeg =
      newTab?.sections && newTab.sections.length > 0
        ? `/${newTab.sections[0].id}`
        : "";

    router.push(`${base}${entitySeg}/${tabKey}${sectionSeg}`);
  };

  const handleSectionClick = (id: string) => {
    const base = `/${locale}`;
    const entitySeg = entity ? `/${entity}` : "";
    const tabSeg = tab ? `/${tab}` : "";
    router.push(`${base}${entitySeg}${tabSeg}/${id}`);
  };

  // If user visits only `/:locale/:entity` (no tab), redirect to defaultTab/defaultSection
  React.useEffect(() => {
    // Only run when we have an entity but no tab
    if (!entity) return;
    if (tab) return; // tab exists, no redirect needed

    const defaultTab = config.defaultTab;
    const defaultSection = config.defaultSection;
    if (!defaultTab) return;

    const base = `/${locale}`;
    const entitySeg = `/${entity}`;
    const sectionSeg = defaultSection ? `/${defaultSection}` : "";

    // use replace to avoid creating history entry
    router.replace(`${base}${entitySeg}/${defaultTab}${sectionSeg}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity, tab, locale, userRole]);

  // If user visits a tab with sections but no section specified, redirect to first section
  React.useEffect(() => {
    if (!entity || !tab) return;

    // Check if current tab has sections
    if (sectionItems.length > 0 && !section) {
      const base = `/${locale}`;
      const entitySeg = `/${entity}`;
      const tabSeg = `/${tab}`;
      const firstSection = sectionItems[0].id;

      router.replace(`${base}${entitySeg}${tabSeg}/${firstSection}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity, tab, section, sectionItems, locale]);

  const headerProps = {
    title: headerTitle ?? config.headerTitle,
    showBack: true,
    onBack: () => router.back(),
    leftIcon: config.icon,
  };

  return (
    <div className="flex flex-col h-screen bg-">
      {/* Top Navigation - spans full width */}
      <TopNavigation companyName="Multaqa" header={headerProps} />

      {/* Tabs Section - main navigation tabs */}
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

      {/* Sidebar and main content below */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        <SidebarNavigation
          activeItem={section}
          onItemClick={handleSectionClick}
          sectionItems={sectionItems}
        />

        <div className="flex-1 overflow-auto bg-[#f9fbfc] min-h-0 p-4">
           <div className="flex-1 bg-white min-h-0"  style={{borderRadius:"16px",boxShadow:"0 1px 3px rgba(0, 0, 0, 0.08)",  padding: "20px 28px",  border: "1px solid #e5e7eb"}}>{children}</div>
           </div>
      </div>
    </div>
  );
}
