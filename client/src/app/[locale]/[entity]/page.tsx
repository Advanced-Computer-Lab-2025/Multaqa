"use client";

import EntityNavigation from "@/components/layout/EntityNavigation";
import FormCard from "@/components/layout/FormCard";

export default function ManageApprovalsPage() {
  return (
    <EntityNavigation headerTitle="Manage Approvals">
      <div className="p-6 bg-white">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-semibold text-[#1E1E1E] mb-6 font-heading">Forms</h2>
          
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
      </div>
    </EntityNavigation>
  );
}