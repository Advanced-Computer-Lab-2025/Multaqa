import React from 'react';

interface TabsProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-300">
      <div className="flex gap-8">
        {tabs.map((tab, index) => {
          const isActive = activeTab === index;
          return (
            <button
              key={index}
              onClick={() => onTabChange(index)}
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
  );
};

export default Tabs;