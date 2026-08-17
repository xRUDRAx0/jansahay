"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import GlassCard from "./GlassCard";

interface InsightCardProps {
  type: 'action' | 'opportunity' | 'update';
  title: string;
  description: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export default function InsightCard({ type, title, description, icon, onClick }: InsightCardProps) {
  const borderColors = {
    action: 'border-l-[#dc2626]',
    opportunity: 'border-l-[#16a34a]',
    update: 'border-l-[#2563eb]'
  };

  return (
    <GlassCard 
      className={`border-l-4 ${borderColors[type]} cursor-pointer ${onClick ? 'hover:shadow-md' : ''}`}
      padding="sm"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {icon && <div className="mt-1">{icon}</div>}
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        {onClick && <ChevronRight className="w-5 h-5 text-gray-400 mt-1" />}
      </div>
    </GlassCard>
  );
}
