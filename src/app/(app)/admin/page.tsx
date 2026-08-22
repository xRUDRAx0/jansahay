'use client';

import React from 'react';
import { useDemo } from '@/lib/demo/context';
import { 
  Users, FileText, IndianRupee, AlertCircle, 
  TrendingUp, Activity, MapPin, CheckCircle2 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboardPage() {
  const { isDemo } = useDemo();

  const stats = [
    { label: 'Total Citizens Onboarded', value: '14,250', trend: '+12% this month', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Applications', value: '3,124', trend: '+5% this week', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Funds Disbursed (Est.)', value: '₹1.2 Cr', trend: 'Matched across 45 schemes', icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Verifications', value: '412', trend: 'Requires attention', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const topSchemes = [
    { name: 'Ayushman Bharat PM-JAY', applications: 1245, growth: '+24%' },
    { name: 'PM-Kisan Samman Nidhi', applications: 982, growth: '+18%' },
    { name: 'Post-Matric Scholarship for SC', applications: 654, growth: '+12%' },
    { name: 'Pradhan Mantri Awas Yojana (U)', applications: 432, growth: '+5%' },
    { name: 'Sukanya Samriddhi Yojana', applications: 310, growth: '+32%' },
  ];

  const recentAlerts = [
    { type: 'Anomaly Detected', message: 'Spike in Domicile certificates uploaded from Ward 42.', time: '2 hours ago', severity: 'high' },
    { type: 'AI Verification', message: '14 Income certificates successfully auto-verified by Gemini.', time: '5 hours ago', severity: 'low' },
    { type: 'Scheme Expiring', message: 'Application deadline for CSSS scholarship approaching in 5 days.', time: '1 day ago', severity: 'medium' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Nodal Officer Dashboard
            {isDemo && (
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider">
                B2G Prototype
              </span>
            )}
          </h1>
          <p className="text-gray-600 mt-1">Real-time analytics for government scheme penetration and delivery.</p>
        </div>
        <div className="flex items-center gap-3 bg-white border rounded-xl p-2 px-4 shadow-sm">
          <MapPin className="w-5 h-5 text-gray-400" />
          <div className="text-sm">
            <span className="text-gray-500">Region: </span>
            <span className="font-semibold text-gray-900">North West Delhi</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> {stat.trend}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Col: Demographics & Top Schemes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Demographic Bars */}
          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-blue-500" /> AI-Driven Demographic Insights
            </h3>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Gender Distribution (Beneficiaries)</span>
                  <span className="text-gray-500">Female: 58% | Male: 42%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="bg-purple-500 h-full" style={{ width: '58%' }} />
                  <div className="bg-blue-500 h-full" style={{ width: '42%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Age Groups Reached</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Youth (18-25)', pct: 45, color: 'bg-green-500' },
                    { label: 'Adults (26-50)', pct: 35, color: 'bg-emerald-500' },
                    { label: 'Seniors (50+)', pct: 20, color: 'bg-teal-500' },
                  ].map(age => (
                    <div key={age.label} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-24">{age.label}</span>
                      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${age.color}`} style={{ width: `${age.pct}%` }} />
                      </div>
                      <span className="text-xs font-medium text-gray-700 w-8">{age.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Schemes */}
          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Demanded Schemes</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 font-medium text-gray-500">Scheme Name</th>
                    <th className="pb-3 font-medium text-gray-500 text-right">Active Applications</th>
                    <th className="pb-3 font-medium text-gray-500 text-right">MoM Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topSchemes.map(scheme => (
                    <tr key={scheme.name}>
                      <td className="py-3 font-medium text-gray-900">{scheme.name}</td>
                      <td className="py-3 text-right font-semibold text-gray-700">{scheme.applications}</td>
                      <td className="py-3 text-right text-green-600 font-medium">{scheme.growth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Col: Alerts & AI logs */}
        <div className="space-y-6">
          
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-6 shadow-sm text-white">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> AI Document Verification
            </h3>
            <p className="text-slate-300 text-sm mb-4 leading-relaxed">
              JANSAHAY's Gemini Vision integration has automatically processed and pre-verified documents this week, reducing manual officer workload.
            </p>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="text-3xl font-bold text-white mb-1">84%</div>
              <div className="text-xs text-emerald-400 font-medium uppercase tracking-wider">Automated Processing Rate</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
            <div className="space-y-4">
              {recentAlerts.map((alert, i) => (
                <div key={i} className="flex gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="mt-0.5">
                    {alert.severity === 'high' ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : alert.severity === 'medium' ? (
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${
                      alert.severity === 'high' ? 'text-red-800' : alert.severity === 'medium' ? 'text-amber-800' : 'text-blue-800'
                    }`}>
                      {alert.type}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5 leading-snug">{alert.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
