'use client';

import { useDemo } from '@/lib/demo/context';
import { ReadinessScore } from '@/components/ui';
import { Check, X, HelpCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EligibilityPage() {
  const { state } = useDemo();
  const matches = state.serviceMatches ?? [];

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Eligibility Overview</h1>
        <p className="text-gray-600 mt-2">See how well you qualify for matched services based on your profile.</p>
      </motion.div>

      {/* Overall readiness */}
      {matches.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Overall Readiness</h2>
            <p className="text-gray-600 mt-1">
              {matches.filter((m: any) => (m.tier === 'high' || m.eligibility?.verdict === 'ELIGIBLE')).length} scheme(s) you likely qualify for.
            </p>
          </div>
          <div className="w-24 h-24">
            <ReadinessScore
              score={Math.round(
                matches.reduce((sum: number, m: any) => sum + (m.displayScore ?? m.matchScore ?? 0), 0) / matches.length
              )}
            />
          </div>
        </div>
      )}

      <div className="space-y-6">
        {matches.map((match: any, idx: number) => {
          // Support both old demoServiceMatches and new RankedSchemeMatch
          const title = match.scheme?.name ?? match.service?.title ?? match.serviceTitle ?? 'Unknown Service';
          const category = match.scheme?.category ?? match.service?.category ?? match.category ?? '';
          const score = match.displayScore ?? match.matchScore ?? 0;
          const criteriaResults = match.eligibility?.criteriaResults ?? [];

          // Build table rows from real eligibility engine or fallback to static
          const tableRows = criteriaResults.length > 0
            ? criteriaResults.map((r: any) => ({
                label: r.label,
                status: r.status,
                explanation: r.explanation,
              }))
            : [
                { label: 'Income Criteria', status: 'PASS', explanation: 'Meets income requirement' },
                { label: 'Residency Proof', status: 'PASS', explanation: 'State matches' },
                { label: 'Age Verification', status: 'UNKNOWN', explanation: 'Age not confirmed' },
              ];

          return (
            <motion.div
              key={match.scheme?.id ?? match.service?.id ?? idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="text-sm text-gray-500">{category}</p>
                </div>
                <div className="w-16 h-16">
                  <ReadinessScore score={score} />
                </div>
              </div>

              {/* Criteria breakdown */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-3 font-medium text-gray-500">Requirement</th>
                      <th className="pb-3 font-medium text-gray-500 text-center w-24">Status</th>
                      <th className="pb-3 font-medium text-gray-500 hidden md:table-cell">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {tableRows.map((row: any, i: number) => (
                      <tr key={i} className="py-3">
                        <td className="py-3 font-medium text-gray-800">{row.label}</td>
                        <td className="py-3">
                          <div className="flex justify-center">
                            {row.status === 'PASS' && <Check className="w-5 h-5 text-green-500" />}
                            {row.status === 'FAIL' && <X className="w-5 h-5 text-red-500" />}
                            {(row.status === 'UNKNOWN' || row.status === 'NEEDS_VERIFICATION') && (
                              <HelpCircle className="w-5 h-5 text-amber-500" />
                            )}
                          </div>
                        </td>
                        <td className="py-3 text-gray-500 text-xs hidden md:table-cell">{row.explanation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Missing documents */}
              {match.eligibility?.missingDocuments?.length > 0 && (
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-sm font-medium text-amber-800">
                    Missing documents: {match.eligibility.missingDocuments.join(', ')}
                  </p>
                </div>
              )}

              <p className="mt-4 text-xs text-gray-400 italic">
                Preliminary eligibility check based on your provided information. Verify with official sources.
              </p>
            </motion.div>
          );
        })}

        {matches.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">No matched services yet</p>
            <p className="text-sm mt-1">Tell the AI agent about your situation to see eligibility results.</p>
          </div>
        )}
      </div>
    </div>
  );
}
