'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Calendar, Briefcase, Wallet, UserCircle2, HelpCircle, RefreshCw } from 'lucide-react';
import { useDemo } from '@/lib/demo/context';
import { UNKNOWN } from '@/types/engine';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import AIOrb from '@/components/ui/AIOrb';
import AgentActivity from '@/components/ui/AgentActivity';
import VoiceButton from '@/components/ui/VoiceButton';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AgentPageInner() {
  const { state, agentSteps, sendMessage, isAgentThinking, isDemo, citizenProfile, clearSession } = useDemo();
  const conversation = state.conversations;
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  // Pre-fill from URL query param (from dashboard search bar)
  useEffect(() => {
    const q = searchParams?.get('q');
    if (q) setInput(decodeURIComponent(q));
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSend = () => {
    if (input.trim() && !isAgentThinking) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript);
    // Auto-send after a brief moment so user can see what was recognized
    setTimeout(() => {
      if (transcript.trim()) {
        sendMessage(transcript.trim());
        setInput('');
      }
    }, 800);
  };

  // Profile summary fields
  const profileFields = [
    { icon: <MapPin className="w-3.5 h-3.5" />, label: 'Location', value: citizenProfile.state !== UNKNOWN ? (citizenProfile.district !== UNKNOWN ? `${citizenProfile.district}, ${citizenProfile.state}` : citizenProfile.state as string) : null },
    { icon: <Calendar className="w-3.5 h-3.5" />, label: 'Age', value: citizenProfile.age !== UNKNOWN ? `${citizenProfile.age} yrs` : null },
    { icon: <Briefcase className="w-3.5 h-3.5" />, label: 'Occupation', value: citizenProfile.occupation !== UNKNOWN ? citizenProfile.occupation as string : null },
    { icon: <Wallet className="w-3.5 h-3.5" />, label: 'Income', value: citizenProfile.annualIncome !== UNKNOWN ? `₹${((citizenProfile.annualIncome as number) / 100000).toFixed(1)}L/yr` : null },
  ];

  const hasProfile = profileFields.some(f => f.value !== null);

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] max-w-7xl mx-auto w-full gap-6 p-4">

      {/* Left Panel: Chat */}
      <div className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className={`p-4 border-b border-gray-100 z-10 ${isDemo ? 'bg-purple-50' : 'bg-white/50 backdrop-blur-sm'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">JANSAHAY Assistant</h2>
              <p className="text-sm text-gray-500">
                {isDemo ? '🧪 Demo Mode — Rohit Sharma' : '⚡ Live Mode — tell me your situation'}
              </p>
            </div>
            {!isDemo && clearSession && conversation.length > 0 && (
              <button
                onClick={clearSession}
                className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                title="Start a new session"
              >
                <RefreshCw className="w-3.5 h-3.5" /> New Session
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/30">

          {/* Empty state for live mode */}
          {conversation.length === 0 && !isDemo && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 space-y-4">
              <AIOrb size="lg" />
              <h3 className="text-xl font-semibold text-gray-800">Tell JANSAHAY your situation</h3>
              <p className="text-gray-500 max-w-sm">Describe your circumstances — age, state, occupation, income — and I'll find government schemes you may be eligible for.</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {[
                  'I am a 19-year-old B.Tech student from Delhi',
                  'My family income is ₹2 lakh per year',
                  'I am a farmer from Rajasthan',
                  'I lost my job recently',
                ].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => { setInput(suggestion); inputRef.current?.focus(); }}
                    className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {conversation.map((msg: any) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] sm:max-w-[75%] ${
                msg.role === 'user'
                  ? 'bg-blue-100 text-blue-900 rounded-2xl rounded-tr-sm px-4 py-3'
                  : 'bg-white border border-gray-200 border-l-4 border-l-[#1a56db] rounded-2xl rounded-tl-sm p-4 shadow-sm'
              }`}>
                {msg.role === 'agent' && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-[#1a56db] flex items-center justify-center text-white text-xs font-bold">J</div>
                    <span className="font-semibold text-gray-900 text-sm">JANSAHAY</span>
                  </div>
                )}
                {/* Render markdown-style bold */}
                <div className="text-gray-800 text-sm whitespace-pre-wrap">
                  {msg.content.split(/(\*\*[^*]+\*\*|_[^_]+_)/).map((part: string, i: number) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={i}>{part.slice(2, -2)}</strong>;
                    }
                    if (part.startsWith('_') && part.endsWith('_')) {
                      return <em key={i} className="text-gray-500 text-xs">{part.slice(1, -1)}</em>;
                    }
                    return <span key={i}>{part}</span>;
                  })}
                </div>

                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 pt-2">
                    {msg.actions.map((action: any, i: number) => (
                      <Link key={i} href={action.data?.url || '/discover'}>
                        <GlassButton variant={i === 0 ? 'primary' : 'secondary'} className="text-sm px-4 py-1.5">
                          {action.label}
                        </GlassButton>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Thinking indicator */}
          {isAgentThinking && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-4 shadow-sm">
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                  <span className="text-xs text-gray-500 ml-2">Thinking…</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100 flex flex-col gap-2">
          {/* We place VoiceButton outside the input now since it has a transcript display and is wider */}
          <div className="flex justify-center mb-2">
             <VoiceButton 
               onTranscript={handleVoiceTranscript} 
               voiceState={isAgentThinking ? 'thinking' : undefined} 
             />
          </div>
          
          <div className="relative flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isDemo ? "Ask about Rohit's schemes…" : "Describe your situation…"}
              disabled={isAgentThinking}
              className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-full py-3 pl-4 pr-12 transition-all outline-none disabled:opacity-60"
            />
            <button
              onClick={handleSend}
              disabled={isAgentThinking || !input.trim()}
              className="absolute right-2 p-2 bg-[#1a56db] text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            JANSAHAY guidance is preliminary. Final eligibility is determined by the concerned government authority.
          </p>
        </div>
      </div>

      {/* Right Panel: Context & Activity */}
      <div className="hidden lg:flex w-80 xl:w-96 flex-col gap-4">
        <GlassCard className="p-6 flex flex-col items-center border-t-4 border-t-[#1a56db]">
          <AIOrb size="lg" className="mb-4" />
          <div className="w-full">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">STATUS</h3>
            <h2 className="text-lg font-bold text-gray-900 mb-4">JANSAHAY ACTIVITY</h2>
            <div className="bg-gray-50 rounded-xl p-1 max-h-[250px] overflow-y-auto">
              <AgentActivity steps={agentSteps.length > 0 ? agentSteps : [
                { id: 's1', label: 'Understanding situation', status: 'pending' },
                { id: 's2', label: 'Searching knowledge base', status: 'pending' },
                { id: 's3', label: 'Comparing requirements', status: 'pending' },
                { id: 's4', label: 'Checking documents', status: 'pending' },
                { id: 's5', label: 'Building recommendation', status: 'pending' },
              ]} />
            </div>
          </div>
        </GlassCard>

        {/* Profile Summary */}
        <GlassCard className="p-5 flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {isDemo ? 'DEMO PROFILE' : 'YOUR PROFILE'}
            </h3>
            {!isDemo && (
              <Link href="/profile" className="text-xs text-blue-600 hover:underline">Edit →</Link>
            )}
          </div>

          {!hasProfile && !isDemo ? (
            <div className="text-center py-4 text-gray-400">
              <UserCircle2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No profile yet</p>
              <p className="text-xs mt-1">Tell me your situation above to build your profile</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {profileFields.map(field => (
                <div key={field.label} className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                    {field.icon}
                    <span className="text-xs font-medium">{field.label}</span>
                  </div>
                  {field.value ? (
                    <div className="font-semibold text-gray-900 text-sm">{field.value}</div>
                  ) : (
                    <div className="flex items-center gap-1 text-amber-600">
                      <HelpCircle className="w-3 h-3" />
                      <span className="text-xs">Not provided</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

export default function AgentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full text-gray-500">Loading…</div>}>
      <AgentPageInner />
    </Suspense>
  );
}
