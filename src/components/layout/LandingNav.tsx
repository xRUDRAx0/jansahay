"use client";

import React from "react";
import Link from "next/link";
import GlassButton from "../ui/GlassButton";

export default function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1a56db] flex items-center justify-center text-white font-bold text-xl">
                J
              </div>
              <span className="text-[#1a56db] font-bold text-xl tracking-tight">JANSAHAY</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How it works</Link>
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
            <Link href="#trust" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Trust & Safety</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth" className="text-sm font-medium text-[#1a56db] hover:text-blue-800 hidden sm:block">
              Sign In
            </Link>
            <Link href="/dashboard">
              <GlassButton variant="primary" size="sm">
                Try JANSAHAY
              </GlassButton>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
