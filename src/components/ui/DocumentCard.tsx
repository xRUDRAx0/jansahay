"use client";

import React from "react";
import { FileText, MoreVertical } from "lucide-react";
import GlassCard from "./GlassCard";
import StatusBadge from "./StatusBadge";

export interface DocumentInfo {
  id: string;
  name: string;
  status: 'verified' | 'pending' | 'rejected' | 'missing';
  extractedFields?: number;
  updatedAt?: string;
}

interface DocumentCardProps {
  document: DocumentInfo;
  onClick?: () => void;
}

export default function DocumentCard({ document, onClick }: DocumentCardProps) {
  const statusConfig = {
    verified: { s: 'success' as const, l: 'Verified' },
    pending: { s: 'warning' as const, l: 'Pending' },
    rejected: { s: 'danger' as const, l: 'Rejected' },
    missing: { s: 'neutral' as const, l: 'Missing' },
  };

  const cfg = statusConfig[document.status];

  return (
    <GlassCard 
      padding="sm" 
      className={`flex items-center gap-3 ${onClick ? 'cursor-pointer hover:bg-gray-50/50' : ''}`}
      onClick={onClick}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0
        ${document.status === 'verified' ? 'bg-green-50 text-green-600' : 
          document.status === 'missing' ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-[#1a56db]'}
      `}>
        <FileText className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 truncate">{document.name}</div>
        <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
          <StatusBadge status={cfg.s} label={cfg.l} />
          {document.extractedFields !== undefined && (
            <span>• {document.extractedFields} fields</span>
          )}
        </div>
      </div>
      <button className="p-1 text-gray-400 hover:text-gray-600 rounded-md" onClick={(e) => e.stopPropagation()}>
        <MoreVertical className="w-5 h-5" />
      </button>
    </GlassCard>
  );
}
