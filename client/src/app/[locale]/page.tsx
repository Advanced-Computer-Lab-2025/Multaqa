'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Static list of roles — explicit and reliable.
const ROLES: { key: string; label: string }[] = [
  { key: 'student', label: 'Student' },
  { key: 'staff', label: 'Staff' },
  { key: 'ta', label: 'TA' },
  { key: 'professor', label: 'Professor' },
  { key: 'events-office', label: 'Events Office' },
  { key: 'admin', label: 'Admin' },
  { key: 'vendor', label: 'Vendor' },
];

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname() || '';
  // extract locale from path (/en/..)
  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0] ?? 'en';

  return (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-semibold mb-4">Welcome to Multaqa</h1>
      <p className="text-sm text-gray-600 mb-6">Select your role to continue.</p>

      <div className="flex flex-wrap gap-3">
        {ROLES.map((role) => (
          <button
            key={role.key}
            onClick={() => void router.push(`/${locale}/${role.key}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
          >
            {role.label}
          </button>
        ))}
      </div>
    </div>
  );
}
