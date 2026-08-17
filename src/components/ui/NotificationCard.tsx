"use client";

import React from "react";
import GlassCard from "./GlassCard";

export interface NotificationInfo {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  icon?: React.ReactNode;
}

interface NotificationCardProps {
  notification: NotificationInfo;
  onClick?: () => void;
}

export default function NotificationCard({ notification, onClick }: NotificationCardProps) {
  return (
    <GlassCard 
      padding="sm" 
      className={`cursor-pointer transition-colors ${!notification.isRead ? 'bg-blue-50/30' : ''} hover:bg-gray-50/50`}
      onClick={onClick}
    >
      <div className="flex gap-4">
        {notification.icon && (
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shrink-0 mt-1">
            {notification.icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`text-sm font-semibold truncate ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
              {notification.title}
            </h4>
            <span className="text-xs text-gray-500 whitespace-nowrap">{notification.time}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.description}</p>
        </div>
      </div>
    </GlassCard>
  );
}
