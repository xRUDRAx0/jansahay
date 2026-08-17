'use client';

import { useDemo } from '@/lib/demo/context';
import { demoJourneys } from '@/lib/demo/data';
import { GlassButton, ReadinessScore } from '@/components/ui';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';

export default function JourneysPage() {
  const { state } = useDemo();

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900">Your Journeys</h1>
          <p className="text-gray-600 mt-1">Track your progress across all service applications.</p>
        </motion.div>
        <Link href="/discover">
          <GlassButton variant="primary">Start New Journey</GlassButton>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {demoJourneys.map((journey, i) => (
          <motion.div 
            key={journey.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{journey.serviceName}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: 2 days ago</span>
                </div>
              </div>
              <div className="w-12 h-12">
                <ReadinessScore score={78} />
              </div>
            </div>
            
            <div className="mt-4 mb-6 flex-1">
              <p className="text-sm font-medium text-blue-600 mb-2">Current Stage: {journey.currentStage}</p>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>

            <Link href={`/journeys/${journey.id}`}>
              <GlassButton variant="secondary" className="w-full justify-between group">
                View Details
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </GlassButton>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
