import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Plus, 
  MoreHorizontal,
  Tag,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface SubItem {
  id: string;
  label: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  subItems?: SubItem[];
}

interface SidebarNavigationProps {
  activeItem?: string;
  onItemClick?: (id: string) => void;
  items?: MenuItem[];
}

export default function SidebarNavigation({ 
  activeItem = "forms", 
  onItemClick,
  items = []
}: SidebarNavigationProps) {
  const pathname = usePathname() || '';
  const router = useRouter();
  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0] || 'en';
  const entity = segments[1] || '';
  
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Group items by section if needed (for MENU, ADMIN sections)
  const menuItems = items.filter(item => 
    !['role-assignment', 'activity-logs', 'settings'].includes(item.id)
  );

  return (
    <div className="w-[280px] bg-[#e6e6da] border-r border-gray-300 h-full flex flex-col p-4 overflow-y-auto">
      <div className="mb-4 flex-1">
        <p className="text-xs font-semibold text-[#6299d0] tracking-wider mb-3 px-2 font-heading">MENU</p>
        
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            const isExpanded = expandedItems.has(item.id);
            const hasSubItems = item.subItems && item.subItems.length > 0;

            return (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (hasSubItems) {
                      toggleExpand(item.id);
                    } else {
                      onItemClick?.(item.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all font-sans ${
                    isActive
                      ? 'bg-[#3a4f99] text-white font-semibold shadow-md' 
                      : 'text-[#1E1E1E] hover:bg-[#b2cee2] hover:shadow-sm hover:scale-[1.02]'
                  }`}
                  style={{
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {hasSubItems && (
                    isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                  )}
                </button>

                {/* Sub-items */}
                {hasSubItems && isExpanded && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.subItems!.map((subItem) => {
                      const isSubActive = activeItem === subItem.id;
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => onItemClick?.(subItem.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all font-sans text-sm ${
                            isSubActive
                              ? 'bg-[#3a4f99] text-white font-semibold shadow-md'
                              : 'text-[#1E1E1E] hover:bg-[#b2cee2] hover:shadow-sm'
                          }`}
                          style={{
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                        >
                          {subItem.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Labels Section at bottom */}
      <div className="mt-auto pt-4 border-t border-gray-300">
        <div className="flex justify-between items-center mb-2 px-2">
          <p className="text-xs font-semibold text-[#6299d0] tracking-wider font-heading">LABELS</p>
          <IconButton 
            size="small"
            sx={{ 
              color: '#6299d0',
              padding: '4px',
              '&:hover': {
                backgroundColor: '#b2cee2',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <Plus size={14} />
          </IconButton>
        </div>
        
        <button 
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-[#1E1E1E] hover:bg-[#b2cee2] hover:shadow-sm hover:scale-[1.02] font-sans"
          style={{
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className="flex items-center gap-3">
            <Tag size={20} className="text-amber-500" />
            <span className="text-sm">Recent Hires</span>
          </div>
          <IconButton 
            size="small"
            sx={{ 
              color: '#6299d0',
              padding: '2px',
              '&:hover': {
                backgroundColor: 'transparent',
                transform: 'scale(1.2)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <MoreHorizontal size={16} />
          </IconButton>
        </button>
      </div>
    </div>
  );
}