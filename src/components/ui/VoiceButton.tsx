"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Mic, Square, MicOff } from "lucide-react";
import { motion } from "framer-motion";

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

function getSpeechRecognition(): (new () => any) | null {
  if (typeof window === 'undefined') return null;
  const W = window as any;
  return W.SpeechRecognition || W.webkitSpeechRecognition || null;
}

export default function VoiceButton({ onTranscript, className }: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(null); // null = not checked yet
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setIsSupported(!!getSpeechRecognition());
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognitionAPI = getSpeechRecognition();
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;

    recognition.lang = 'en-IN'; // Indian English
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.warn('[Voice] Recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    try {
      recognition.start();
    } catch (e) {
      console.warn('[Voice] Could not start recognition:', e);
      setIsListening(false);
    }
  }, [onTranscript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const toggleListen = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Not yet checked
  if (isSupported === null) {
    return (
      <button
        disabled
        className={`relative w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-400 ${className || ''}`}
        title="Loading voice support..."
      >
        <Mic className="w-5 h-5" />
      </button>
    );
  }

  // Not supported — show disabled state with tooltip
  if (!isSupported) {
    return (
      <button
        disabled
        className={`relative w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-400 cursor-not-allowed ${className || ''}`}
        title="Voice input not supported in this browser. Please type your message."
      >
        <MicOff className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleListen}
      className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a56db] focus:ring-offset-2
        ${isListening ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
        ${className || ''}
      `}
      title={isListening ? "Stop listening" : "Start voice input (Hindi & English supported)"}
    >
      {isListening ? (
        <>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-red-400"
            animate={{ scale: [1, 1.5], opacity: [1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <Square className="w-4 h-4 fill-current" />
        </>
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  );
}
