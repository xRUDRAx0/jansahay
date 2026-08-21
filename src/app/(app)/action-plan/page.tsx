'use client';

import { useDemo } from '@/lib/demo/context';
import { GlassCard } from '@/components/ui';
import { CheckCircle2, Clock, Upload, ArrowRight, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ActionPlanPage() {
  const { rankedMatches, isDemo } = useDemo();

  // Compute action items dynamically from live rankedMatches
  const actionItems = [];
  
  for (const match of rankedMatches) {
    if (match.tier === 'missing_info' || match.tier === 'medium') {
      const missingDocs = match.eligibility.missingDocuments;
      for (const doc of missingDocs) {
        actionItems.push({
          id: `upload-${doc}-${match.scheme.id}`,
          title: `Upload ${doc}`,
          description: `Required to unlock full eligibility for ${match.scheme.name}`,
          status: 'pending',
          type: 'document',
          priority: 'high',
          actionUrl: '/documents'
        });
      }
    }
  }

  // Deduplicate by doc type to group actions
  const uniqueActionsMap = new Map<string, any>();
  for (const item of actionItems) {
    if (!uniqueActionsMap.has(item.title)) {
      uniqueActionsMap.set(item.title, { ...item, schemes: [item.description] });
    } else {
      uniqueActionsMap.get(item.title).schemes.push(item.description);
    }
  }
  const uniqueActions = Array.from(uniqueActionsMap.values());

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Your Action Plan</h1>
        <p className="text-gray-600 mt-2">Steps you need to take to advance your applications.</p>
      </motion.div>

      {uniqueActions.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 border border-dashed border-gray-300 rounded-xl">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-500">No action items right now! You are fully ready for the schemes you match.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {uniqueActions.map((item: any) => (
            <GlassCard key={item.id} className="p-5 flex gap-4">
              <div className="mt-1 flex-shrink-0">
                <Upload className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  {item.priority === 'high' && <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded font-medium border border-red-200">High Priority Bottleneck</span>}
                  <h3 className="font-semibold text-gray-900">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm mb-2">Required by {item.schemes.length} potential scheme(s).</p>
                <div className="mt-4">
                  <Link href={item.actionUrl}>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                      Go to Document Doctor <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
