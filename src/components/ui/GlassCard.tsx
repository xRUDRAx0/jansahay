"use client";

import React from "react";


interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function GlassCard({
  children,
  className,
  hover = false,
  padding = 'md',
  ...props
}: GlassCardProps) {
  const paddingClass = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }[padding];

  return (
    <div
      className={`glass-card rounded-2xl transition-all duration-200 ${
        hover ? 'hover:shadow-md hover:-translate-y-0.5' : ''
      } ${paddingClass} ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
}
