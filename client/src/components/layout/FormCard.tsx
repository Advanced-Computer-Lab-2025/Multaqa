import { ExternalLink } from "lucide-react";
import StatusChip from "../shared/StatusChip";
import React from "react";

export default function FormCard({
  title,
  createdDate,
  status = "Live",
}: {
  title: string;
  createdDate: string;
  status?: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex gap-6 items-start relative hover:shadow-lg hover:border-gray-300 transition-all group">
      <div className="w-[120px] h-[140px] bg-gray-50 rounded-lg flex flex-col items-center justify-center relative">
        <div className="absolute top-2 left-2 bg-[#424242] text-white px-2 py-1 rounded text-[10px] font-semibold">
          FORM
        </div>

        <div className="flex flex-col gap-3 mt-6">
          {[60, 80, 80, 80].map((width, i) => (
            <div
              key={i}
              style={{ width: `${width}px` }}
              className="h-1 bg-gray-300 rounded-full"
            />
          ))}
        </div>
      </div>

      <div className="flex-1">
        <StatusChip status={status} />

        <h3 className="text-xl font-semibold text-gray-900 mt-2 mb-1">
          {title}
        </h3>

        <p className="text-sm text-gray-500">Created on {createdDate}</p>
      </div>

      <button className="absolute right-4 bottom-4 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100">
        <ExternalLink size={18} className="text-gray-600" />
      </button>
    </div>
  );
}
