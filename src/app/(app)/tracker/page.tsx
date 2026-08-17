'use client';

import { useDemo } from '@/lib/demo/context';
import { demoApplications } from '@/lib/demo/data';
import { StatusBadge, GlassCard } from '@/components/ui';
import { motion } from 'framer-motion';

export default function TrackerPage() {
  const { state } = useDemo();

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Application Tracker</h1>
        <p className="text-gray-600 mt-2">Track the status of your submitted applications.</p>
      </motion.div>

      <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm mb-6 border border-yellow-200">
        DEMO STATUS — simulated tracking
      </div>

      <div className="grid gap-4">
        {demoApplications.map((app) => (
          <GlassCard key={app.id} className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{app.serviceName}</h3>
                <p className="text-sm text-gray-500 mt-1">ID: {app.id}</p>
              </div>
              <StatusBadge status={app.status === 'completed' || app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'danger' : app.status === 'action-required' ? 'warning' : 'info'} label={app.status.replace('-', ' ').toUpperCase()} />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-gray-500 mb-1">Submitted</p>
                <p className="font-medium">{app.submittedAt}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Last Updated</p>
                <p className="font-medium">{app.lastUpdated}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 mb-1">Next Action</p>
                <p className="font-medium text-blue-600">{app.nextAction || 'Under Review'}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
