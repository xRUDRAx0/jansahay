"use client";

import React from "react";
import { Check, AlertTriangle, Circle } from "lucide-react";

export type TimelineStageStatus = 'done' | 'active' | 'pending' | 'warning';

export interface TimelineStage {
  id: string;
  label: string;
  subtitle?: string;
  status: TimelineStageStatus;
}

interface JourneyTimelineProps {
  stages: TimelineStage[];
}

export default function JourneyTimeline({ stages }: JourneyTimelineProps) {
  return (
    <div className="w-full py-4 overflow-x-auto">
      <div className="flex items-start min-w-max">
        {stages.map((stage, index) => {
          const isLast = index === stages.length - 1;
          const isDone = stage.status === 'done';
          const isActive = stage.status === 'active';
          const isWarning = stage.status === 'warning';

          return (
            <div key={stage.id} className="flex flex-col items-center relative w-32">
              <div className="flex items-center w-full justify-center relative z-10 h-8">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white
                  ${isDone ? 'border-green-500 text-green-500' : ''}
                  ${isActive ? 'border-[#1a56db] text-[#1a56db]' : ''}
                  ${isWarning ? 'border-orange-500 text-orange-500' : ''}
                  ${stage.status === 'pending' ? 'border-gray-300 text-gray-300' : ''}
                `}>
                  {isDone && <Check className="w-4 h-4" />}
                  {isActive && <div className="w-2.5 h-2.5 rounded-full bg-[#1a56db]" />}
                  {isWarning && <AlertTriangle className="w-4 h-4" />}
                  {stage.status === 'pending' && <Circle className="w-4 h-4" />}
                </div>
                {!isLast && (
                  <div className={`absolute top-1/2 left-[50%] w-full h-[2px] -translate-y-1/2 -z-10
                    ${isDone ? 'bg-green-500' : 'bg-gray-200'}
                  `} />
                )}
              </div>
              <div className="mt-2 text-center">
                <div className={`text-xs font-semibold ${isActive ? 'text-[#1a56db]' : 'text-gray-700'}`}>
                  {stage.label}
                </div>
                {stage.subtitle && (
                  <div className="text-[10px] text-gray-500 mt-0.5">{stage.subtitle}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
