import React, { useState } from 'react';
import { 
  Menu, 
  ChevronDown, 
} from 'lucide-react';

interface TopNavigationProps {
  companyName?: string;
}

export default function TopNavigation({ companyName = "Acme Corp" }: TopNavigationProps) {
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
    </div>
  );
};