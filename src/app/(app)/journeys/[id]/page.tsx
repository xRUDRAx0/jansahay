'use client';

import { JourneyTimeline, ReadinessScore, ActionCard, GlassCard } from '@/components/ui';
import { Sparkles } from 'lucide-react';
import { demoJourneys } from '@/lib/demo/data';
import { use } from 'react';

export default function JourneyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const journey = demoJourneys.find(j => j.id === id) || demoJourneys[0];

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4">
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
