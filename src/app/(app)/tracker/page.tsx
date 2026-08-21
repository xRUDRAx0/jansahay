'use client';

import { useDemo } from '@/lib/demo/context';
import { StatusBadge, GlassCard } from '@/components/ui';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function TrackerPage() {
  const { rankedMatches, isDemo } = useDemo();

  // Create mock applications based on live rankedMatches
  const applications = rankedMatches
    .filter(m => m.tier === 'high' || m.tier === 'missing_info')
    .map(match => ({
      id: `app-${match.scheme.id}`,
      serviceName: match.scheme.name,
      status: match.tier === 'high' ? 'ready' : 'action-required',
      lastUpdated: new Date().toLocaleDateString(),
      nextAction: match.tier === 'high' ? 'Submit Official Form' : `Upload ${match.eligibility.missingDocuments[0]}`,
      url: match.scheme.officialApplicationUrl
    }));

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Application Readiness Tracker</h1>
        <p className="text-gray-600 mt-2">Track the readiness and status of your potential applications.</p>
      </motion.div>

      {applications.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 border border-dashed border-gray-300 rounded-xl">
          <p className="text-gray-500">No active applications yet. Talk to JANSAHAY to discover benefits.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <GlassCard key={app.id} className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{app.serviceName}</h3>
                  <p className="text-sm text-gray-500 mt-1">Application ID: Pending Submission</p>
                </div>
                <StatusBadge 
                  status={app.status === 'ready' ? 'success' : 'warning'} 
                  label={app.status === 'ready' ? 'READY TO APPLY' : 'MISSING INFO'} 
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-gray-500 mb-1">Status Date</p>
                  <p className="font-medium">{app.lastUpdated}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 mb-1">Next Action</p>
                  <p className={`font-bold ${app.status === 'ready' ? 'text-green-600' : 'text-amber-600'}`}>
                    {app.nextAction}
                  </p>
                </div>
                <div className="flex items-center justify-end">
                  {app.status === 'ready' ? (
                     <a href={app.url} target="_blank" rel="noopener noreferrer">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
                        Open Official Portal <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </a>
                  ) : (
                    <Link href="/documents">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Resolve Issue
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
