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
    <div className="w-[280px] bg-white border-r border-gray-300 h-full flex flex-col p-4 overflow-y-auto">
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
                      ? "bg-[#3a4f99] text-white font-semibold shadow-md"
                      : "text-[#1E1E1E] hover:bg-[#b2cee2] hover:shadow-sm hover:scale-[1.02]"
                  }`}
                  style={{
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Labels Section at bottom */}
      <div className="mt-auto pt-4 border-t border-gray-300">
        <div className="flex justify-between items-center mb-2 px-2">
          <p className="text-xs font-semibold text-[#6299d0] tracking-wider font-heading">
            LABELS
          </p>
          <IconButton
            size="small"
            sx={{
              color: "#6299d0",
              padding: "4px",
              "&:hover": {
                backgroundColor: "#b2cee2",
                transform: "scale(1.1)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <Plus size={14} />
          </IconButton>
        </div>

        <button
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-[#1E1E1E] hover:bg-[#b2cee2] hover:shadow-sm hover:scale-[1.02] font-sans"
          style={{
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div className="flex items-center gap-3">
            <Tag size={20} className="text-amber-500" />
            <span className="text-sm">Recent Hires</span>
          </div>
          <IconButton
            size="small"
            sx={{
              color: "#6299d0",
              padding: "2px",
              "&:hover": {
                backgroundColor: "transparent",
                transform: "scale(1.2)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <MoreHorizontal size={16} />
          </IconButton>
        </button>
      </div>
    </div>
  );
}
