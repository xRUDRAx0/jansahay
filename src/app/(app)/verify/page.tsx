'use client';

import { useState } from 'react';
import { useDemo } from '@/lib/demo/context';
import { GlassCard, GlassButton } from '@/components/ui';
import { AlertTriangle, ShieldCheck, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VerifyPage() {
  const { analyzeMessage } = useDemo();
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!message.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await analyzeMessage(message);
      setResult(res);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Verify Message</h1>
        <p className="text-gray-600 mt-2">Paste suspicious messages or links to check for scams.</p>
      </motion.div>

      <GlassCard className="p-6 space-y-4">
        <textarea
          className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-white/50"
          placeholder="Paste SMS, WhatsApp message, or email text here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <GlassButton variant="primary" onClick={handleAnalyze} className="w-full justify-center" disabled={isAnalyzing || !message.trim()}>
          {isAnalyzing ? 'Analyzing...' : 'Analyze Message'}
        </GlassButton>
      </GlassCard>

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className={`p-4 rounded-xl border flex items-start gap-4 ${
            result.riskLevel === 'high' ? 'bg-red-50 border-red-200 text-red-900' :
            result.riskLevel === 'medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-900' :
            'bg-green-50 border-green-200 text-green-900'
          }`}>
            {result.riskLevel === 'high' ? <AlertTriangle className="w-8 h-8 text-red-600 shrink-0" /> : <ShieldCheck className="w-8 h-8 text-green-600 shrink-0" />}
            <div>
              <h3 className="font-bold text-lg mb-1">{String(result.riskLevel).toUpperCase()} RISK DETECTED</h3>
              <p className="opacity-90">This message shows {String(result.riskLevel).toLowerCase()} signs of being a scam.</p>
            </div>
          </div>

          <GlassCard className="p-6">
            <h3 className="font-semibold text-lg mb-4">Risk Indicators</h3>
            <ul className="space-y-3">
              {result.indicators?.map((ind: any, i: number) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="w-20 font-medium text-gray-500 shrink-0">{ind.severity}</span>
                  <span className="text-gray-800">{ind.description}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="p-6 bg-blue-50/50 border-blue-100">
            <h3 className="font-semibold text-lg mb-2 text-blue-900">Recommendation</h3>
            <p className="text-blue-800">{result.recommendation}</p>
          </GlassCard>
        </motion.div>
      )}

      <p className="text-xs text-gray-400 text-center">
        Disclaimer: This AI analysis is for informational purposes. Never share OTPs or personal details.
      </p>
    </div>
  );
}
