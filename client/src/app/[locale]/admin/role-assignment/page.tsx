"use client";

import React, { useState } from 'react';
import EntityNavigation from '@/components/layout/EntityNavigation';

type Applicant = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

const initialApplicants: Applicant[] = [
  { id: 'a1', name: 'Angelina J', email: 'angelina@gmail.com', avatar: '' },
  { id: 'a2', name: 'Vini JR', email: 'vinijr@gmail.com', avatar: '' },
  { id: 'a3', name: 'Sam Carter', email: 'sam.carter@example.com', avatar: '' },
];

export default function RoleAssignmentPage() {
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);

  const roleKeys = ['staff', 'ta', 'professor'] as const;
  const roleLabels: Record<typeof roleKeys[number], string> = {
    staff: 'Staff',
    ta: 'TA',
    professor: 'Professor',
  };

  const [assigned, setAssigned] = useState<Record<string, Applicant[]>>({
    staff: [],
    ta: [],
    professor: [],
  });

  const [activeRoleIndex, setActiveRoleIndex] = useState<number>(0);

  function assignToRole(roleKey: string, user: Applicant) {
    setAssigned((prev) => ({ ...prev, [roleKey]: [...(prev[roleKey] || []), user] }));
    setApplicants((prev) => prev.filter((a) => a.id !== user.id));
  }

  function unassignFromRole(roleKey: string, userId: string) {
    setAssigned((prev) => ({ ...prev, [roleKey]: (prev[roleKey] || []).filter(u => u.id !== userId) }));
    const user = Object.values(assigned).flat().find(u => u.id === userId);
    if (user) setApplicants((prev) => [user, ...prev]);
  }

  return (
    <EntityNavigation headerTitle="Role Assignments">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - applicants */}
          <div className="md:col-span-1 bg-white rounded-lg p-4 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Applicants</h3>

            <div className="space-y-3">
              {applicants.length === 0 && (
                <div className="text-sm text-gray-500">No pending applicants</div>
              )}

              {applicants.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{a.name}</div>
                    <div className="text-xs text-gray-500">{a.email}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    {roleKeys.map((rk) => (
                      <button
                        key={rk}
                        onClick={() => assignToRole(rk, a)}
                        className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
                        title={`Assign as ${roleLabels[rk]}`}
                      >
                        {roleLabels[rk].slice(0,2)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - role tabs and lists */}
          <div className="md:col-span-2 bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Assigned Users</h3>
              <div className="flex gap-2">
                {roleKeys.map((rk, idx) => (
                  <button
                    key={rk}
                    onClick={() => setActiveRoleIndex(idx)}
                    className={`py-2 px-3 text-sm font-medium rounded ${activeRoleIndex === idx ? 'bg-[#6299d0] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {roleLabels[rk]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              {roleKeys.map((rk, idx) => (
                <div key={rk} className={`${activeRoleIndex === idx ? 'block' : 'hidden'}`}>
                  <h4 className="text-sm text-gray-600 mb-3">{roleLabels[rk]} ({(assigned[rk] || []).length})</h4>
                  <div className="space-y-3">
                    {(assigned[rk] || []).length === 0 && (
                      <div className="text-sm text-gray-500">No users assigned to {roleLabels[rk]}</div>
                    )}
                    {(assigned[rk] || []).map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                        <div>
                          <div className="font-medium">{u.name}</div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </div>
                        <div>
                          <button onClick={() => unassignFromRole(rk, u.id)} className="text-xs px-3 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </EntityNavigation>
  );
}
