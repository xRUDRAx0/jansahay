'use client';

import { useParams, useRouter } from 'next/navigation';
import { demoServices } from '@/lib/demo/data';
import { SourceBadge, TrustIndicator, GlassButton } from '@/components/ui';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { use } from 'react';

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: serviceId } = use(params);
  const service = demoServices.find(s => s.id === serviceId) || demoServices[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {service.category}
          </span>
          <SourceBadge source={service.source?.name || 'Official Govt Portal'} verified={service.source?.verificationStatus === 'verified'} />
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

          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <TrustIndicator level="verified" />
            <div className="mt-6">
              <GlassButton variant="primary" className="w-full justify-center py-3 text-lg" onClick={() => router.push(`/journeys/new?serviceId=${serviceId}`)}>
                Start Journey
              </GlassButton>
            </div>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-500 text-center italic">
        Disclaimer: Information is provided as a guide. Please verify with official sources.
      </p>
    </div>
  );
}
