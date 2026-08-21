'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Play, Shield, Zap, FlaskConical } from 'lucide-react';
import LandingNav from '@/components/layout/LandingNav';
import GlassButton from '@/components/ui/GlassButton';
import GlassCard from '@/components/ui/GlassCard';
import AIOrb from '@/components/ui/AIOrb';
import { setStoredMode, clearLiveSession } from '@/lib/app/mode';

export default function LandingPage() {
  const router = useRouter();

  function handleTryLive() {
    setStoredMode('live');
    // Start a fresh live session
    clearLiveSession();
    router.push('/dashboard');
  }

  function handleExploreDemo() {
    setStoredMode('demo');
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faff]">
      <LandingNav />
      <main className="flex-1 flex flex-col items-center justify-center pt-20 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl w-full mx-auto text-center space-y-8 flex flex-col items-center"
        >
          <div className="bg-[#1a56db] text-white uppercase tracking-wider rounded-full px-5 py-1.5 text-xs font-semibold inline-block">
            AI PUBLIC-SERVICE COPILOT
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-tight">
            Tell us your problem.<br/>
            <span className="text-[#1a56db]">JANSAHAY finds the path.</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Navigate government services effortlessly. Our AI copilot understands your situation, checks scheme eligibility, and guides you step-by-step — no login required.
          </p>

          {/* Two clear CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full max-w-lg">
            {/* Primary: Live Mode */}
            <button
              onClick={handleTryLive}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#1a56db] hover:bg-blue-700 text-white font-semibold text-lg rounded-2xl shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-5 h-5" />
              Try JANSAHAY
            </button>

            {/* Secondary: Demo Mode */}
            <button
              onClick={handleExploreDemo}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-lg rounded-2xl border border-gray-200 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <FlaskConical className="w-5 h-5 text-purple-600" />
              Explore Demo
            </button>
          </div>

          {/* Mode labels */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg text-sm">
            <div className="flex-1 text-center p-3 rounded-xl bg-blue-50 border border-blue-100">
              <p className="font-semibold text-blue-800">Try JANSAHAY</p>
              <p className="text-blue-600 mt-0.5">Live Mode — your real situation, fresh session, no pre-filled data</p>
            </div>
            <div className="flex-1 text-center p-3 rounded-xl bg-purple-50 border border-purple-100">
              <p className="font-semibold text-purple-800">Explore Demo</p>
              <p className="text-purple-600 mt-0.5">Judge Mode — Rohit Sharma persona, pre-filled demo scenario</p>
            </div>
          </div>
        </motion.div>

        {/* Preview card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 w-full max-w-3xl mx-auto"
        >
          <GlassCard className="p-6 md:p-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <AIOrb size="md" />
              </div>
              <div className="flex-1 space-y-4 w-full">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-gray-800 self-end ml-auto max-w-md">
                  I am a 19-year-old B.Tech student from Delhi. My family income is ₹2 lakh. What scholarships can I apply for?
                </div>

                <div className="bg-blue-50/50 p-4 rounded-xl border-l-4 border-l-[#1a56db] border border-transparent">
                  <p className="text-gray-600 text-sm mb-2 font-medium">I understood:</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {['Age: 19', 'State: Delhi', 'Education: B.Tech', 'Occupation: Student', 'Income: ₹2L'].map(tag => (
                      <span key={tag} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">✓ {tag}</span>
                    ))}
                  </div>
                  <p className="text-gray-800 mb-3">I found <strong>4 education schemes</strong> you may be eligible for. Top match:</p>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-green-500 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-gray-900">Central Sector Scheme of Scholarships (CSSS)</h4>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">High Match</span>
                    </div>
                    <div className="flex gap-2 text-sm text-gray-600">
                      <span>• Ministry of Education</span>
                      <span>• ₹12,000/yr</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 flex items-center justify-center gap-2 text-gray-500"
        >
          <Shield className="w-5 h-5 text-green-600" />
          <span className="font-medium text-sm">No login required. No data stored on servers. Guidance grounded in verified sources.</span>
        </motion.div>
      </main>
    </div>
  );
}
