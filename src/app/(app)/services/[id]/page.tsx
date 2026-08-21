'use client';

// ============================================================
// Service / Scheme Detail Page
// Bug fix: looks up schemeDb FIRST, then demoServices.
// NEVER falls back to demoServices[0] — shows "not found" instead.
// ============================================================

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSchemeById } from '@/lib/schemes/db';
import { demoServices } from '@/lib/demo/data';
import { GlassButton } from '@/components/ui';
import {
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Info,
  ArrowLeft,
  FileText,
  ShieldCheck,
} from 'lucide-react';

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: serviceId } = use(params);

  // ── Lookup order: schemeDb (new engine) → demoServices (legacy) ──
  // NEVER fall back to index [0]. Show "not found" if not in either.
  const schemeFromDb = getSchemeById(serviceId);
  const legacyService = !schemeFromDb
    ? demoServices.find(s => s.id === serviceId)
    : null;

  // ── Not found — explicit error, no silent substitution ───────
  if (!schemeFromDb && !legacyService) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-800">Scheme Not Found</h1>
        <p className="text-gray-600">
          No scheme with ID <code className="bg-gray-100 px-2 py-1 rounded text-sm">{serviceId}</code> was found in the scheme database.
        </p>
        <p className="text-sm text-gray-500">
          This may happen if you navigated directly to this page. Please go back and select a scheme from the matches list.
        </p>
        <GlassButton variant="primary" onClick={() => router.back()}>
          ← Go Back
        </GlassButton>
      </div>
    );
  }

  // ── Render from schemeDb (preferred) ─────────────────────────
  if (schemeFromDb) {
    const scheme = schemeFromDb;
    return (
      <div className="max-w-4xl mx-auto space-y-8 p-4">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to matches
        </button>

        {/* Header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {scheme.category}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
              {scheme.scope === 'Central' ? '🇮🇳 Central Government' : `📍 ${scheme.scope}`}
            </span>
            {scheme.isDemo && (
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                ⚠ Data unverified — {scheme.lastVerified}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{scheme.name}</h1>
          <p className="text-gray-600 text-lg">{scheme.description}</p>
          <p className="text-sm text-gray-400">Ministry: {scheme.ministry}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Left column */}
          <div className="space-y-6">

            {/* Benefits */}
            {scheme.benefits && scheme.benefits.length > 0 && (
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <h3 className="text-xl font-semibold mb-4 text-green-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> Benefits
                </h3>
                <ul className="space-y-2">
                  {scheme.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Eligibility */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">Eligibility Criteria</h3>
              <ul className="space-y-3">
                {scheme.eligibilityRules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-gray-700 font-medium">{rule.label}</span>
                      {rule.description && (
                        <p className="text-sm text-gray-500 mt-0.5">{rule.description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Documents */}
            {scheme.requiredDocuments && scheme.requiredDocuments.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Required Documents
                </h3>
                <ul className="space-y-3">
                  {scheme.requiredDocuments.map((doc, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                      <span className="text-gray-700">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">

            {/* Application steps */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">How to Apply</h3>
              <ol className="space-y-4 text-gray-700">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center">1</span>
                  <span>Check eligibility criteria above</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center">2</span>
                  <span>Gather required documents</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center">3</span>
                  <span>Apply through the official portal (link below)</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center">4</span>
                  <span>Track your application status online</span>
                </li>
              </ol>
            </div>

            {/* Official Source */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 space-y-4">
              <div className="flex items-center gap-2 text-blue-800 font-semibold">
                <Info className="w-5 h-5" />
                Official Government Source
              </div>
              <p className="text-sm text-blue-700">
                For accurate, up-to-date information visit the official government portal:
              </p>
              {scheme.officialSource && (
                <a
                  href={scheme.officialSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium text-sm break-all"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  {scheme.officialSource}
                </a>
              )}
              {scheme.officialApplicationUrl && scheme.officialApplicationUrl !== scheme.officialSource && (
                <a
                  href={scheme.officialApplicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2"
                >
                  <GlassButton variant="primary" className="w-full justify-center">
                    Apply Online <ExternalLink className="w-4 h-4 ml-2" />
                  </GlassButton>
                </a>
              )}
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <p className="text-xs text-amber-700">
                <strong>Disclaimer:</strong> This is a preliminary eligibility assessment. Final eligibility and approval are determined by the concerned government authority. Scheme details may change — always verify through the official source.
              </p>
              {scheme.lastVerified === 'UNVERIFIED' && (
                <p className="text-xs text-amber-700 mt-2">
                  ⚠ Scheme data has not been independently verified. Please check the official source for accuracy.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Fallback: render legacy demoService (only if explicitly selected) ──
  const service = legacyService!;
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{service.category}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>
        <p className="text-gray-600 text-lg">{service.description}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-4">Eligibility Requirements</h3>
            <ul className="space-y-3">
              {service.eligibility?.map((req: any, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">{req.label || req}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-4">Required Documents</h3>
            <ul className="space-y-3">
              {service.requiredDocuments?.map((doc: any, i: number) => (
                <li key={i} className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                  <span className="text-gray-700">{doc.title || doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-4">Application Steps</h3>
            <ol className="space-y-4 list-decimal list-inside text-gray-700">
              <li>Check eligibility and gather documents</li>
              <li>Fill out the application form</li>
              <li>Submit documents for verification</li>
              <li>Track application status</li>
            </ol>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <p className="text-xs text-amber-700">
              Preliminary eligibility assessment. Final eligibility is determined by the concerned government authority.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
