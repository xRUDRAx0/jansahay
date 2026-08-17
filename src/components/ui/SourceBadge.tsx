"use client";

import React from "react";
import { ShieldCheck, ShieldAlert } from "lucide-react";

interface SourceBadgeProps {
  source: string;
  verified: boolean;
  lastVerified?: string;
  url?: string;
}

export default function SourceBadge({ source, verified, lastVerified, url }: SourceBadgeProps) {
  const content = (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium
      ${verified ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-600'}
    `}>
      {verified ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
      <span>{source}</span>
    </div>
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" title={lastVerified ? `Verified: ${lastVerified}` : ''}>
        {content}
      </a>
    );
  }

  return <div title={lastVerified ? `Verified: ${lastVerified}` : ''}>{content}</div>;
}
