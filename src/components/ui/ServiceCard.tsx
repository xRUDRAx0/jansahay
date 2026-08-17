"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import GlassCard from "./GlassCard";
import StatusBadge from "./StatusBadge";

export interface ServiceMatch {
  id: string;
  title: string;
  category: string;
  matchLevel: 'high' | 'medium' | 'verification_needed';
  icon?: React.ReactNode;
}

interface ServiceCardProps {
  service: ServiceMatch;
  onClick?: () => void;
}

export default function ServiceCard({ service, onClick }: ServiceCardProps) {
  const matchConfig = {
    high: { status: 'success' as const, label: 'High Match' },
    medium: { status: 'info' as const, label: 'Medium Match' },
    verification_needed: { status: 'warning' as const, label: 'Needs Verification' },
  };

  const config = matchConfig[service.matchLevel];

  return (
    <GlassCard 
      className={`cursor-pointer ${onClick ? 'hover:shadow-md hover:-translate-y-0.5 transition-all' : ''}`}
      padding="md"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        {service.icon && (
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#1a56db]">
            {service.icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{service.title}</h3>
          <p className="text-sm text-gray-500 truncate">{service.category}</p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusBadge status={config.status} label={config.label} />
          {onClick && <ChevronRight className="w-5 h-5 text-gray-400" />}
        </div>
      </div>
    </GlassCard>
  );
}
