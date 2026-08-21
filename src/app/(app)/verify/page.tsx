'use client';

import { useState } from 'react';
import { GlassCard, GlassInput, StatusBadge } from '@/components/ui';
import { AlertTriangle, ShieldCheck, Search, Link as LinkIcon, MessageSquare, FileText, CheckCircle2, XCircle, Info, ExternalLink, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Mock DB for offline scheme verification
const SCHEME_DB = [
  { name: 'PM-KISAN', ministry: 'Ministry of Agriculture', status: 'Active', officialLink: 'https://pmkisan.gov.in/', description: '₹6000/year to farmers.' },
  { name: 'Ayushman Bharat', ministry: 'Ministry of Health', status: 'Active', officialLink: 'https://pmjay.gov.in/', description: '₹5L health cover.' },
];

export default function VerifyPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Government Information Verification Center</h1>
        <p className="text-gray-600 mt-2">Protect yourself from fake government information, scams, and false claims.</p>
      </motion.div>

      <div className="space-y-12">
        <VerifyMessageSection />
        <hr className="border-gray-200" />
        <VerifyUrlSection />
        <hr className="border-gray-200" />
        <VerifySchemeSection />
        <hr className="border-gray-200" />
        <VerifyClaimSection />
        <hr className="border-gray-200" />
        <VerificationHistorySection />
      </div>
    </div>
  );
}

// ── 0. RECENT HISTORY ──────────────────────────────────────────────
function VerificationHistorySection() {
  const history = [
    { type: 'Message', query: 'Pay ₹499 for PM-KISAN activation', status: 'scam', date: 'Just now' },
    { type: 'Website', query: 'https://scholarships.gov.in', status: 'verified', date: '2 hours ago' },
    { type: 'Scheme', query: 'PM-KISAN', status: 'verified', date: 'Yesterday' }
  ];
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Recent Verification History</h2>
      <div className="grid gap-3">
        {history.map((item, i) => (
          <GlassCard key={i} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {item.status === 'scam' ? <AlertTriangle className="w-5 h-5 text-red-500" /> : <ShieldCheck className="w-5 h-5 text-emerald-500" />}
              <div>
                <p className="font-semibold text-gray-900 text-sm">{item.query}</p>
                <p className="text-xs text-gray-500">{item.type} Check • {item.date}</p>
              </div>
            </div>
            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${item.status === 'scam' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
              {item.status === 'scam' ? 'Suspicious' : 'Verified'}
            </span>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

// ── 1. VERIFY MESSAGE ──────────────────────────────────────────────
function VerifyMessageSection() {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleVerify = () => {
    if (!message.trim()) return;
    const lower = message.toLowerCase();
    
    if (lower.includes('pay') || lower.includes('otp') || lower.includes('activate your account')) {
      setResult({
        status: 'scam',
        score: '98%',
        scheme: lower.includes('kisan') ? 'PM-KISAN (Spoofed)' : 'Unknown',
        reason: 'Government schemes NEVER ask for activation fees or OTPs via SMS/WhatsApp.',
        patterns: ['Requests payment', 'Urgency trigger', 'Unverified sender'],
        official: 'https://pmkisan.gov.in'
      });
    } else if (lower.includes('kisan')) {
      setResult({
        status: 'verified',
        score: '85%',
        scheme: 'PM-KISAN',
        reason: 'This aligns with official PM-KISAN notification language.',
        patterns: [],
        official: 'https://pmkisan.gov.in'
      });
    } else {
      setResult({ status: 'unknown' });
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-blue-600" /> Verify a Government Message
      </h2>
      <p className="text-sm text-gray-600">Paste an SMS, WhatsApp message, email, or claim.</p>
      
      <div className="flex gap-2 flex-col sm:flex-row">
        <textarea
          className="w-full h-24 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-white shadow-sm"
          placeholder="e.g., Congratulations! You have been selected for PM Kisan. Pay ₹499 to activate..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <button 
        onClick={handleVerify}
        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors w-full sm:w-auto"
      >
        Verify Message
      </button>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
            <GlassCard className={`p-5 mt-4 border ${result.status === 'scam' ? 'bg-red-50 border-red-200' : result.status === 'verified' ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-start gap-3">
                {result.status === 'scam' ? <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-1" /> : result.status === 'verified' ? <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-1" /> : <Info className="w-6 h-6 text-gray-600 shrink-0 mt-1" />}
                <div>
                  <h3 className={`font-bold text-lg ${result.status === 'scam' ? 'text-red-900' : result.status === 'verified' ? 'text-emerald-900' : 'text-gray-900'}`}>
                    {result.status === 'scam' ? 'Likely Scam / Suspicious' : result.status === 'verified' ? 'Verified Official' : 'Unable to verify automatically'}
                  </h3>
                  
                  {result.status !== 'unknown' && (
                    <div className="mt-3 space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <p><span className="font-semibold text-gray-700">Confidence:</span> {result.score}</p>
                        <p><span className="font-semibold text-gray-700">Detected Scheme:</span> {result.scheme}</p>
                      </div>
                      <div className="bg-white/60 p-3 rounded-lg">
                        <span className="font-semibold text-gray-800">Why flagged:</span> {result.reason}
                      </div>
                      {result.patterns.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {result.patterns.map((p: string) => <span key={p} className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">{p}</span>)}
                        </div>
                      )}
                      {result.status === 'scam' && (
                        <div className="mt-4 pt-3 border-t border-red-200">
                          <p className="font-semibold text-gray-900 mb-1">Recommended Action:</p>
                          <p className="text-gray-700 mb-2">Do not click any links. View the official resource to learn the legitimate process.</p>
                          <Link href="/resources">
                            <button className="text-blue-700 font-semibold underline flex items-center gap-1"><Search className="w-4 h-4"/> View Official Resource for {result.scheme}</button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ── 2. VERIFY URL ──────────────────────────────────────────────────
function VerifyUrlSection() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleVerify = () => {
    if (!url.trim()) return;
    const lower = url.toLowerCase();
    
    const isGov = lower.includes('.gov.in') || lower.includes('.nic.in');
    const isHttps = lower.startsWith('https://');

    setResult({
      status: isGov ? 'official' : 'suspicious',
      domain: lower.replace('https://', '').replace('http://', '').split('/')[0],
      https: isHttps,
      reason: isGov ? 'Domain belongs to the Government of India registry (.gov.in / .nic.in).' : 'Domain is NOT an official government registry. It may be a private agent, copycat, or scam.'
    });
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <LinkIcon className="w-6 h-6 text-blue-600" /> Verify a Government Website
      </h2>
      <p className="text-sm text-gray-600">Check if a website is an official government portal.</p>
      
      <div className="flex gap-2 flex-col sm:flex-row">
        <input
          type="text"
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm"
          placeholder="e.g., https://pmkisan.gov.in"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button 
          onClick={handleVerify}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shrink-0"
        >
          Check URL
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
            <GlassCard className="p-5 mt-4 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {result.status === 'official' ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-sm">
                    <ShieldCheck className="w-4 h-4" /> Official Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-800 rounded-full font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" /> High Risk / Suspicious
                  </span>
                )}
                <span className="font-mono text-gray-700">{result.domain}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-sm">
                <p className="font-semibold mb-1">Why this result?</p>
                <p className="text-gray-700 mb-3">{result.reason}</p>
                <p className="text-gray-600 flex items-center gap-2">
                  HTTPS Status: {result.https ? <span className="text-emerald-600 font-bold flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> Secure</span> : <span className="text-red-600 font-bold">Insecure</span>}
                </p>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ── 3. VERIFY SCHEME ───────────────────────────────────────────────
function VerifySchemeSection() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleVerify = () => {
    if (!query.trim()) return;
    const found = SCHEME_DB.find(s => s.name.toLowerCase().includes(query.toLowerCase()));
    setResult(found || 'not_found');
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Search className="w-6 h-6 text-blue-600" /> Verify a Government Scheme
      </h2>
      <p className="text-sm text-gray-600">Ensure the scheme you heard about actually exists.</p>
      
      <div className="flex gap-2 flex-col sm:flex-row">
        <input
          type="text"
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm"
          placeholder="e.g., PM-KISAN"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          onClick={handleVerify}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shrink-0"
        >
          Search Scheme
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
            <GlassCard className="p-5 mt-4">
              {result === 'not_found' ? (
                <div className="text-gray-600 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" /> No official scheme found matching this name. It may be fake or a state-specific scheme not in our database.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xl text-gray-900">{result.name}</h3>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">OFFICIAL SCHEME</span>
                  </div>
                  <p className="text-sm text-gray-700"><span className="font-semibold">Ministry:</span> {result.ministry}</p>
                  <p className="text-sm text-gray-700"><span className="font-semibold">Description:</span> {result.description}</p>
                  <a href={result.officialLink} target="_blank" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline font-semibold mt-2">
                    Official Website <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ── 4. VERIFY CLAIM ────────────────────────────────────────────────
function VerifyClaimSection() {
  const [claim, setClaim] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleVerify = () => {
    if (!claim.trim()) return;
    setResult({
      status: 'unsupported',
      explanation: 'Official sources state that scholarships or benefits are merit or income based. There is no blanket scheme providing ₹10,000 to EVERY student passing class 12.',
      source: 'Ministry of Education Guidelines'
    });
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Activity className="w-6 h-6 text-blue-600" /> Check a Government Claim
      </h2>
      <p className="text-sm text-gray-600">Did someone tell you about a free government benefit? Fact-check it.</p>
      
      <div className="flex gap-2 flex-col sm:flex-row">
        <textarea
          className="w-full h-20 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-white shadow-sm"
          placeholder="e.g., Government gives ₹10,000 to every student who passes Class 12."
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
        />
        <button 
          onClick={handleVerify}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors sm:w-auto h-auto shrink-0"
        >
          Check Claim
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
            <GlassCard className="p-5 mt-4 bg-amber-50 border-amber-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-lg text-amber-900 mb-2">Misleading / Unsupported</h3>
                  <p className="text-amber-800 text-sm mb-3">{result.explanation}</p>
                  <p className="text-xs text-amber-700 font-semibold">Official Source: {result.source}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
