import React from 'react';
import { CheckCircle } from 'lucide-react';

interface StatusChipProps {
  status?: string;
}

const StatusChip: React.FC<StatusChipProps> = ({ status = "Live" }) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
      <CheckCircle size={14} />
      {status}
    </div>
  );
};

export default StatusChip;