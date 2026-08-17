'use client';

import { use } from 'react';
import { demoDocuments } from '@/lib/demo/data';
import { GlassCard } from '@/components/ui';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const document = demoDocuments.find(d => d.id === id) || demoDocuments[0];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Document Detail</h1>
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold mb-4">{document.name}</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-500 w-24">Type:</span>
            <span>{document.type}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-500 w-24">Status:</span>
            <span className={`px-2 py-1 rounded text-sm ${document.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {document.status}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-500 w-24">Uploaded:</span>
            <span>{document.uploadedAt}</span>
          </div>
        </div>
        
        {document.verificationNote && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-3">Verification Note</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p>{document.verificationNote}</p>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
