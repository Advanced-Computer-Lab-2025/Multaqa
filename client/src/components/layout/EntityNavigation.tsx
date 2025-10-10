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
  Award
} from 'lucide-react';

interface EntityNavigationProps {
  children?: React.ReactNode;
  headerTitle?: string;
  userRole?: 'student' | 'staff' | 'ta' | 'professor' | 'events-office' | 'admin' | 'vendor';
}

// Role-based navigation configuration
type RoleConfig = {
  headerTitle: string;
  icon: React.ReactNode;
  tabs?: TabItem[];
  defaultPage?: string;
  defaultTab?: string;
  sidebarItems: SidebarItem[];
};

type TabItem = { key: string; label: string };

type SubItem = { id: string; label: string };
type SidebarItem = { id: string; label: string; icon: React.ElementType; subItems?: SubItem[] };

const roleNavigationConfig: Record<string, RoleConfig> = {
  student: {
    headerTitle: 'Student Portal',
    icon: <User size={32} className="text-[#6299d0]" />,
    tabs: [],
    defaultPage: 'events',
    defaultTab: '',
    sidebarItems: [
      { id: 'profile', label: 'My Profile', icon: User },
      { id: 'events', label: 'Events', icon: Calendar, subItems: [
        { id: 'browse-events', label: 'Browse Events' },
        { id: 'my-registered', label: 'My Registered Events' },
        { id: 'favorites', label: 'My Favorites' }
      ]},
      { id: 'courts', label: 'Courts Booking', icon: Trophy },
      { id: 'gym', label: 'Gym Sessions', icon: Dumbbell, subItems: [
        { id: 'browse-sessions', label: 'Browse Sessions' },
        { id: 'my-sessions', label: 'My Registered Sessions' }
      ]},
      { id: 'vendors', label: 'Vendors', icon: Store }
    ]
  },
  staff: {
    headerTitle: 'Staff Portal',
    icon: <User size={32} className="text-[#6299d0]" />,
    tabs: [],
    defaultPage: 'events',
    defaultTab: '',
    sidebarItems: [
      { id: 'profile', label: 'My Profile', icon: User },
      { id: 'events', label: 'Events', icon: Calendar, subItems: [
        { id: 'browse-events', label: 'Browse Events' },
        { id: 'my-registered', label: 'My Registered Events' },
        { id: 'favorites', label: 'My Favorites' },
        { id: 'my-ratings', label: 'My Ratings & Comments' }
      ]},
      { id: 'courts', label: 'Courts Booking', icon: Trophy },
      { id: 'gym', label: 'Gym Sessions', icon: Dumbbell, subItems: [
        { id: 'browse-sessions', label: 'Browse Sessions' },
        { id: 'my-sessions', label: 'My Registered Sessions' }
      ]},
      { id: 'vendors', label: 'Vendors', icon: Store }
    ]
  },
  ta: {
    headerTitle: 'TA Portal',
    icon: <User size={32} className="text-[#6299d0]" />,
    tabs: [],
    defaultPage: 'events',
    defaultTab: '',
    sidebarItems: [
      { id: 'profile', label: 'My Profile', icon: User },
      { id: 'events', label: 'Events', icon: Calendar, subItems: [
        { id: 'browse-events', label: 'Browse Events' },
        { id: 'my-registered', label: 'My Registered Events' },
        { id: 'favorites', label: 'My Favorites' },
        { id: 'my-ratings', label: 'My Ratings & Comments' }
      ]},
      { id: 'courts', label: 'Courts Booking', icon: Trophy },
      { id: 'gym', label: 'Gym Sessions', icon: Dumbbell, subItems: [
        { id: 'browse-sessions', label: 'Browse Sessions' },
        { id: 'my-sessions', label: 'My Registered Sessions' }
      ]},
      { id: 'vendors', label: 'Vendors', icon: Store }
    ]
  },
  professor: {
    headerTitle: 'Professor Portal',
    icon: <User size={32} className="text-[#6299d0]" />,
    tabs: [],
    defaultPage: 'workshops',
    defaultTab: 'create-workshop',
    sidebarItems: [
      { id: 'profile', label: 'My Profile', icon: User },
      { id: 'events', label: 'Events', icon: Calendar, subItems: [
        { id: 'browse-events', label: 'Browse Events' },
        { id: 'my-registered', label: 'My Registered Events' },
        { id: 'favorites', label: 'My Favorites' },
        { id: 'my-ratings', label: 'My Ratings & Comments' }
      ]},
      { id: 'workshops', label: 'My Workshops', icon: FileText, subItems: [
        { id: 'create-workshop', label: 'Create Workshop' },
        { id: 'draft', label: 'Draft' },
        { id: 'submitted', label: 'Submitted' },
        { id: 'accepted', label: 'Accepted' },
        { id: 'rejected', label: 'Rejected' }
      ]},
      { id: 'courts', label: 'Courts Booking', icon: Trophy },
      { id: 'gym', label: 'Gym Sessions', icon: Dumbbell, subItems: [
        { id: 'browse-sessions', label: 'Browse Sessions' },
        { id: 'my-sessions', label: 'My Registered Sessions' }
      ]},
      { id: 'vendors', label: 'Vendors', icon: Store }
    ]
  },
  'events-office': {
    headerTitle: 'Events Office',
    icon: <Calendar size={32} className="text-[#6299d0]" />,
    tabs: [
      { key: 'all-events', label: 'All Events' },
      { key: 'workshops', label: 'Workshops' },
      { key: 'trips', label: 'Trips' },
      { key: 'bazaars', label: 'Bazaars' },
      { key: 'booths', label: 'Booths' },
      { key: 'conferences', label: 'Conferences' },
    ],
  defaultPage: 'dashboard',
  defaultTab: '',
  sidebarItems: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'events', label: 'Events Management', icon: Calendar, subItems: [
        { id: 'all-events', label: 'All Events' },
        { id: 'create-event', label: 'Create Event' },
        { id: 'event-details', label: 'Event Details' }
      ]},
      { id: 'workshop-requests', label: 'Workshop Requests', icon: FileText, subItems: [
        { id: 'pending', label: 'Pending' },
        { id: 'accepted', label: 'Accepted' },
        { id: 'rejected', label: 'Rejected' }
      ]},
      { id: 'vendors', label: 'Vendor Management', icon: Store, subItems: [
        { id: 'all-vendors', label: 'All Vendors' },
        { id: 'participation-requests', label: 'Participation Requests' },
        { id: 'loyalty-partners', label: 'Loyalty Program Partners' },
        { id: 'documents', label: 'View Documents' }
      ]},
      { id: 'reports', label: 'Reports', icon: BarChart3, subItems: [
        { id: 'attendee-reports', label: 'Attendee Reports' },
        { id: 'sales-reports', label: 'Sales Reports' }
      ]},
      { id: 'gym', label: 'Gym Management', icon: Dumbbell, subItems: [
        { id: 'all-sessions', label: 'All Sessions' },
        { id: 'create-session', label: 'Create Session' },
        { id: 'vendor-polls', label: 'Create Vendor Polls' }
      ]},
      { id: 'archive', label: 'Archive', icon: Archive },
      { id: 'notifications', label: 'Notifications', icon: ClipboardList }
    ]
  },
  admin: {
    headerTitle: 'Admin Panel',
    icon: <Settings size={32} className="text-[#6299d0]" />,
    tabs: [
      { key: 'students', label: 'Students' },
      { key: 'staff', label: 'Staff' },
      { key: 'tas', label: 'TAs' },
      { key: 'professors', label: 'Professors' },
      { key: 'vendors', label: 'Vendors' },
      { key: 'events-office', label: 'Events Office' },
    ],
  defaultPage: 'dashboard',
  defaultTab: '',
  sidebarItems: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'users', label: 'User Management', icon: Users, subItems: [
        { id: 'all-users', label: 'All Users' },
        { id: 'create-account', label: 'Create Account' },
        { id: 'block-users', label: 'Block/Unblock Users' },
        { id: 'user-details', label: 'View User Details' }
      ]},
      { id: 'role-assignment', label: 'Role Assignment', icon: ClipboardList },
      { id: 'events-office', label: 'Event Office Accounts', icon: Calendar, subItems: [
        { id: 'create-eo-account', label: 'Create Account' },
        { id: 'delete-eo-account', label: 'Delete Account' }
      ]},
      { id: 'activity-logs', label: 'Activity Logs', icon: FileText },
      { id: 'settings', label: 'System Settings', icon: Settings }
    ]
  },
  vendor: {
    headerTitle: 'Vendor Portal',
    icon: <Store size={32} className="text-[#6299d0]" />,
    tabs: [
      { key: 'bazaars', label: 'Bazaars' },
      { key: 'booths', label: 'Booths' },
    ],
  defaultPage: 'opportunities',
  defaultTab: 'available',
  sidebarItems: [
      { id: 'profile', label: 'My Profile', icon: User, subItems: [
        { id: 'company-details', label: 'Company Details' },
        { id: 'documents', label: 'Upload Documents' },
        { id: 'verification', label: 'Verification Status' }
      ]},
      { id: 'opportunities', label: 'Bazaars & Booths', icon: Store, subItems: [
        { id: 'available', label: 'Available Opportunities' },
        { id: 'apply-bazaar', label: 'Apply for Bazaar' },
        { id: 'apply-booth', label: 'Apply for Booth' },
        { id: 'my-applications', label: 'My Applications' }
      ]},
      { id: 'participation', label: 'My Participation', icon: Calendar, subItems: [
        { id: 'upcoming', label: 'Upcoming' },
        { id: 'past', label: 'Past' },
        { id: 'registered-visitors', label: 'Registered Visitors' }
      ]},
      { id: 'payments', label: 'Payments', icon: CreditCard, subItems: [
        { id: 'payment-history', label: 'Payment History' },
        { id: 'receipts', label: 'Receipts' },
        { id: 'refunds', label: 'Refund Status' }
      ]},
      { id: 'qr-codes', label: 'QR Codes', icon: QrCode },
      { id: 'loyalty', label: 'Loyalty Program', icon: Award, subItems: [
        { id: 'program-status', label: 'Program Status' },
        { id: 'discount-rates', label: 'Discount Rates' },
        { id: 'partners', label: 'View Partners' }
      ]},
      { id: 'notifications', label: 'Notifications', icon: ClipboardList }
    ]
  }
};

export default function EntityNavigation({ 
  children, 
  headerTitle,
  userRole = 'student' 
}: EntityNavigationProps) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0] || "en";
  const entity = segments[1] || "";
  const page = segments[2] || "";
  // ensure tab is typed as string (may be undefined)
  const tab: string = segments[3] || "";

  const config: RoleConfig = roleNavigationConfig[userRole] ?? roleNavigationConfig['student'];
  // Map TabItem[] into keys (used in routing) and labels (displayed in UI)
  const tabItems: TabItem[] = config.tabs ?? [];
  const tabKeys: string[] = tabItems.map(t => t.key);
  const tabLabels: string[] = tabItems.map(t => t.label);
  const activeTabIndex = tabKeys.length > 0 ? Math.max(0, tabKeys.indexOf(tab)) : -1;

  const handleTabChange = (index: number) => {
    if (tabLabels.length === 0) return;
    
  const tabKey = tabKeys[index] || tabKeys[0];
    const base = `/${locale}`;
    const entitySeg = entity ? `/${entity}` : '';
    const pageSeg = page ? `/${page}` : '';
    router.push(`${base}${entitySeg}${pageSeg}/${tabKey}`);
  };

  const handleItemClick = (id: string) => {
    const base = `/${locale}`;
    const entitySeg = entity ? `/${entity}` : '';
    const tabSeg = tab ? `/${tab}` : '';
    router.push(`${base}${entitySeg}/${id}${tabSeg}`);
  };

  // If user visits only `/:locale/:entity` (no page), redirect to defaultPage/defaultTab
  React.useEffect(() => {
    // Only run when we have an entity but no page
    if (!entity) return;
    if (page) return; // page exists, no redirect needed

  const defaultPage = config.defaultPage;
  const defaultTab = config.defaultTab;
    if (!defaultPage) return;

    const base = `/${locale}`;
    const entitySeg = `/${entity}`;
    const tabSeg = defaultTab ? `/${defaultTab}` : '';

    // use replace to avoid creating history entry
    router.replace(`${base}${entitySeg}/${defaultPage}${tabSeg}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity, page, locale, userRole]);

  const headerProps = {
    title: headerTitle ?? config.headerTitle,
    showBack: true,
    onBack: () => router.back(),
    leftIcon: config.icon,
  };

  return (
    <div className="flex flex-col h-screen bg-[#e6e6da]">
      {/* Top Navigation - spans full width */}
      <TopNavigation companyName="Multaqa" header={headerProps} />

      {/* Tabs Section - if role has tabs */}
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
          activeItem={page}
          onItemClick={handleItemClick}
          items={config.sidebarItems}
        />

        <div className="flex-1 overflow-auto bg-white min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
}