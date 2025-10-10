"use client";

import EntityNavigation from "@/components/layout/EntityNavigation";

export default function EventsOfficeHomePage() {
  return (
    <EntityNavigation userRole="events-office">
      <div className="p-6 bg-white">
        <h1 className="text-2xl font-semibold mb-4">Events Office (Dummy)</h1>
        <p className="text-sm text-gray-600">Placeholder page for Events Office functionality.</p>
      </div>
    </EntityNavigation>
  );
}
