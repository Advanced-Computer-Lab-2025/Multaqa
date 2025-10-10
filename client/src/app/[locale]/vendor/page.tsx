"use client";

import EntityNavigation from "@/components/layout/EntityNavigation";

export default function VendorHomePage() {
  return (
    <EntityNavigation userRole="vendor">
      <div className="p-6 bg-white">
        <h1 className="text-2xl font-semibold mb-4">Vendor Portal (Dummy)</h1>
        <p className="text-sm text-gray-600">This is a placeholder vendor page.</p>
      </div>
    </EntityNavigation>
  );
}
