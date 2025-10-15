import React from "react";
import { LogOut } from "lucide-react";
import CustomButton from "@/components/shared/Buttons/CustomButton";

interface SectionItem {
  id: string;
  label: string;
}

interface SidebarNavigationProps {
  activeItem?: string;
  onItemClick?: (id: string) => void;
  sectionItems?: SectionItem[];
  onLogout?: () => void;
}

export default function SidebarNavigation({
  activeItem = "",
  onItemClick,
  sectionItems = [],
  onLogout,
}: SidebarNavigationProps) {
  return (
    <div className="w-[280px] bg-[#f9fbfc] h-full flex flex-col p-4 overflow-y-auto">
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

      {/* Logout Button */}
      {onLogout && (
        <div className="mt-auto pt-4 border-t border-[#b2cee2]">
          <CustomButton
            width="100%"
            variant="contained"
            color="error"
            size="medium"
            onClick={onLogout}
            startIcon={<LogOut size={18} />}
            sx={{
              width: "100%",
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              fontWeight: 500,
              textTransform: "none",
              fontSize: "0.875rem",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.3s ease-in-out",
            }}
          >
            Logout
          </CustomButton>
        </div>
      )}
    </div>
  );
}
