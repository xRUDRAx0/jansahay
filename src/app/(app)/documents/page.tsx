'use client';

import { useDemo } from '@/lib/demo/context';
import { UploadZone, GlassCard, ServiceCard } from '@/components/ui';
import { demoDocuments, demoServiceMatches } from '@/lib/demo/data';
import { CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export default function DocumentDoctorPage() {
  const { state } = useDemo();
  const analyzedDoc = demoDocuments[1]; // Using income certificate

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Doctor</h1>
          <p className="text-gray-600 mt-2">AI-powered extraction, verification, and service matching.</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-sm font-medium text-blue-700">AI Copilot Active</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <UploadZone onFilesSelected={(f) => console.log(f)} />
          <div className="bg-gray-100 rounded-xl p-4 aspect-[3/4] flex items-center justify-center border border-gray-200">
            <div className="text-center text-gray-400">
              <FileText className="w-16 h-16 mx-auto mb-2 opacity-50" />
              <p>Income Certificate Preview</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Extracted Information</h3>
              <a href="#" className="text-sm text-blue-600 hover:underline">View Raw JSON</a>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 tracking-wider">NAME</p>
                  <p className="font-medium">Raj Kumar</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 tracking-wider">INCOME</p>
                  <p className="font-medium">₹ 1,50,000 / year</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 tracking-wider">ISSUING AUTHORITY</p>
                  <p className="font-medium">Tehsildar, Delhi</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 tracking-wider">DATE</p>
                  <p className="font-medium">12 Oct 2023</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 font-medium">Validity requires verification.</p>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors">
              Add to Journey
            </button>
          </GlassCard>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold px-1">Potentially Useful For</h3>
            <div className="space-y-3">
              {demoServiceMatches.slice(0, 2).map((match) => (
                <ServiceCard
                  key={match.service.id}
                  service={{
                    id: match.service.id,
                    title: match.service.title,
                    category: match.service.category,
                    matchLevel: match.matchLevel === 'high' ? 'high' : match.matchLevel === 'medium' ? 'medium' : 'verification_needed'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
