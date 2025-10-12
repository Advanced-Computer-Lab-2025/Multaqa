import React from "react";
import { IconButton } from "@mui/material";
import { Plus, MoreHorizontal, Tag } from "lucide-react";

interface SectionItem {
  id: string;
  label: string;
}

interface SidebarNavigationProps {
  activeItem?: string;
  onItemClick?: (id: string) => void;
  sectionItems?: SectionItem[];
}

export default function SidebarNavigation({
  activeItem = "",
  onItemClick,
  sectionItems = [],
}: SidebarNavigationProps) {
  return (
    <div className="w-[240px] bg-[#f9fbfc]  h-full flex flex-col p-4 overflow-y-auto">
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
    </div>
  );
}
