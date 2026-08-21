'use client';

import { useState, useMemo, useEffect } from 'react';
import { GlassCard, GlassInput, StatusBadge } from '@/components/ui';
import { Search, ShieldCheck, X, ChevronRight, User, Tag, Calendar, Building, Info, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RESOURCES_DB, ResourceData, ResourceCategory } from '@/lib/resources/db';
import { useDemo } from '@/lib/demo/context';
import { UNKNOWN } from '@/types/engine';

export default function ResourcesPage() {
  const { citizenProfile } = useDemo();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ResourceCategory | 'All'>('All');
  const [selectedResource, setSelectedResource] = useState<ResourceData | null>(null);

  const categories: (ResourceCategory | 'All')[] = [
    'All', 'Government Services', 'Schemes & Benefits', 'Education', 'Farmers', 'Citizen Rights & Safety'
  ];

  // Fix data staleness: Force re-computation whenever citizenProfile changes
  const recommendations = useMemo(() => {
    if (!citizenProfile || citizenProfile.name === UNKNOWN) return [];
    
    const matches = new Set<ResourceData>();
    const lowerOcc = (citizenProfile.occupation || '').toString().toLowerCase();
    const income = typeof citizenProfile.annualIncome === 'number' ? citizenProfile.annualIncome : 9999999;
    const age = typeof citizenProfile.age === 'number' ? citizenProfile.age : 30;

    RESOURCES_DB.forEach(res => {
      let score = 0;
      if (res.targetKeywords.includes('student') && lowerOcc.includes('student')) score++;
      if (res.targetKeywords.includes('farmer') && lowerOcc.includes('farmer')) score++;
      if (res.targetKeywords.includes('low income') && income <= 300000) score++;
      if (res.targetKeywords.includes('senior') && age >= 60) score++;
      if (res.targetKeywords.includes('scholarship') && lowerOcc.includes('student')) score++;
      
      if (score > 0) matches.add(res);
    });
    return Array.from(matches);
  }, [citizenProfile]);

  const filteredResources = useMemo(() => {
    return RESOURCES_DB.filter(res => {
      const matchCat = activeCategory === 'All' || res.category === activeCategory;
      const matchQuery = res.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         res.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8 relative">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Government Resource Hub</h1>
        <p className="text-gray-600 mt-2">Official guidelines, services, and how-to instructions.</p>
      </motion.div>

      {/* ── SEARCH & CATEGORIES ────────────────────────────────────────── */}
      <div className="space-y-4">
        <GlassInput
          leftIcon={<Search className="w-5 h-5" />}
          placeholder="What government service or resource are you looking for? (e.g., Aadhaar, Scholarship)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── PERSONALIZED RESOURCES ─────────────────────────────────────── */}
      {recommendations.length > 0 && searchQuery === '' && activeCategory === 'All' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Recommended for You
          </h2>
          <p className="text-sm text-gray-600">Based on your profile as a {citizenProfile.age}yr old {citizenProfile.occupation} from {citizenProfile.state}.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map(res => (
              <ResourceCard key={res.id} resource={res} onClick={() => setSelectedResource(res)} />
            ))}
          </div>
        </motion.div>
      )}

      {/* ── ALL RESOURCES ──────────────────────────────────────────────── */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">
          {searchQuery ? 'Search Results' : activeCategory === 'All' ? 'All Resources' : activeCategory}
        </h2>
        
        {filteredResources.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 border border-dashed border-gray-300 rounded-xl">
            <p className="text-gray-500">No resources found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map(res => (
              <ResourceCard key={res.id} resource={res} onClick={() => setSelectedResource(res)} />
            ))}
          </div>
        )}
      </div>

      {/* ── MODAL ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedResource && (
          <ResourceModal resource={selectedResource} onClose={() => setSelectedResource(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── SUBCOMPONENTS ─────────────────────────────────────────────────

function ResourceCard({ resource, onClick }: { resource: ResourceData; onClick: () => void }) {
  return (
    <GlassCard className="p-5 flex flex-col h-full hover:shadow-md transition-all border border-gray-200">
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
          {resource.category}
        </span>
        {resource.isOfficial && (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            <ShieldCheck className="w-3 h-3" /> Official Source
          </span>
        )}
      </div>
      <h3 className="font-bold text-gray-900 text-lg mb-2">{resource.name}</h3>
      <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">{resource.description}</p>
      
      <div className="mt-auto border-t border-gray-100 pt-3">
        <p className="text-xs text-gray-500 mb-2 font-medium">Who may need this?</p>
        <p className="text-xs text-gray-700 line-clamp-1 mb-3">{resource.whoIsItFor}</p>
        <button 
          onClick={onClick}
          className="w-full text-sm font-semibold text-blue-600 bg-white border border-blue-200 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-1"
        >
          View Details <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </GlassCard>
  );
}

function ResourceModal({ resource, onClose }: { resource: ResourceData; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-gray-50">
          <div>
            <div className="flex gap-2 mb-2">
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">{resource.category}</span>
              {resource.isOfficial ? (
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" /> Official Information
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Unverified</span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{resource.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Info className="w-4 h-4" /> What is it?</h3>
            <p className="text-gray-800">{resource.description}</p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><User className="w-4 h-4" /> Who is it for?</h3>
            <p className="text-gray-800">{resource.whoIsItFor}</p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Benefits / Purpose</h3>
            <p className="text-gray-800">{resource.benefits}</p>
          </section>

          <section className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-2">Eligibility</h3>
            <p className="text-blue-900">{resource.eligibility}</p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><FileText className="w-4 h-4" /> Required Documents</h3>
            <ul className="list-disc pl-5 text-gray-800 space-y-1">
              {resource.requiredDocuments.map((doc, idx) => <li key={idx}>{doc}</li>)}
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Building className="w-4 h-4" /> How to Apply</h3>
            <p className="text-gray-800 whitespace-pre-wrap">{resource.howToApply}</p>
          </section>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs text-gray-500">
              <p className="font-semibold text-gray-700">Official Source:</p>
              <a href={resource.officialSource.startsWith('http') ? resource.officialSource : '#'} target="_blank" className="text-blue-600 hover:underline">
                {resource.officialSource}
              </a>
              <p className="mt-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Last Verified: {resource.lastVerified}</p>
            </div>
            
            {resource.isOfficial ? (
              <a href={resource.officialSource.startsWith('http') ? resource.officialSource : '#'} target="_blank">
                <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
                  Go to Official Portal
                </button>
              </a>
            ) : (
              <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-200 max-w-[200px]">
                This information could not be verified from an official government source.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Ensure Sparkles icon exists for recommendations
function Sparkles(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  );
}
