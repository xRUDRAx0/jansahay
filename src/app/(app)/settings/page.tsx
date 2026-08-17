'use client';

import { GlassCard } from '@/components/ui';
import { Globe, Bell, Mic, ShieldAlert, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

      <GlassCard className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium text-gray-900">Language</p>
              <p className="text-sm text-gray-500">Choose your preferred language</p>
            </div>
          </div>
          <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 outline-none">
            <option>English</option>
            <option>Hindi (हिंदी)</option>
          </select>
        </div>

        <div className="flex items-center justify-between border-t pt-6">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium text-gray-900">Notifications</p>
              <p className="text-sm text-gray-500">Receive alerts for updates</p>
            </div>
          </div>
          <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
            <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-6">
          <div className="flex items-center gap-3">
            <Mic className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium text-gray-900">Voice Input</p>
              <p className="text-sm text-gray-500">Enable voice commands</p>
            </div>
          </div>
          <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
            <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6 space-y-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-gray-700" />
          Data & Privacy
        </h2>
        
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between">
          <div>
            <p className="font-medium text-red-900">Delete Account Data</p>
            <p className="text-sm text-red-700">Permanently remove all demo data</p>
          </div>
          <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </GlassCard>

      <div className="text-center text-sm text-gray-400 mt-8">
        <p>JANSAHAY AI Public-Service Copilot v1.0.0</p>
      </div>
    </div>
  );
}
