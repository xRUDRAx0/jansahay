'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, Shield } from 'lucide-react';
import LandingNav from '@/components/layout/LandingNav';
import GlassButton from '@/components/ui/GlassButton';
import GlassCard from '@/components/ui/GlassCard';
import AIOrb from '@/components/ui/AIOrb';

export default function LandingPage() {
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
            Navigate government services effortlessly. Our AI copilot understands your needs, checks eligibility, and guides you step-by-step through any public-service journey.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/login">
              <GlassButton variant="primary" className="px-8 py-3 text-lg">
                Try JANSAHAY
              </GlassButton>
            </Link>
            <Link href="/demo">
              <GlassButton variant="secondary" className="px-8 py-3 text-lg flex items-center gap-2">
                <Play className="w-5 h-5" /> Explore Demo
              </GlassButton>
            </Link>
          </div>
        </motion.div>

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
                  I'm a student from Rajasthan and my family's income is under ₹2L. What scholarships can I apply for?
                </div>
                
                <div className="bg-blue-50/50 p-4 rounded-xl border-l-4 border-l-[#1a56db] border border-transparent">
                  <p className="text-gray-800 mb-3">I found a few scholarships that perfectly match your profile. Here is the top match:</p>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-green-500 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-gray-900">Post Matric Scholarship</h4>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">High Match</span>
                    </div>
                    <div className="flex gap-2 text-sm text-gray-600">
                      <span>• Dept of Social Justice</span>
                      <span>• ₹10,000/yr</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <div className="h-1.5 w-16 bg-blue-600 rounded-full"></div>
                    <div className="h-1.5 w-16 bg-gray-200 rounded-full"></div>
                    <div className="h-1.5 w-16 bg-gray-200 rounded-full"></div>
                    <span>Step 1 of 3: Eligibility</span>
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
          <span className="font-medium text-sm">Guidance grounded in verified sources.</span>
        </motion.div>
      </main>
    </div>
  );
}
