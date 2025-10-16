import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { 
  Menu, 
  ChevronDown,
  ArrowLeft,
} from 'lucide-react';

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

export default function TopNavigation({ companyName = "Acme Corp", header }: TopNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-white border-b border-gray-300 w-full">
      {/* Company/App Bar */}
      <div className="flex items-center gap-4 px-4 h-14 border-b justify-center border-gray-200 bg-[#f9fbfc]">
        <div className="flex items-center gap-2" >
          <span className="text-lg font-heading font-semibold text-[#1E1E1E]">{companyName}</span>
        </div>
      </div>

      {/* Page Header with Tabs */}
      {header && (
        <div className="w-full">
          {/* Title Section */}
          <div className="flex items-center gap-4 px-4 pt-4 pb-4">
            {header.showBack && (
              <IconButton 
                onClick={header.onBack}
                sx={{ 
                  color: '#6299d0',
                  '&:hover': {
                    backgroundColor: '#b2cee2',
                    transform: 'scale(1.05) rotate(-5deg)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <ArrowLeft size={20} />
              </IconButton>
            )}
            {header.leftIcon && (
              <div className="flex items-center justify-center">
                {header.leftIcon}
              </div>
            )}
            <h1 className="text-xl font-semibold text-[#1E1E1E] font-heading">
              {header.title}
            </h1>
          </div>

          {/* Tabs Section */}
          {header.tabs && header.tabs.length > 0 && (
            <div className="border-b border-gray-900 px-6">
              <div className="flex gap-8">
                {header.tabs.map((tab, index) => {
                  const isActive = header.activeTabIndex === index;
                  return (
                    <button
                      key={index}
                      onClick={() => header.onTabChange?.(index)}
                      className={`py-3 px-1 text-sm font-medium border-b-2 font-heading transition-all ${
                        isActive
                          ? 'border-[#6299d0] text-[#1E1E1E] font-semibold scale-105'
                          : 'border-transparent text-[#6299d0] hover:text-[#598bbd] hover:border-[#b2cee2] hover:scale-102'
                      }`}
                      style={{
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}