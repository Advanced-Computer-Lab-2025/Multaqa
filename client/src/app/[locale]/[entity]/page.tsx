"use client";

import { useState } from "react";
import EntityNavigation from "@/components/layout/EntityNavigation";
import Tabs from "@/components/layout/Tabs";
import FormCard from "@/components/layout/FormCard";
import { ArrowLeft, Folder } from 'lucide-react';

export default function ManageApprovalsPage() {
const [activeTab, setActiveTab] = useState<number>(1);

  return (
    <EntityNavigation>
      <div className="bg-white min-h-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4 mb-6">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <Folder size={32} className="text-gray-500" />
            <h1 className="text-2xl font-semibold text-gray-900">Manage Approvals</h1>
          </div>

          <Tabs 
            tabs={['Templates', 'Company', 'Public']}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <div className="p-6">
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
      </div>
    </EntityNavigation>
  );
};