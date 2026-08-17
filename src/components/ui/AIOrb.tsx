"use client";

import React from "react";
import { motion } from "framer-motion";

interface AIOrbProps {
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
}

export default function AIOrb({ size = 'md', animate = true, className }: AIOrbProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-24 h-24",
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${className || ''}`}>
      {animate && (
        <>
          <div className="absolute inset-0 rounded-full bg-[#1a56db] animate-pulse-ring opacity-20"></div>
          <div className="absolute inset-0 rounded-full bg-[#3b82f6] animate-pulse-ring opacity-10" style={{ animationDelay: '1s' }}></div>
        </>
      )}
      <motion.div 
        className="relative w-full h-full rounded-full bg-gradient-to-br from-[#1a56db] to-[#3b82f6] shadow-lg flex items-center justify-center"
        animate={animate ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-[60%] h-[60%] rounded-full bg-white/20 backdrop-blur-sm"></div>
      </motion.div>
    </div>
  );
}
