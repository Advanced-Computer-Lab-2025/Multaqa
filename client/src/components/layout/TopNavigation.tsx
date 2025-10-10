import React, { useState } from 'react';
import { 
  Menu, 
  ChevronDown, 
} from 'lucide-react';

interface TopNavigationProps {
  companyName?: string;
  // optional header area (back + icon + title + tabs)
  header?: {
    title?: string;
    showBack?: boolean;
    onBack?: () => void;
    leftIcon?: React.ReactNode;
    tabs?: string[];
    activeTabIndex?: number;
    onTabChange?: (index: number) => void;
  };
}

export default function TopNavigation({ companyName = "Acme Corp", header }: TopNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex items-center gap-4 px-4 h-16">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Menu size={24} className="text-gray-700" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            🌟
          </div>
          <span className="text-lg font-semibold text-gray-800">{companyName}</span>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 hover:bg-gray-100 rounded transition-colors relative"
          >
            <ChevronDown size={20} className="text-gray-600" />
            {isMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">Switch Company</button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">Settings</button>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Optional header (back + icon + title + tabs) */}
      {header && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4 mb-6">
            {header.showBack ? (
              <button onClick={header.onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                {/* simple left arrow - keep it neutral to avoid an extra dependency here */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-gray-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            ) : null}

            {header.leftIcon ?? null}

            <h1 className="text-2xl font-semibold text-gray-900">{header.title}</h1>
          </div>

          {header.tabs && header.onTabChange !== undefined && (
            <div className="border-b border-gray-200">
              <div className="flex gap-8">
                {header.tabs.map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => header.onTabChange?.(index)}
                    className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                      header.activeTabIndex === index
                        ? 'border-[#6299d0] text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};