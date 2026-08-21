'use client';

// ============================================================
// Journey Detail Page
// Handles two cases:
//   1. /journeys/new?schemeId=sch-001&schemeName=...  (live mode — scheme from results)
//   2. /journeys/journey-001  (demo mode — existing journey)
// NEVER falls back to demoJourneys[0].
// ============================================================

import { use, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { JourneyTimeline, ReadinessScore, ActionCard, GlassCard } from '@/components/ui';
import { Sparkles, ArrowLeft, ExternalLink, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { demoJourneys } from '@/lib/demo/data';
import { getSchemeById } from '@/lib/schemes/db';
import { useDemo } from '@/lib/demo/context';

function JourneyDetailContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { citizenProfile, rankedMatches } = useDemo();

  // ── Case 1: New live journey from scheme selection ─────────
  if (id === 'new') {
    const schemeId = searchParams?.get('schemeId') ?? '';
    const schemeNameParam = searchParams?.get('schemeName') ?? '';

    // Look up scheme from DB for real details
    const scheme = getSchemeById(schemeId);
    const schemeName = scheme?.name ?? schemeNameParam ?? 'Unknown Scheme';

    // Find this scheme in ranked matches to get readiness score
    const match = rankedMatches.find(m => m.scheme.id === schemeId);
    const readinessScore = match ? match.displayScore : null;

    // Required documents from scheme DB
    const requiredDocs = scheme?.requiredDocuments ?? [];

    // Check which docs the user already has
    const userDocs = citizenProfile.availableDocuments ?? [];

    if (!schemeId) {
      return (
        <div className="max-w-2xl mx-auto p-8 text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-800">No Scheme Selected</h1>
          <p className="text-gray-600">Please go back and select a scheme to start a journey.</p>
          <Link href="/discover/results">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
              ← Back to Matches
            </button>
          </Link>
        </div>
      );
    }

    return (
      <div className="max-w-5xl mx-auto space-y-8 p-4">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to matches
        </button>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your JANSAHAY Journey</h1>
          <p className="text-gray-600 mt-2">Track and manage your application process for this scheme.</p>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <JourneyTimeline
            stages={[
              { id: '1', label: 'Discovery', status: 'done' },
              { id: '2', label: 'Eligibility', status: 'done' },
              { id: '3', label: 'Document Collection', status: 'active' },
              { id: '4', label: 'Verification', status: 'pending' },
              { id: '5', label: 'Submission', status: 'pending' },
              { id: '6', label: 'Approval', status: 'pending' },
            ]}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Active Journey Profile — SELECTED SCHEME */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Active Journey Profile</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Target Scheme</p>
                <p className="font-semibold text-blue-700 text-lg mt-1">{schemeName}</p>
              </div>
              {scheme && (
                <p className="text-sm text-gray-500">
                  {scheme.ministry} · {scheme.category}
                </p>
              )}
              {readinessScore !== null && (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium text-gray-900">{readinessScore}% Eligibility Match</span>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Readiness Score */}
          <GlassCard className="p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Readiness Score</h3>
              <p className="text-sm text-gray-600">
                {readinessScore && readinessScore >= 80
                  ? 'You are ready to apply!'
                  : 'Some information is still needed.'}
              </p>
            </div>
            <div className="w-24 h-24">
              <ReadinessScore score={readinessScore ?? 60} />
            </div>
          </GlassCard>
        </div>

        {/* Required Documents */}
        {requiredDocs.length > 0 && (
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Documents Required for {schemeName}
            </h3>
            <div className="space-y-3">
              {requiredDocs.map((doc, i) => {
                const docKey = doc.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z_]/g, '');
                const hasDoc = userDocs.some(d => d.includes(docKey.split('_')[0]));
                return (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${hasDoc ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'}`}>
                    {hasDoc
                      ? <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                      : <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                    }
                    <span className={`text-sm font-medium ${hasDoc ? 'text-green-800' : 'text-amber-800'}`}>
                      {doc}
                    </span>
                    <span className="ml-auto text-xs text-gray-400">
                      {hasDoc ? 'Available' : 'Collect this'}
                    </span>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        )}

        {/* Scheme Benefits Summary */}
        {scheme?.benefits && scheme.benefits.length > 0 && (
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">What You Will Get</h3>
            <ul className="space-y-2">
              {scheme.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700">{b}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        )}

        {/* Official Application Link */}
        {scheme?.officialApplicationUrl && (
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-blue-900">Ready to Apply Officially?</h3>
              <p className="text-sm text-blue-700 mt-1">Apply through the official government portal</p>
              <a href={scheme.officialApplicationUrl} target="_blank" rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline break-all">
                {scheme.officialApplicationUrl}
              </a>
            </div>
            <a href={scheme.officialApplicationUrl} target="_blank" rel="noopener noreferrer">
              <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap">
                Apply Online <ExternalLink className="w-4 h-4" />
              </button>
            </a>
          </div>
        )}

        <p className="text-xs text-gray-400 text-center italic">
          Preliminary assessment only. Final eligibility and approval are determined by the concerned government authority.
        </p>
      </div>
    );
  }

  // ── Case 2: Existing demo journey ─────────────────────────
  const journey = demoJourneys.find(j => j.id === id);

  if (!journey) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-800">Journey Not Found</h1>
        <p className="text-gray-600">
          No journey with ID <code className="bg-gray-100 px-2 py-1 rounded text-sm">{id}</code> was found.
        </p>
        <Link href="/journeys">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
            ← Back to Journeys
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Your JANSAHAY Journey</h1>
        <p className="text-gray-600 mt-2">Track and manage your application process seamlessly.</p>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <JourneyTimeline
          stages={[
            { id: '1', label: 'Discovery', status: 'done' },
            { id: '2', label: 'Eligibility', status: 'done' },
            { id: '3', label: 'Document Collection', status: 'active' },
            { id: '4', label: 'Verification', status: 'pending' },
            { id: '5', label: 'Submission', status: 'pending' },
            { id: '6', label: 'Approval', status: 'pending' },
          ]}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-4">Active Journey Profile</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Target Service</p>
              <p className="font-medium text-blue-600 text-lg">{journey.serviceName}</p>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="font-medium text-gray-900">92% Potential Match</span>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Readiness Score</h3>
            <p className="text-sm text-gray-600">You are almost ready to apply.</p>
          </div>
          <div className="w-24 h-24">
            <ReadinessScore score={78} />
          </div>
        </GlassCard>
      </div>
      <ActionCard
        type="warning"
        title="Verify your income certificate"
        description="Please review the extracted details from your uploaded income certificate before proceeding."
        actionLabel="Take Action"
        onAction={() => console.log('Action taken')}
      />
    </div>
  );
}

export default function JourneyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64 text-gray-500">Loading journey…</div>}>
      <JourneyDetailContent id={id} />
    </Suspense>
  );
}
