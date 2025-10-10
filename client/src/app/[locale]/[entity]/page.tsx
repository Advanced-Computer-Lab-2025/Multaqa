"use client";

import EntityNavigation from "@/components/layout/EntityNavigation";
import FormCard from "@/components/layout/FormCard";
import { usePathname } from 'next/navigation';

export default function ManageApprovalsPage() {
  const pathname = usePathname() || '';
  const segments = pathname.split('/').filter(Boolean);
  const currentTab = segments[2] || 'company';

  // tabs order mapping and current active index derived from URL
  const tabKeys = ['templates', 'company', 'public'];
  const activeTab = Math.max(0, tabKeys.indexOf(currentTab));

  return (
    <EntityNavigation>
      <div className="bg-white min-h-full p-6">
          {activeTab === 0 && (
            <div>
              <p className="text-gray-600">Templates Content</p>
            </div>
          )}

          {activeTab === 1 && (
            <div className="max-w-4xl">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Forms</h2>
              
              <div className="space-y-4">
                <FormCard
                  title="Transfer Document"
                  createdDate="September 5 2024"
                  status="Live"
                />
                
                <FormCard
                  title="Completion Report"
                  createdDate="September 5 2024"
                  status="Live"
                />
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div>
              <p className="text-gray-600">Public Content</p>
            </div>
          )}
      </div>
    </EntityNavigation>
  );
};