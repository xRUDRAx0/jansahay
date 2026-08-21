'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mic, Paperclip, Send, Search, CheckSquare, FileText, TrendingUp, Shield, Lightbulb, Route, Flag } from 'lucide-react';
import { useDemo } from '@/lib/demo/context';
import GlassCard from '@/components/ui/GlassCard';
import VoiceButton from '@/components/ui/VoiceButton';
import AIOrb from '@/components/ui/AIOrb';
import StatCard from '@/components/ui/StatCard';
import InsightCard from '@/components/ui/InsightCard';
import QuickActionChip from '@/components/ui/QuickActionChip';

export default function DashboardPage() {
  const { state, greeting, rankedMatches } = useDemo();
  const profile = state.profile;
  const router = useRouter();
  const [query, setQuery] = useState('');

  // Compute real stats from engine
  const eligibleCount = rankedMatches?.filter((m: any) => m.tier === 'high' || m.tier === 'medium').length ?? state.serviceMatches?.length ?? 3;
  const activeJourneys = state.journeys?.filter((j: any) => j.status === 'active').length ?? 1;
  const totalDocs = state.documents?.length ?? 5;
  const availableDocs = state.documents?.filter((d: any) => d.status === 'available').length ?? 4;
  const pendingActions = state.actionItems?.filter((a: any) => a.status !== 'completed').length ?? 2;

  const handleSend = () => {
    if (query.trim()) {
      router.push('/agent?q=' + encodeURIComponent(query));
    } else {
      router.push('/agent');
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
          {greeting}, {profile.name}.
        <p className="text-lg text-gray-600">
          How can JANSAHAY help you today?
        </p>
      </div>

      <GlassCard className="p-2 md:p-3 shadow-sm border border-gray-200/60">
        <div className="flex items-center gap-3">
          <div className="hidden sm:block pl-2">
            <AIOrb size="sm" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            onFocus={() => router.push('/agent')}
            placeholder="Tell JANSAHAY what you need..."
            className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-400 text-lg px-2"
          />
          <div className="flex items-center gap-1 pr-1">
            <VoiceButton onTranscript={(t) => { setQuery(t); }} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" />
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              onClick={handleSend}
              className="p-2.5 bg-[#1a56db] hover:bg-blue-700 text-white rounded-full transition-colors ml-1"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>

      <div className="flex flex-wrap gap-3">
        <QuickActionChip icon={<Search className="w-6 h-6" />} label="Find Benefits" color="blue" onClick={() => router.push('/discover')} />
        <QuickActionChip icon={<CheckSquare className="w-6 h-6" />} label="Check Eligibility" color="green" onClick={() => router.push('/eligibility')} />
        <QuickActionChip icon={<FileText className="w-6 h-6" />} label="Check Documents" color="indigo" onClick={() => router.push('/documents')} />
        <QuickActionChip icon={<TrendingUp className="w-6 h-6" />} label="Track Application" color="purple" onClick={() => router.push('/tracker')} />
        <QuickActionChip icon={<Shield className="w-6 h-6" />} label="Verify Message" color="gray" onClick={() => router.push('/verify')} />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4"
      >
        <div className="md:col-span-5 grid grid-cols-2 gap-4">
          <motion.div variants={item}>
            <StatCard icon={<Lightbulb className="w-6 h-6" />} value={String(eligibleCount)} label="Potential Matches" iconColor="text-green-600" />
          </motion.div>
          <motion.div variants={item}>
            <StatCard icon={<Route className="w-6 h-6" />} value={String(activeJourneys)} label="Active Journeys" iconColor="text-blue-600" />
          </motion.div>
          <motion.div variants={item}>
            <StatCard icon={<FileText className="w-6 h-6" />} value={`${availableDocs}/${totalDocs}`} label="Documents Ready" iconColor="text-indigo-600" />
          </motion.div>
          <motion.div variants={item}>
            <StatCard icon={<Flag className="w-6 h-6" />} value={String(pendingActions)} label="Pending Actions" iconColor="text-red-600" />
          </motion.div>
        </div>

        <div className="md:col-span-7 space-y-4">
          <h3 className="uppercase text-xs tracking-wider text-gray-500 font-semibold px-1">JANSAHAY INSIGHTS</h3>
          <div className="space-y-3">
            <motion.div variants={item}>
              <InsightCard
                type="action"
                title="Action Required"
                description={pendingActions > 0 ? `You have ${pendingActions} pending action${pendingActions !== 1 ? 's' : ''} to complete.` : 'No pending actions. Great work!'}
              />
            </motion.div>
            <motion.div variants={item}>
              <InsightCard
                type="opportunity"
                title="Opportunity Identified"
                description={eligibleCount > 0 ? `${eligibleCount} scheme${eligibleCount !== 1 ? 's' : ''} match your profile. Your income certificate may unlock additional benefits.` : 'Tell JANSAHAY about your situation to discover matching schemes.'}
              />
            </motion.div>
            <motion.div variants={item}>
              <InsightCard
                type="update"
                title="Application Update"
                description="An application action may require your attention. Check the tracker."
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

