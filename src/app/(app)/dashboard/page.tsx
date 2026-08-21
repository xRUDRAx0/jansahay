'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, AlertCircle, FileText, CheckCircle2, 
  ChevronRight, ExternalLink, Activity, Info, Building,
  ArrowRight, ShieldAlert, Sparkles, Network
} from 'lucide-react';
import { useDemo } from '@/lib/demo/context';
import { UNKNOWN } from '@/types/engine';
import { computeDashboardReadiness } from '@/lib/engine/readiness';
import GlassCard from '@/components/ui/GlassCard';
import { SchemeCategory, RankedSchemeMatch } from '@/types/engine';

// ── Helpers ────────────────────────────────────────────────────────
function TrustBadge({ type, label }: { type: 'official' | 'user' | 'ai' | 'warning', label: string }) {
  const styles = {
    official: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    user: 'bg-blue-50 text-blue-700 border-blue-200',
    ai: 'bg-purple-50 text-purple-700 border-purple-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
  };
  const icons = {
    official: <ShieldCheck className="w-3 h-3 mr-1" />,
    user: <CheckCircle2 className="w-3 h-3 mr-1" />,
    ai: <Sparkles className="w-3 h-3 mr-1" />,
    warning: <AlertCircle className="w-3 h-3 mr-1" />,
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase border ${styles[type]}`}>
      {icons[type]} {label}
    </span>
  );
}

// ── Components ─────────────────────────────────────────────────────

export default function BenefitDashboard() {
  const { citizenProfile, rankedMatches, isDemo } = useDemo();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const isProfileEmpty = !isDemo && (!citizenProfile || citizenProfile.name === UNKNOWN);
  const { categoryStacks, topAction } = computeDashboardReadiness(rankedMatches);
  const categories = Object.keys(categoryStacks) as SchemeCategory[];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* ── 1. WHO AM I (Profile Snapshot & Trust Layer) ──────────── */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Citizen Profile</h2>
            <h1 className="text-3xl font-bold text-gray-900">
              {citizenProfile.name !== UNKNOWN ? citizenProfile.name : 'Guest User'}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <span className="font-medium text-gray-900">Location:</span> 
                {citizenProfile.district !== UNKNOWN ? `${citizenProfile.district}, ` : ''}
                {citizenProfile.state !== UNKNOWN ? citizenProfile.state : 'Unknown'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="font-medium text-gray-900">Age:</span> 
                {citizenProfile.age !== UNKNOWN ? `${citizenProfile.age} yrs` : 'Unknown'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="font-medium text-gray-900">Income:</span> 
                {citizenProfile.annualIncome !== UNKNOWN ? `₹${(citizenProfile.annualIncome as number).toLocaleString()}/yr` : 'Unknown'}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <TrustBadge type="user" label="Self-Reported Profile" />
            <Link href="/profile">
              <button className="text-sm font-medium text-blue-600 hover:underline">Update Profile →</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. WHAT SHOULD I DO NEXT? (Single Highest Impact Action) ─ */}
      {topAction && (
        <section className="bg-blue-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Activity className="w-32 h-32" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-sm font-bold text-blue-200 uppercase tracking-wider mb-2">Highest Impact Action</h2>
            <h3 className="text-2xl font-bold mb-2">{topAction.title}</h3>
            <p className="text-blue-100 mb-4">{topAction.description}</p>
            
            <div className="bg-blue-700/50 rounded-lg p-3 mb-6 backdrop-blur-sm inline-block">
              <span className="text-sm font-medium">Unlocks eligibility check for: </span>
              <span className="text-sm font-bold text-yellow-300">
                {topAction.unlockedSchemes.join(', ')}
              </span>
            </div>
            
            <div>
              <Link href="/documents">
                <button className="px-6 py-2.5 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Go to Document Doctor
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* ── 3. BENEFIT GRAPH (Visual Tree of dependencies) ──────────── */}
        <section className="lg:col-span-4 space-y-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Network className="w-4 h-4" /> Benefit Graph
          </h2>
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 font-mono text-sm overflow-x-auto shadow-inner">
            <div className="text-blue-700 font-bold mb-2">Citizen ({citizenProfile.name !== UNKNOWN ? citizenProfile.name : 'You'})</div>
            {categories.map((cat, i) => (
              <div key={cat} className="ml-2 border-l-2 border-gray-300 pl-4 py-1 relative">
                {/* Horizontal connector */}
                <div className="absolute w-4 h-0.5 bg-gray-300 top-4 -left-0.5"></div>
                <div className="font-semibold text-gray-800">{cat}</div>
                
                {categoryStacks[cat].slice(0, 3).map(match => (
                  <div key={match.scheme.id} className="ml-4 border-l-2 border-gray-200 pl-4 py-1 relative">
                    <div className="absolute w-4 h-0.5 bg-gray-200 top-3 -left-0.5"></div>
                    <Link href={`/services/${match.scheme.id}`} className="text-blue-600 hover:underline hover:text-blue-800 transition-colors truncate block max-w-[200px]">
                      {match.scheme.name}
                    </Link>
                    
                    {/* Status branch */}
                    <div className="ml-4 border-l-2 border-dashed border-gray-200 pl-4 py-1 relative">
                      <div className="absolute w-4 h-[1px] border-t border-dashed border-gray-200 top-3 -left-0.5"></div>
                      {match.tier === 'high' ? (
                        <span className="text-green-600 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Ready to Apply
                        </span>
                      ) : match.tier === 'missing_info' ? (
                        <span className="text-amber-600 text-xs font-bold flex items-center gap-1 cursor-help" title={`Missing: ${match.eligibility.missingDocuments.join(', ')}`}>
                          <AlertCircle className="w-3 h-3" /> Missing Docs
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs font-bold flex items-center gap-1">
                          <Info className="w-3 h-3" /> Potentially Eligible
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {categories.length === 0 && (
              <div className="text-gray-400 italic ml-4 mt-2">No benefits discovered yet. Use the AI Agent to build your profile.</div>
            )}
          </div>
        </section>

        {/* ── 4. SCHEME STACKING (Categorized Benefits & Trust Layer) ── */}
        <section className="lg:col-span-8 space-y-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Benefit Categories</h2>
          
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
            <button 
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${!activeCategory ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat} <span className="ml-1 opacity-60 text-xs">({categoryStacks[cat].length})</span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {categories
              .filter(c => !activeCategory || activeCategory === c)
              .map(cat => (
              <div key={cat} className="space-y-3">
                <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mt-4">{cat}</h3>
                
                {categoryStacks[cat].map(match => (
                  <GlassCard key={match.scheme.id} className="p-5 flex flex-col md:flex-row gap-5 items-start md:items-center hover:shadow-md transition-shadow">
                    
                    {/* Scheme Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <TrustBadge type="official" label="Official Scheme" />
                        <TrustBadge type={match.scheme.lastVerified === 'UNVERIFIED' ? 'warning' : 'ai'} label={match.scheme.lastVerified === 'UNVERIFIED' ? 'Needs Verification' : 'Verified'} />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{match.scheme.name}</h4>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                        <Building className="w-4 h-4" /> {match.scheme.ministry}
                      </div>
                      
                      {/* Why am I seeing this? */}
                      <div className="bg-gray-50 rounded-lg p-3 text-sm mt-3 border border-gray-100">
                        <span className="font-semibold text-gray-700">Why am I seeing this?</span>
                        <p className="text-gray-600 mt-1">{match.whyShown}</p>
                        
                        {match.eligibility.missingDocuments.length > 0 && (
                          <div className="mt-2 text-amber-700 font-medium text-xs flex items-center gap-1.5 bg-amber-50 px-2 py-1.5 rounded">
                            <AlertCircle className="w-4 h-4" /> 
                            Blocked: Missing {match.eligibility.missingDocuments.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Readiness & Actions */}
                    <div className="w-full md:w-56 shrink-0 flex flex-col gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-5">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-gray-600">Application Readiness</span>
                          <span className={match.tier === 'high' ? 'text-green-600' : 'text-amber-600'}>
                            {match.displayScore}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${match.tier === 'high' ? 'bg-green-500' : match.tier === 'missing_info' ? 'bg-amber-500' : 'bg-blue-500'}`} 
                            style={{ width: `${match.displayScore}%` }}
                          />
                        </div>
                      </div>

                      {match.tier === 'high' ? (
                         <a href={match.scheme.officialApplicationUrl} target="_blank" rel="noopener noreferrer">
                          <button className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-1.5">
                            Apply Online <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </a>
                      ) : (
                        <Link href={`/journeys/new?schemeId=${match.scheme.id}`}>
                          <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5">
                            Build Action Plan <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                      )}
                      
                      <Link href={`/services/${match.scheme.id}`}>
                        <button className="w-full py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                          View Scheme Details
                        </button>
                      </Link>
                    </div>

                  </GlassCard>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
