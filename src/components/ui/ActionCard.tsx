"use client";

import React from "react";
import GlassCard from "./GlassCard";
import GlassButton from "./GlassButton";

interface ActionCardProps {
  type: 'warning' | 'info' | 'danger';
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel: string;
  onAction: () => void;
}

export default function ActionCard({ type, title, description, icon, actionLabel, onAction }: ActionCardProps) {
  const borderColors = {
    warning: 'border-l-[#f59e0b]',
    info: 'border-l-[#2563eb]',
    danger: 'border-l-[#dc2626]',
  };

  const bgColors = {
    warning: 'bg-orange-50',
    info: 'bg-blue-50',
    danger: 'bg-red-50',
  };

  const iconColors = {
    warning: 'text-[#f59e0b]',
    info: 'text-[#2563eb]',
    danger: 'text-[#dc2626]',
  };

  return (
    <GlassCard className={`border-l-4 ${borderColors[type]}`} padding="md">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-start justify-between">
        <div className="flex items-start gap-4">
          {icon && (
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bgColors[type]} ${iconColors[type]}`}>
              {icon}
            </div>
          )}
          <div>
            <h4 className="font-semibold text-gray-900">{title}</h4>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>
        <GlassButton variant="primary" size="sm" onClick={onAction} className="shrink-0 self-start sm:self-center">
          {actionLabel}
        </GlassButton>
      </div>
    </GlassCard>
  );
}
