import React from "react";
import SidebarNavigation from "./SidebarNavigation";
import TopNavigation from "./TopNavigation";
import { usePathname, useRouter } from "next/navigation";
import { Folder } from 'lucide-react';

interface EntityNavigationProps {
  children?: React.ReactNode;
  headerTitle?: string;
}

export default function EntityNavigation({ children, headerTitle }: EntityNavigationProps) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0] || "en";
  const entity = segments[1] || "";
  const tab = segments[2] || "company";
  const item = segments[3] || "forms";

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

  const headerProps = {
    title: headerTitle ?? 'Manage Approvals',
    showBack: true,
    onBack: () => router.back(),
    leftIcon: <Folder size={32} className="text-[#6299d0]" />,
    tabs: tabLabels,
    activeTabIndex,
    onTabChange: handleTabChange,
  };

  return (
    <div className="flex flex-col h-screen bg-[#e6e6da]">
      {/* Top Navigation with header and tabs - spans full width */}
      <TopNavigation companyName="Acme Corp" header={headerProps} />

      {/* Sidebar and main content below */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        <SidebarNavigation 
          activeItem={item}
          onItemClick={handleItemClick}
        />

        <div className="flex-1 overflow-auto bg-white min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
}