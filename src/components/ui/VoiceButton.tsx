'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2, Brain, CheckCircle, XCircle } from 'lucide-react';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export type VoiceState = 'idle' | 'listening' | 'transcribing' | 'thinking' | 'responding' | 'error';

export interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  voiceState?: VoiceState;
  transcript?: string;
  className?: string;
}

const SpeechRecognitionAPI = typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : null;

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onTranscript,
  voiceState: externalVoiceState,
  transcript = '',
  className
}) => {
  const [internalState, setInternalState] = useState<VoiceState>('idle');
  const [lang, setLang] = useState<'en-IN' | 'hi-IN'>('en-IN');
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(true);

  const currentState = externalVoiceState || internalState;

  useEffect(() => {
    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      return;
    }
    const rec = new SpeechRecognitionAPI();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = lang;

    rec.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onTranscript(text);
      setInternalState('idle');
    };

    rec.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setInternalState('error');
      setTimeout(() => setInternalState('idle'), 2000);
    };

    rec.onend = () => {
      if (internalState === 'listening') {
        setInternalState('idle');
      }
    };

    setRecognition(rec);
  }, [lang, onTranscript, internalState]);

  const toggleLanguage = () => {
    setLang(l => l === 'en-IN' ? 'hi-IN' : 'en-IN');
  };

  const handleToggle = () => {
    if (!recognition) return;

    if (currentState === 'listening') {
      recognition.stop();
      setInternalState('idle');
    } else {
      try {
        setInternalState('listening');
        recognition.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!isSupported) {
    return (
      <button 
        disabled 
        className={cn("p-2 rounded-full bg-gray-200 text-gray-500 cursor-not-allowed flex items-center justify-center relative group", className)}
        title="Speech API not supported"
      >
        <MicOff size={20} />
      </button>
    );
  }

  const renderIcon = () => {
    switch (currentState) {
      case 'listening':
        return <Mic size={20} className="text-white animate-pulse" />;
      case 'transcribing':
        return <Loader2 size={20} className="text-white animate-spin" />;
      case 'thinking':
        return <Brain size={20} className="text-white animate-pulse" />;
      case 'responding':
        return <CheckCircle size={20} className="text-white" />;
      case 'error':
        return <XCircle size={20} className="text-white" />;
      default:
        return <Mic size={20} className="text-gray-700" />;
    }
  };

  const renderBackground = () => {
    switch (currentState) {
      case 'listening':
        return 'bg-red-500 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
      case 'transcribing':
        return 'bg-amber-500 hover:bg-amber-600';
      case 'thinking':
        return 'bg-blue-500 hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]';
      case 'responding':
        return 'bg-green-500 hover:bg-green-600';
      case 'error':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-gray-100 hover:bg-gray-200 border border-gray-300';
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="flex items-center gap-2">
        <button
          onClick={handleToggle}
          className={cn(
            "p-3 rounded-full transition-all duration-300 flex items-center justify-center relative",
            renderBackground()
          )}
          title={currentState === 'idle' ? 'Start speaking' : 'Stop'}
        >
          {currentState === 'listening' && (
            <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75"></span>
          )}
          {renderIcon()}
        </button>
        <button 
          onClick={toggleLanguage}
          className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
          title="Toggle language"
        >
          {lang === 'en-IN' ? 'EN' : 'HI'}
        </button>
      </div>
      
      {transcript && currentState === 'listening' && (
        <div className="text-sm text-gray-600 italic">
          "{transcript}"
        </div>
      )}
      
      {currentState !== 'idle' && currentState !== 'listening' && !transcript && (
        <span className="text-xs font-medium text-gray-500 capitalize">
          {currentState}...
        </span>
      )}
    </div>
  );
};
export default VoiceButton;
