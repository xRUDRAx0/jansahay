'use client';

import { useDemo } from '@/lib/demo/context';
import { demoActionItems } from '@/lib/demo/data';
import { GlassCard } from '@/components/ui';
import { CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ActionPlanPage() {
  const { state, markActionComplete } = useDemo();

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Your Action Plan</h1>
        <p className="text-gray-600 mt-2">Steps you need to take to advance your applications.</p>
      </motion.div>

      <div className="space-y-4">
        {demoActionItems.map((item, i) => (
          <GlassCard key={item.id} className={`p-5 flex gap-4 ${item.status === 'completed' ? 'opacity-60' : ''}`}>
            <button 
              onClick={() => markActionComplete(item.id)}
              className="mt-1 flex-shrink-0"
            >
              <CheckCircle2 className={`w-6 h-6 ${item.status === 'completed' ? 'text-green-500' : 'text-gray-300 hover:text-green-400'}`} />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {item.priority === 'high' && <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded font-medium">High Priority</span>}
                <h3 className={`font-semibold ${item.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {item.title}
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-2">{item.description}</p>
              {item.dueDate && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Due: {item.dueDate}</span>
                </div>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
