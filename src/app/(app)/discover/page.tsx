'use client';

import { useState, useMemo } from 'react';
import { useDemo } from '@/lib/demo/context';
import { GlassInput, ServiceCard } from '@/components/ui';
import { Search, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['All', 'Education', 'Healthcare', 'Employment', 'Housing', 'Agriculture', 'Social Security', 'Senior Citizens'];

export default function DiscoverPage() {
  const { state } = useDemo();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter matches based on search + category
  const filtered = useMemo(() => {
    let results = state.serviceMatches ?? [];

    if (selectedCategory !== 'All') {
      results = results.filter((m: any) => {
        const cat = m.scheme?.category ?? m.service?.category ?? '';
        return cat === selectedCategory;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter((m: any) => {
        const title = m.scheme?.name ?? m.service?.title ?? '';
        const desc = m.scheme?.description ?? m.service?.description ?? '';
        const keywords = m.scheme?.keywords ?? m.service?.tags ?? [];
        return (
          title.toLowerCase().includes(q) ||
          desc.toLowerCase().includes(q) ||
          keywords.some((k: string) => k.toLowerCase().includes(q))
        );
      });
    }

    return results;
  }, [state.serviceMatches, searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Discover Services</h1>
        <p className="text-gray-600 mt-2">Find relevant government services tailored to your needs.</p>
      </motion.div>

      <div className="space-y-4">
        <GlassInput
          leftIcon={<Search className="w-5 h-5" />}
          placeholder="Search by scheme name, category, or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchQuery.trim()) {
              router.push('/agent?q=' + encodeURIComponent(searchQuery));
            }
          }}
        />

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {filtered.length > 0
            ? `${filtered.length} service${filtered.length !== 1 ? 's' : ''} found`
            : 'No matches yet — describe your situation to the AI agent'}
        </p>
        {filtered.length > 0 && (
          <Link href="/discover/results" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((match: any) => {
          const id = match.scheme?.id ?? match.service?.id ?? '#';
          const title = match.scheme?.name ?? match.service?.title ?? 'Service';
          const category = match.scheme?.category ?? match.service?.category ?? '';
          const matchLevel: 'high' | 'medium' | 'verification_needed' =
            match.tier === 'high' ? 'high' :
            match.tier === 'medium' ? 'medium' :
            match.matchLevel === 'high' ? 'high' :
            match.matchLevel === 'medium' ? 'medium' : 'verification_needed';

          return (
            <ServiceCard
              key={id}
              service={{ id, title, category, matchLevel }}
              onClick={() => router.push(`/services/${id}`)}
            />
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-base font-medium text-gray-500">
            {searchQuery || selectedCategory !== 'All'
              ? 'No matches for this filter'
              : 'Tell the AI agent your situation to discover relevant services'}
          </p>
          <Link href="/agent" className="mt-3 inline-block text-blue-600 text-sm hover:underline">
            Talk to JANSAHAY →
          </Link>
        </div>
      )}
    </div>
  );
}
