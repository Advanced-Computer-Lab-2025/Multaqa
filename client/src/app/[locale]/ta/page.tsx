"use client";

import EntityNavigation from "@/components/layout/EntityNavigation";

export default function TaHomePage() {
  return (
    <EntityNavigation userRole="ta">
      <div className="p-6 bg-white">
        <h1 className="text-2xl font-semibold mb-4">TA Portal (Dummy)</h1>
        <p className="text-sm text-gray-600">Placeholder content for TAs.</p>
      </div>
    </EntityNavigation>
  );
}
