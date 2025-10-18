import React from "react";
import { IconButton } from "@mui/material";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  leftIcon?: React.ReactNode;
  tabs?: string[];
  activeTabIndex?: number;
  onTabChange?: (index: number) => void;
}

interface TopNavigationProps {
  companyName?: string;
  header?: HeaderProps;
}

export default function TopNavigation({
  companyName = "Acme Corp",
  header,
}: TopNavigationProps) {
  return (
    <div className="bg-white border-b border-gray-300 w-full">
      {/* Company/App Bar with Back Button */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-gray-200 bg-gradient-to-r from-[#f9fbfc] to-[#f0f4f8]">
        {/* Left: Back Button (if applicable) */}
        <div className="flex items-center gap-3">
          {header?.showBack && (
            <IconButton
              onClick={header.onBack}
              sx={{
                color: "#6299d0",
                backgroundColor: "rgba(98, 153, 208, 0.1)",
                "&:hover": {
                  backgroundColor: "#e5ed6f",
                  transform: "scale(1.08) translateX(-2px)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                width: 36,
                height: 36,
              }}
            >
              <ArrowLeft size={20} />
            </IconButton>
          )}
          {/* {header?.leftIcon && (
            <div className="flex items-center justify-center">
              {header.leftIcon}
            </div>
          )} */}
        </div>

        {/* Center: Company Name */}
        <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
          <span className="text-2xl font-heading font-bold text-[#6299d0] tracking-wide">
            {companyName}
          </span>
        </div>

        {/* Right: Placeholder for user menu (future) */}
        <div className="w-9" />
      </div>

      {/* Tabs Section */}
      {header && header.tabs && header.tabs.length > 0 && (
        <div className="border-t border-gray-200 bg-white">
          <div className="flex gap-1 px-6">
            {header.tabs.map((tab, index) => {
              const isActive = header.activeTabIndex === index;
              return (
                <button
                  key={index}
                  onClick={() => header.onTabChange?.(index)}
                  className={`py-3 px-6 text-sm font-medium font-heading transition-all relative ${
                    isActive
                      ? "text-[#6299d0] font-bold"
                      : "text-gray-600 hover:text-[#6299d0]"
                  }`}
                  style={{
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {tab}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6299d0] to-[#4a7ba7]"
                      style={{
                        boxShadow: "0 -1px 3px rgba(98, 153, 208, 0.4)",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
