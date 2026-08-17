"use client";

import React from "react";

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  label: string;
  className?: string;
}

export default function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const statusConfig = {
    success: "bg-green-100 text-[#16a34a]",
    warning: "bg-orange-100 text-[#f59e0b]",
    danger: "bg-red-100 text-[#dc2626]",
    info: "bg-blue-100 text-[#2563eb]",
    neutral: "bg-gray-100 text-gray-600",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status]} ${className || ''}`}>
      {label}
    </span>
  );
}
