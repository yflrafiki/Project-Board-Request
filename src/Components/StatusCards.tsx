import React from "react";

interface StatusCardProps {
  status: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  "New": "bg-blue-100 text-blue-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  "Under Review": "bg-purple-100 text-purple-800",
  "Completed": "bg-green-100 text-green-800",
};

export const StatusCard = ({ status, count, isActive, onClick }: StatusCardProps) => {
  const colorClasses = STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
  const borderClass = isActive ? "border-2 border-blue-500" : "border";

  return (
    <div
      className={`cursor-pointer p-4 rounded-xl shadow-sm ${colorClasses} ${borderClass} transition hover:shadow-md`}
      onClick={onClick}
    >
      <h4 className="text-sm font-semibold">{status}</h4>
      <p className="text-xl font-bold">{count}</p>
    </div>
  );
};
