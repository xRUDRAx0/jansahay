"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

interface TrustIndicatorProps {
  level: 'verified' | 'unverified' | 'demo';
  source?: string;
  className?: string;
}

export default function TrustIndicator({ level, source, className }: TrustIndicatorProps) {
  const config = {
    verified: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', label: 'Verified' },
    unverified: { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Unverified' },
    demo: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Demo Data' },
  };

  const c = config[level];
  const Icon = c.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${c.bg} ${c.color} ${className || ''}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{c.label}{source ? ` • ${source}` : ''}</span>
    </div>
  );
}
