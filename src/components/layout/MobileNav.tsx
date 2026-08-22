"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bot, Route, FileText, User } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/agent', label: 'Agent', icon: Bot },
    { href: '/journeys', label: 'Journeys', icon: Route },
    { href: '/documents', label: 'Docs', icon: FileText },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 glass-nav z-40 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          const Icon = link.icon;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl min-w-[64px] ${
                isActive ? 'text-[#0f2147]' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-[#0f2147]/10' : ''}`} />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
