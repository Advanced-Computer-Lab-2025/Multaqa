import React, { useState } from "react";
import SidebarNavigation from "./SidebarNavigation";
import TopNavigation from "./TopNavigation";

interface EntityNavigationProps {
  children?: React.ReactNode;
}

export default function EntityNavigation({ children }: EntityNavigationProps) {
  const [activeItem, setActiveItem] = useState<string>('forms');

  return (
    <div className="flex flex-col h-screen bg-[#e6e6da]">
      {/* Top Navigation spans full width */}
      <TopNavigation />
      
      {/* Sidebar and main content sit below top nav */}
      <div className="flex flex-1 overflow-hidden">
        <SidebarNavigation 
          activeItem={activeItem}
          onItemClick={setActiveItem}
        />
        <div className="flex-1 overflow-auto bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}