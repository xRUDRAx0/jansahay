'use client';

import { useDemo } from '@/lib/demo/context';
import { GlassButton } from '@/components/ui';
import { motion } from 'framer-motion';
import { demoServiceMatches } from '@/lib/demo/data';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function DiscoveryResultsPage() {
  const { state } = useDemo();

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Service Matches</h1>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium text-sm">
            {demoServiceMatches.length} Found
          </span>
        </div>
      </motion.div>

      <div className="space-y-6">
        {demoServiceMatches.map((match: any, index: number) => (
          <motion.div 
            key={match.serviceId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/70 backdrop-blur-md border border-white/50 shadow-sm rounded-2xl p-6"
          >
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-sm">
                    {match.matchScore}% Match
                  </span>
                  <h3 className="text-xl font-bold">{match.serviceTitle}</h3>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Why it matched:</h4>
                  <ul className="space-y-2">
                    {match.reasons?.map((reason: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 min-w-[200px]">
                <Link href={`/services/${match.serviceId}`}>
                  <GlassButton variant="secondary" className="w-full justify-center">
                    View Details
                  </GlassButton>
                </Link>
                <Link href={`/journeys/new?serviceId=${match.serviceId}`}>
                  <GlassButton variant="primary" className="w-full justify-center">
                    Start Journey
                  </GlassButton>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-sm text-gray-500 text-center italic mt-8">
        Preliminary matches only. Verify current official requirements.
      </p>
    </div>
  );
}
