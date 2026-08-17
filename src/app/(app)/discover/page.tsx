'use client';

import { useState } from 'react';
import { useDemo } from '@/lib/demo/context';
import { GlassInput, ServiceCard } from '@/components/ui';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = ['All', 'Agriculture', 'Healthcare', 'Education', 'Housing'];

export default function DiscoverPage() {
  const { state } = useDemo();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Discover Services</h1>
        <p className="text-gray-600 mt-2">Find relevant government services tailored to your needs.</p>
      </motion.div>

      <div className="space-y-4">
        <GlassInput
          leftIcon={<Search className="w-5 h-5" />}
          placeholder="Describe your situation or need..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.serviceMatches?.map((match: any) => (
          <ServiceCard
            key={match.service.id}
            service={{
              id: match.service.id,
              title: match.service.title,
              category: match.service.category,
              matchLevel: match.matchLevel === 'high' ? 'high' : match.matchLevel === 'medium' ? 'medium' : 'verification_needed'
            }}
          />
        ))}
      </div>
    </div>
  );
}
