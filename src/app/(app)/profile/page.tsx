'use client';

import { useDemo } from '@/lib/demo/context';
import { GlassCard, GlassInput, GlassButton } from '@/components/ui';
import { User, Mail, MapPin, Briefcase, CheckCircle2, AlertTriangle } from 'lucide-react';
import { UNKNOWN } from '@/types/engine';
import { FormEvent } from 'react';

export default function ProfilePage() {
  const { state, isDemo, citizenProfile, updateCitizenProfile, clearSession } = useDemo() as any;
  const { profile } = state;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDemo) return;
    const formData = new FormData(e.currentTarget);
    const updates: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (value && value !== UNKNOWN && value !== 'Not provided') {
        updates[key] = value;
      }
    });
    if (updateCitizenProfile) {
      updateCitizenProfile(updates);
    }
  };

  const FieldStatus = ({ value, label, name, type = 'text', icon }: { value: any, label: string, name: string, type?: string, icon?: React.ReactNode }) => {
    const isUnknown = value === UNKNOWN || !value;
    const displayValue = isUnknown ? 'Not provided' : value;
    
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
          {label}
          {isUnknown ? (
            <span className="flex items-center text-amber-500 text-xs"><AlertTriangle className="w-3 h-3 mr-1"/> ⚠</span>
          ) : (
            <span className="flex items-center text-green-500 text-xs"><CheckCircle2 className="w-3 h-3 mr-1"/> ✓</span>
          )}
        </label>
        {isDemo ? (
          <div className="p-3 bg-white/50 border border-white/40 rounded-xl text-gray-800 text-sm flex items-center gap-2">
            {icon && <span className="text-gray-400">{icon}</span>}
            {displayValue}
          </div>
        ) : (
          <GlassInput name={name} type={type} defaultValue={isUnknown ? '' : value} placeholder="Not provided" leftIcon={icon} />
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      {isDemo ? (
        <div className="bg-purple-100 text-purple-800 p-3 rounded-lg flex items-center justify-between font-medium">
          <span>🧪 Demo Mode — Rohit Sharma</span>
        </div>
      ) : (
        <div className="bg-blue-100 text-blue-800 p-3 rounded-lg flex items-center justify-between font-medium">
          <span>🔵 Live Mode</span>
          {clearSession && (
            <button onClick={clearSession} className="text-sm bg-blue-200 hover:bg-blue-300 px-3 py-1 rounded">
              Start New Session
            </button>
          )}
        </div>
      )}

      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          <User className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{isDemo ? profile.name : (citizenProfile?.name && citizenProfile?.name !== UNKNOWN ? citizenProfile?.name : 'Guest')}</h1>
          <p className="text-gray-500 flex items-center gap-1">
            <Mail className="w-4 h-4" /> {state.user.email || 'No email provided'}
          </p>
          {isDemo && (
            <span className="inline-block mt-2 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded font-medium">
              Demo Account
            </span>
          )}
        </div>
      </div>

      <GlassCard className="p-6 space-y-6">
        <h2 className="text-xl font-semibold border-b pb-4">Personal Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <FieldStatus label="Full Name" name="name" value={citizenProfile?.name} icon={<User className="w-4 h-4"/>} />
            <FieldStatus label="Age" name="age" type="number" value={citizenProfile?.age} />
            <FieldStatus label="Gender" name="gender" value={citizenProfile?.gender} />
            <FieldStatus label="State" name="state" value={citizenProfile?.state} icon={<MapPin className="w-4 h-4"/>} />
            <FieldStatus label="District" name="district" value={citizenProfile?.district} />
            <FieldStatus label="Occupation" name="occupation" value={citizenProfile?.occupation} icon={<Briefcase className="w-4 h-4"/>} />
            <FieldStatus label="Education" name="education" value={citizenProfile?.education} />
            <FieldStatus label="Annual Income" name="income" type="number" value={citizenProfile?.income} />
            <FieldStatus label="Category" name="category" value={citizenProfile?.category} />
            <FieldStatus label="Disability" name="disability" value={citizenProfile?.disability} />
            <FieldStatus label="Marital Status" name="maritalStatus" value={citizenProfile?.maritalStatus} />
          </div>
          {!isDemo && (
            <div className="pt-4 border-t flex justify-end">
              <button type="submit" className="bg-[#1a56db] text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                Save Changes
              </button>
            </div>
          )}
        </form>
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
