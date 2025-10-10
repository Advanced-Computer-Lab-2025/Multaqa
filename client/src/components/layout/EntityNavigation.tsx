import React from "react";
import SidebarNavigation from "./SidebarNavigation";
import TopNavigation from "./TopNavigation";
import { usePathname, useRouter } from "next/navigation";
import { Folder } from 'lucide-react';

interface EntityNavigationProps {
  children?: React.ReactNode;
  headerTitle?: string; // optional page-specific title
}

export default function EntityNavigation({ children, headerTitle }: EntityNavigationProps) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0] || "en";
  const entity = segments[1] || "";
  const tab = segments[2] || "company"; // slug
  const item = segments[3] || "forms";

  // Tab slugs and labels
  const tabSlugs = ['templates', 'company', 'public'];
  const tabLabels = ['Templates', 'Company', 'Public'];

  const activeTabIndex = Math.max(0, tabSlugs.indexOf(tab));

  const handleTabChange = (index: number) => {
    const tabKey = tabSlugs[index] || 'company';
    const base = `/${locale}`;
    const entitySeg = entity ? `/${entity}` : '';
    const itemSeg = item ? `/${item}` : '';
    router.push(`${base}${entitySeg}/${tabKey}${itemSeg}`);
  };

  const handleItemClick = (id: string) => {
    const base = `/${locale}`;
    const entitySeg = entity ? `/${entity}` : '';
    const tabSeg = tab ? `/${tab}` : '';
    router.push(`${base}${entitySeg}${tabSeg}/${id}`);
  };

  // Provide header props to TopNavigation so header + tabs span full width
  const headerProps = {
    title: headerTitle ?? 'Manage Approvals',
    showBack: true,
    onBack: () => router.back(),
    leftIcon: <Folder size={32} className="text-gray-500" />,
    tabs: tabLabels,
    activeTabIndex,
    onTabChange: handleTabChange,
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#e6e6da]">
      {/* Top Navigation spans full width and renders header/tabs */}
      <TopNavigation companyName="" header={headerProps} />

      {/* Sidebar and main content sit below top nav */}
      <div className="flex flex-1 overflow-hidden">
        <SidebarNavigation 
          activeItem={item}
          onItemClick={handleItemClick}
        />

        <div className="flex-1 overflow-auto bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};