'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { setStoredMode } from '@/lib/app/mode';

export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    // Set demo mode then redirect to dashboard
    setStoredMode('demo');
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 1200);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f8faff] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center space-y-4"
      >
        <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">J</div>
        <h2 className="text-xl font-medium text-gray-800">Loading Demo Mode…</h2>
        <p className="text-sm text-purple-600">Rohit Sharma · Jaipur · B.Tech Student</p>
        <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden mt-4">
          <motion.div
            className="h-full bg-purple-600"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </div>
  );
}
