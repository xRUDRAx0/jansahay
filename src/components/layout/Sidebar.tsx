"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bot, Compass, Route, FileText, LayoutGrid, ShieldCheck, BookOpen, Bell, User, Settings, ArrowRight, PieChart } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const topLinks = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/agent', label: 'AI Agent', icon: Bot },
    { href: '/discover', label: 'Discover', icon: Compass },
    { href: '/journeys', label: 'Journeys', icon: Route },
    { href: '/documents', label: 'Documents', icon: FileText },
    { href: '/tracker', label: 'Tracker', icon: LayoutGrid },
    { href: '/verify', label: 'Verify', icon: ShieldCheck },
    { href: '/resources', label: 'Resources', icon: BookOpen },
  ];

  const bottomLinks = [
    { href: '/admin', label: 'Admin View', icon: PieChart },
    { href: '/notifications', label: 'Notifications', icon: Bell },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 glass-sidebar z-40">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0f2147] flex items-center justify-center text-white font-bold text-xl">
            J
          </div>
          <div className="flex flex-col">
            <span className="text-[#0f2147] font-bold text-lg leading-tight tracking-tight">JANSAHAY</span>
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Public-Service Copilot</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {topLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-[#e6eaf5] text-[#0f2147]' 
                  : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 space-y-1">
        <div className="h-px bg-gray-200 mx-3 mb-4" />
        {bottomLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-[#e6eaf5] text-[#0f2147]' 
                  : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
        <div className="mt-4 pt-2">
          <Link href="/discover" className="flex items-center justify-center gap-2 w-full bg-[#0f2147] hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl font-medium transition-colors">
            <ArrowRight className="w-4 h-4" />
            <span>Start Journey</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
