"use client";

import React from 'react';
import { useParams, usePathname } from 'next/navigation';
import EntityNavigation from '@/components/layout/EntityNavigation';

export default function EntityCatchAllPage() {
  const params = useParams() as { locale?: string; entity?: string; rest?: string[] };
  const pathname = usePathname() || '';
  const entity = params.entity ?? '';

  const mapEntityToRole = (e: string) => {
    switch (e) {
      case 'admin':
        return 'admin';
      case 'events-office':
        return 'events-office';
      case 'vendor':
        return 'vendor';
      case 'professor':
        return 'professor';
      case 'ta':
        return 'ta';
      case 'staff':
        return 'staff';
      case 'student':
      default:
        return 'student';
    }
  };

  return (
  <EntityNavigation userRole={mapEntityToRole(entity)}>
      <div className="p-6 bg-white">
        <h1 className="text-2xl font-semibold mb-4">{entity ? `${entity} (catch-all)` : 'Entity'}</h1>
        <p className="text-sm text-gray-600">Path: {pathname}</p>
      </div>
    </EntityNavigation>
  );
}
