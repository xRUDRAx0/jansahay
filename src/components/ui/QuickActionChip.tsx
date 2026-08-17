"use client";

import React from "react";

interface QuickActionChipProps {
  icon: React.ReactNode;
  label: string;
  color?: string;
  onClick?: () => void;
}

export default function QuickActionChip({ icon, label, color = "bg-blue-100 text-blue-600", onClick }: QuickActionChipProps) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-2 group transition-transform hover:-translate-y-1"
    >
      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${color} shadow-sm group-hover:shadow-md transition-shadow`}>
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-700 text-center w-20 break-words leading-tight">{label}</span>
    </button>
  );
}
