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
      <div className="flex items-center gap-4 px-4 h-16 border-b border-gray-200">
        <IconButton 
          sx={{ 
            color: '#1E1E1E',
            '&:hover': {
              backgroundColor: '#f5f5f5',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Menu size={24} />
        </IconButton>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
            🌟
          </div>
          <span className="text-lg font-heading font-semibold text-[#1E1E1E]">{companyName}</span>
          <IconButton 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            sx={{ 
              color: '#6299d0',
              position: 'relative',
              '&:hover': {
                backgroundColor: '#f5f5f5',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <ChevronDown size={20} />
            {isMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button className="w-full px-4 py-2 text-left text-sm font-sans hover:bg-[#b2cee2] hover:text-[#1E1E1E] transition-all">
                  Switch Company
                </button>
                <button className="w-full px-4 py-2 text-left text-sm font-sans hover:bg-[#b2cee2] hover:text-[#1E1E1E] transition-all">
                  Settings
                </button>
              </div>
            )}
          </IconButton>
        </div>
      </div>

      {/* Page Header with Tabs */}
      {header && (
        <div className="w-full">
          {/* Title Section */}
          <div className="flex items-center gap-4 px-6 pt-6 pb-4">
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
                <ArrowLeft size={24} />
              </IconButton>
            )}
            {header.leftIcon && (
              <div className="flex items-center justify-center">
                {header.leftIcon}
              </div>
            )}
            <h1 className="text-2xl font-semibold text-[#1E1E1E] font-heading">
              {header.title}
            </h1>
          </div>

          {/* Tabs Section */}
          {header.tabs && header.tabs.length > 0 && (
            <div className="border-b border-gray-300 px-6">
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