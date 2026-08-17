'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Calendar, Briefcase, Wallet } from 'lucide-react';
import { useDemo } from '@/lib/demo/context';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import AIOrb from '@/components/ui/AIOrb';
import AgentActivity from '@/components/ui/AgentActivity';

export default function AgentPage() {
  const { state, agentSteps, sendMessage } = useDemo();
  const profile = state.profile;
  const conversation = state.conversations;
  const demoAgentSteps = agentSteps;
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] max-w-7xl mx-auto w-full gap-6 p-4">
      
      {/* Left Panel: Chat */}
      <div className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-white/50 backdrop-blur-sm z-10">
          <h2 className="text-xl font-bold text-gray-900">Workspace Assistant</h2>
          <p className="text-sm text-gray-500">How can I assist you today?</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/30">
          {conversation.map((msg: any) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'bg-blue-100 text-blue-900 rounded-2xl rounded-tr-sm px-4 py-3' : 'bg-white border border-gray-200 border-l-4 border-l-[#1a56db] rounded-2xl rounded-tl-sm p-4 shadow-sm'}`}>
                {msg.role === 'agent' && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-[#1a56db] flex items-center justify-center text-white text-xs font-bold">J</div>
                    <span className="font-semibold text-gray-900 text-sm">JANSAHAY</span>
                  </div>
                )}
                
                <div className="text-gray-800 whitespace-pre-wrap">{msg.content}</div>
                
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 pt-2">
                    {msg.actions.map((action: any, i: number) => (
                      <GlassButton 
                        key={i} 
                        variant={action.primary ? 'primary' : 'secondary'}
                        className="text-sm px-4 py-1.5"
                      >
                        {action.label}
                      </GlassButton>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="relative flex items-center">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your response..."
              className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-full py-3 pl-4 pr-12 transition-all outline-none"
            />
            <button 
              onClick={handleSend}
              className="absolute right-2 p-2 bg-[#1a56db] text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Context & Activity */}
      <div className="hidden lg:flex w-80 xl:w-96 flex-col gap-4">
        <GlassCard className="p-6 flex flex-col items-center border-t-4 border-t-[#1a56db]">
          <AIOrb size="lg" className="mb-4" />
          <div className="w-full">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">PANEL HEADER</h3>
            <h2 className="text-lg font-bold text-gray-900 mb-4">JANSAHAY ACTIVITY</h2>
            
            <div className="bg-gray-50 rounded-xl p-1 max-h-[250px] overflow-y-auto custom-scrollbar">
              <AgentActivity steps={demoAgentSteps} />
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-5 flex-1">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">PROFILE SUMMARY</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Location</span>
              </div>
              <div className="font-semibold text-gray-900">{profile?.location || 'Rajasthan'}</div>
            </div>
            
            <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Age</span>
              </div>
              <div className="font-semibold text-gray-900">{profile?.age || '19'}</div>
            </div>
            
            <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <Briefcase className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Occupation</span>
              </div>
              <div className="font-semibold text-gray-900">{profile?.occupation || 'Student'}</div>
            </div>
            
            <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <Wallet className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Income</span>
              </div>
              <div className="font-semibold text-gray-900">{profile?.income || '₹2L'}</div>
            </div>
          </div>
        </GlassCard>
      </div>

    </div>
  );
}
