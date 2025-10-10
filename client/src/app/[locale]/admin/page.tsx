"use client";

import EntityNavigation from "@/components/layout/EntityNavigation";

export default function AdminHomePage() {
  return (
    <EntityNavigation userRole="admin">
      <div className="p-6 bg-white">
        <h1 className="text-2xl font-semibold mb-4">Admin Dashboard (Dummy)</h1>
        <p className="text-sm text-gray-600">This is a placeholder admin dashboard page. Replace with real content later.</p>
      </div>
    </EntityNavigation>
  );
}
