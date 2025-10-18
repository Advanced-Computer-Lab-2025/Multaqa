"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "@mui/material";
import { ArrowRight } from "lucide-react";

const stakeholders = [
  { role: "student", label: "Student Portal", color: "bg-blue-500" },
  { role: "staff", label: "Staff Portal", color: "bg-purple-500" },
  { role: "ta", label: "TA Portal", color: "bg-green-500" },
  { role: "professor", label: "Professor Portal", color: "bg-orange-500" },
  { role: "admin", label: "Admin Panel", color: "bg-red-500" },
  { role: "events-office", label: "Events Office", color: "bg-indigo-500" },
  { role: "vendor", label: "Vendor Portal", color: "bg-pink-500" },
];

export default function LocalePage() {
  const router = useRouter();
  const params = useParams() as { locale?: string };
  const locale = params.locale || "en";

  const handleNavigate = (role: string) => {
    router.push(`/${locale}/${role}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome to Multaqa
          </h1>
          <p className="text-lg text-gray-600">
            University Event Management Platform
          </p>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stakeholders.map((stakeholder) => (
            <button
              key={stakeholder.role}
              onClick={() => handleNavigate(stakeholder.role)}
              className={`${stakeholder.color} hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-lg p-6 text-white font-semibold text-lg flex items-center justify-between group`}
            >
              <span>{stakeholder.label}</span>
              <ArrowRight
                size={24}
                className="group-hover:translate-x-2 transition-transform"
              />
            </button>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-600 text-sm">
          <p>
            Select your role above to access the portal designed for your needs.
          </p>
        </div>
      </div>
    </main>
  );
}
