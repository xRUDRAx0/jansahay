'use client';

import { GlassCard, GlassInput } from '@/components/ui';
import { Search, Book, FileText, HeartPulse, GraduationCap, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const RESOURCES = [
  { title: 'Education', icon: GraduationCap, color: 'text-blue-500', bg: 'bg-blue-50' },
  { title: 'Healthcare', icon: HeartPulse, color: 'text-red-500', bg: 'bg-red-50' },
  { title: 'Employment', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50' },
  { title: 'Documents', icon: FileText, color: 'text-green-500', bg: 'bg-green-50' },
];

export default function ResourcesPage() {
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
        <p className="text-gray-600 mt-2">Knowledge base and official guidelines.</p>
      </motion.div>

      <GlassInput
        leftIcon={<Search className="w-5 h-5" />}
        placeholder="Search for articles, guides, or rules..."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {RESOURCES.map((res, i) => (
          <Link key={res.title} href={`/discover?category=${res.title}`}>
            <GlassCard className="p-6 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow cursor-pointer aspect-square">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${res.bg}`}>
                <res.icon className={`w-8 h-8 ${res.color}`} />
              </div>
              <h3 className="font-semibold text-gray-800">{res.title}</h3>
            </GlassCard>
          </Link>
        ))}
      </div>
      
      <GlassCard className="p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Book className="w-5 h-5 text-blue-600" />
          Popular Guides
        </h3>
        <ul className="space-y-4">
          <li><a href="#" className="text-blue-600 hover:underline">How to apply for an Income Certificate</a></li>
          <li><a href="#" className="text-blue-600 hover:underline">Understanding EWS Quota Eligibility</a></li>
          <li><a href="#" className="text-blue-600 hover:underline">Required documents for Ayushman Bharat</a></li>
        </ul>
      </GlassCard>
    </div>
  );
}
