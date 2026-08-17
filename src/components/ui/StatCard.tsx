"use client";

import React from "react";
import GlassCard from "./GlassCard";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor?: string;
  className?: string;
}

export default function StatCard({ label, value, icon, iconColor = "text-[#1a56db]", className }: StatCardProps) {
  return (
    <GlassCard className={`flex flex-col gap-2 ${className || ''}`} padding="md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div className={`p-2 bg-gray-50 rounded-lg ${iconColor}`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </GlassCard>
  );
}
