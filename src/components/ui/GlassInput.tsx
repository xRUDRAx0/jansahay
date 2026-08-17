"use client";

import React from "react";

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightActions?: React.ReactNode;
}

export default function GlassInput({
  className,
  leftIcon,
  rightActions,
  ...props
}: GlassInputProps) {
  return (
    <div className={`relative flex items-center glass-card rounded-full overflow-hidden p-1 ${className || ''}`}>
      {leftIcon && <div className="pl-3 pr-2 flex items-center text-gray-400">{leftIcon}</div>}
      <input
        className="flex-1 bg-transparent border-none focus:ring-0 px-3 py-2 text-gray-700 placeholder-gray-400 text-sm outline-none w-full"
        {...props}
      />
      {rightActions && <div className="pr-1 flex items-center gap-1">{rightActions}</div>}
    </div>
  );
}
