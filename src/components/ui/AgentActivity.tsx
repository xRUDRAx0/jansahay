"use client";

import React from "react";
import { Check, Loader2 } from "lucide-react";

export interface ActivityStep {
  label: string;
  status: 'done' | 'active' | 'pending';
}

interface AgentActivityProps {
  steps: ActivityStep[];
  className?: string;
}

export default function AgentActivity({ steps, className }: AgentActivityProps) {
  return (
    <div className={`flex flex-col ${className || ''}`}>
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
        JANSAHAY ACTIVITY
      </h3>
      <div className="flex flex-col gap-4 relative">
        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-100 -z-10" />
        {steps.map((step, idx) => {
          const isDone = step.status === 'done';
          const isActive = step.status === 'active';
          
          return (
            <div key={idx} className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 mt-0.5 bg-white
                ${isDone ? 'border-green-500 text-green-500' : ''}
                ${isActive ? 'border-[#1a56db] text-[#1a56db]' : ''}
                ${step.status === 'pending' ? 'border-gray-200 text-transparent' : ''}
              `}>
                {isDone && <Check className="w-3.5 h-3.5" />}
                {isActive && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              </div>
              <div className={`text-sm py-1 ${isActive ? 'text-gray-900 font-medium' : isDone ? 'text-gray-600' : 'text-gray-400'}`}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
