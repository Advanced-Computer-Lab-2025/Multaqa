import React from 'react';
import { 
  FileText, 
  CheckCircle, 
  Settings, 
  Edit, 
  Plus, 
  MoreHorizontal,
  Tag,
} from 'lucide-react';

interface SidebarNavigationProps {
  activeItem?: string;
  onItemClick?: (id: string) => void;
}

export default function SidebarNavigation({ activeItem = "forms", onItemClick }: SidebarNavigationProps) {
  const menuItems = [
    { id: 'forms', label: 'Forms', icon: FileText },
    { id: 'request', label: 'Request & Approvals', icon: CheckCircle },
    { id: 'system', label: 'System Forms', icon: Settings },
  ];

  const actionItems = [
    { id: 'fill', label: 'Fill A form', icon: Edit }
  ];

  return (
    <div className="w-[280px] bg-[#fafafa] border-r border-gray-200 h-full flex flex-col p-4">
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 tracking-wider mb-2 px-2">MENU</p>
        
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onItemClick?.(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  (activeItem === item.id) 
                    ? 'bg-[#3a3a3a] text-white font-semibold' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {actionItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onItemClick?.(item.id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-gray-700 hover:bg-gray-100 mb-4"
          >
            <Icon size={20} />
            <span className="text-sm">{item.label}</span>
          </button>
        );
      })}

      <div className="mt-auto">
        <div className="flex justify-between items-center mb-2 px-2">
          <p className="text-xs font-semibold text-gray-500 tracking-wider">LABELS</p>
          <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800">
            <Plus size={14} />
            Add
          </button>
        </div>
        
        <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-gray-700 hover:bg-gray-100">
          <div className="flex items-center gap-3">
            <Tag size={20} className="text-amber-500" />
            <span className="text-sm">Recent Hires</span>
          </div>
          <MoreHorizontal size={16} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
};