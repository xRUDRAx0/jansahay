'use client';

import { useDemo } from '@/lib/demo/context';
import { ReadinessScore } from '@/components/ui';
import { demoServiceMatches } from '@/lib/demo/data';
import { Check, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EligibilityPage() {
  const { state } = useDemo();

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Eligibility Overview</h1>
        <p className="text-gray-600 mt-2">See how well you qualify for matched services based on your profile.</p>
      </motion.div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Overall Readiness</h2>
          <p className="text-gray-600">Your profile is well-prepared for multiple services.</p>
        </div>
        <div className="w-24 h-24">
          <ReadinessScore score={85} />
        </div>
      </div>

      <div className="space-y-6">
        {demoServiceMatches.map((match: any, idx: number) => (
          <motion.div 
            key={match.serviceId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold">{match.serviceTitle}</h3>
                <p className="text-sm text-gray-500">{match.category}</p>
              </div>
              <div className="w-16 h-16">
                <ReadinessScore score={match.matchScore} />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 font-medium text-gray-500">Requirement</th>
                    <th className="pb-3 font-medium text-gray-500 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr className="py-3">
                    <td className="py-3">Income Criteria</td>
                    <td className="py-3 flex justify-center"><Check className="w-5 h-5 text-green-500" /></td>
                  </tr>
                  <tr className="py-3">
                    <td className="py-3">Residency Proof</td>
                    <td className="py-3 flex justify-center"><Check className="w-5 h-5 text-green-500" /></td>
                  </tr>
                  <tr className="py-3">
                    <td className="py-3">Age Verification</td>
                    <td className="py-3 flex justify-center"><HelpCircle className="w-5 h-5 text-yellow-500" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
