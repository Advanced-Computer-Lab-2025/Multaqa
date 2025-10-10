"use client";

import EntityNavigation from "@/components/layout/EntityNavigation";

export default function ProfessorHomePage() {
  return (
    <EntityNavigation userRole="professor">
      <div className="p-6 bg-white">
        <h1 className="text-2xl font-semibold mb-4">Professor Portal (Dummy)</h1>
        <p className="text-sm text-gray-600">Placeholder content for professors.</p>
      </div>
    </EntityNavigation>
  );
}
