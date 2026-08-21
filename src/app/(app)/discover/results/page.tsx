'use client';

import { useDemo } from '@/lib/demo/context';
import { GlassButton } from '@/components/ui';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, HelpCircle, ExternalLink } from 'lucide-react';

export default function DiscoveryResultsPage() {
  const { state } = useDemo();
  const matches = state.serviceMatches ?? [];

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Service Matches</h1>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium text-sm">
            {matches.length} Found
          </span>
        </div>
        <p className="text-gray-600 mt-1 text-sm">Based on your profile. Shown because you match key criteria.</p>
      </motion.div>

      <div className="space-y-6">
        {matches.map((match: any, index: number) => {
          // Support both old demoServiceMatches shape and new RankedSchemeMatch shape
          const title = match.scheme?.name ?? match.service?.title ?? match.serviceTitle ?? 'Unknown Service';
          const serviceId = match.scheme?.id ?? match.service?.id ?? match.serviceId ?? '#';
          const score = match.displayScore ?? match.matchScore ?? 0;
          const reasons = match.eligibility?.criteriaResults
            ?.filter((r: any) => r.status === 'PASS')
            .map((r: any) => r.label)
            ?? match.matchReasons?.filter((r: any) => r.matched).map((r: any) => r.reason)
            ?? match.reasons
            ?? [];
          const whyShown = match.whyShown ?? `Matches ${reasons.length} criteria`;
          const tier = match.tier ?? match.matchLevel;

          return (
            <motion.div
              key={serviceId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/70 backdrop-blur-md border border-white/50 shadow-sm rounded-2xl p-6"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-full font-semibold text-sm ${
                      tier === 'high' || score >= 80 ? 'bg-green-100 text-green-700' :
                      tier === 'medium' || score >= 60 ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {score}% Match
                    </span>
                    <h3 className="text-xl font-bold">{title}</h3>
                  </div>

                  <p className="text-sm text-gray-500 italic">{whyShown}</p>

                  {reasons.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700 text-sm">Why it matched:</h4>
                      <ul className="space-y-1">
                        {reasons.slice(0, 4).map((reason: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Missing criteria */}
                  {match.eligibility?.criteriaResults?.filter((r: any) => r.status === 'UNKNOWN').length > 0 && (
                    <div className="space-y-1">
                      <h4 className="font-medium text-gray-700 text-sm">Missing info:</h4>
                      {match.eligibility.criteriaResults
                        .filter((r: any) => r.status === 'UNKNOWN')
                        .slice(0, 2)
                        .map((r: any, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-amber-700">
                            <HelpCircle className="w-4 h-4 shrink-0" />
                            <span>{r.label}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 min-w-[200px]">
                  <Link href={`/services/${serviceId}`}>
                    <GlassButton variant="secondary" className="w-full justify-center">
                      View Details
                    </GlassButton>
                  </Link>
                  <Link href={`/journeys/journey-001`}>
                    <GlassButton variant="primary" className="w-full justify-center">
                      Start Journey
                    </GlassButton>
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}

        {matches.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">No matches found yet</p>
            <p className="text-sm mt-1">Describe your situation to the AI agent to get personalized matches.</p>
            <Link href="/agent" className="mt-4 inline-block text-blue-600 hover:underline text-sm">
              Talk to JANSAHAY →
            </Link>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500 text-center italic mt-8">
        JANSAHAY provides guidance based on available scheme information. Final eligibility and approval are determined by the concerned government authority.
      </p>
    </div>
  );
}
