'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
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
        <div className="w-16 h-16 rounded-full bg-[#1a56db] flex items-center justify-center text-white font-bold text-3xl shadow-lg">J</div>
        <h2 className="text-xl font-medium text-gray-800">Loading demo experience...</h2>
        <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden mt-4">
          <motion.div 
            className="h-full bg-[#1a56db]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
