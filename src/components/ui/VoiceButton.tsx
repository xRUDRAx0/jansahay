"use client";

import React, { useState, useCallback } from "react";
import { Mic, Square } from "lucide-react";
import { motion } from "framer-motion";

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export default function VoiceButton({ onTranscript, className }: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false);

  const toggleListen = useCallback(() => {
    // Mock implementation for browser SpeechRecognition
    // In a real app, instantiate webkitSpeechRecognition here
    setIsListening(prev => !prev);
    if (!isListening) {
      setTimeout(() => {
        onTranscript("This is a simulated transcript from voice input.");
        setIsListening(false);
      }, 3000);
    }
  }, [isListening, onTranscript]);

  return (
    <button
      onClick={toggleListen}
      className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a56db] focus:ring-offset-2
        ${isListening ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
        ${className || ''}
      `}
      title={isListening ? "Stop listening" : "Start voice input"}
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
