'use client';

import { useDemo } from '@/lib/demo/context';
import { demoNotifications } from '@/lib/demo/data';
import { NotificationCard } from '@/components/ui';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function NotificationsPage() {
  const { state, markNotificationRead } = useDemo();
  const [filter, setFilter] = useState('All');

  const unreadCount = demoNotifications.filter(n => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="bg-blue-600 text-white text-sm px-2 py-0.5 rounded-full font-medium">
                {unreadCount}
              </span>
            )}
          </h1>
        </motion.div>
      </div>

      <div className="flex gap-2">
        {['All', 'Unread', 'Action Required'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {demoNotifications
          .filter(n => {
            if (filter === 'Unread') return !n.read;
            if (filter === 'Action Required') return n.type === 'action-required' || n.type === 'missing-document';
            return true;
          })
          .map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={{
              id: notification.id,
              title: notification.title,
              description: notification.description || '',
              time: notification.createdAt,
              isRead: notification.read
            }}
            onClick={() => markNotificationRead(notification.id)}
          />
        ))}
      </div>
    </div>
  );
}
