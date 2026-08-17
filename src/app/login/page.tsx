'use client';

import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';
import GlassInput from '@/components/ui/GlassInput';
import GlassButton from '@/components/ui/GlassButton';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f8faff] flex flex-col items-center justify-center p-4">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#1a56db] flex items-center justify-center text-white font-bold text-xl">J</div>
        <span className="text-2xl font-bold tracking-tight text-gray-900">JANSAHAY</span>
      </Link>
      
      <GlassCard className="w-full max-w-md p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Sign In</h2>
        
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <GlassInput type="email" placeholder="you@example.com" />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <GlassInput type="password" placeholder="••••••••" />
          </div>
          
          <div className="pt-2">
            <GlassButton variant="primary" className="w-full justify-center">
              Sign In
            </GlassButton>
          </div>
        </form>
        
        <div className="mt-6 flex items-center gap-4">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-sm text-gray-500">or</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>
        
        <div className="mt-6">
          <Link href="/demo">
            <GlassButton variant="secondary" className="w-full justify-center">
              Explore Demo
            </GlassButton>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
