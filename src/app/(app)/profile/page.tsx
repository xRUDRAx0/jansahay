'use client';

import { useDemo } from '@/lib/demo/context';
import { GlassCard, GlassInput, GlassButton } from '@/components/ui';
import { User, Mail, MapPin, Briefcase } from 'lucide-react';

export default function ProfilePage() {
  const { state, updateProfile } = useDemo();
  const { profile } = state;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          <User className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
          <p className="text-gray-500 flex items-center gap-1">
            <Mail className="w-4 h-4" /> {state.user.email || 'No email provided'}
          </p>
          <span className="inline-block mt-2 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded font-medium">
            Demo Account
          </span>
        </div>
      </div>

      <GlassCard className="p-6 space-y-6">
        <h2 className="text-xl font-semibold border-b pb-4">Personal Details</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <GlassInput defaultValue={profile.name} leftIcon={<User className="w-4 h-4"/>} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <GlassInput defaultValue={profile.age?.toString()} type="number" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <GlassInput defaultValue={profile.location} leftIcon={<MapPin className="w-4 h-4"/>} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
            <GlassInput defaultValue={profile.occupation} leftIcon={<Briefcase className="w-4 h-4"/>} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Income (Annual)</label>
            <GlassInput defaultValue={profile.income?.toString()} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
            <GlassInput defaultValue={profile.education} />
          </div>
        </div>
        <div className="pt-4 border-t flex justify-end">
          <GlassButton variant="primary">Save Changes</GlassButton>
        </div>
      </GlassCard>

      <GlassCard className="p-6 space-y-4 border-red-100 bg-red-50/30">
        <h2 className="text-xl font-semibold text-red-900">Privacy Controls</h2>
        <p className="text-sm text-red-700">Manage your data and privacy settings.</p>
        <button className="text-red-600 text-sm font-medium hover:underline">
          Download My Data
        </button>
      </GlassCard>
    </div>
  );
}
