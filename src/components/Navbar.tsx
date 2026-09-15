'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Cloud, 
  BookOpen, 
  Target, 
  Calendar, 
  History, 
  ShieldCheck, 
  Sliders,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { logoutUser } from '@/lib/idb';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, refreshSession } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
    await refreshSession();
    router.push('/auth/login');
  };

  const navItems = session?.isAdmin 
    ? [
        { label: 'Admin Portal', href: '/admin', icon: Sliders },
      ]
    : [
        { label: 'Dashboard', href: '/', icon: Cloud },
        { label: 'Study Mode', href: '/study', icon: BookOpen },
        { label: 'Weak Areas', href: '/weak-areas', icon: Target },
        { label: 'Daily Challenge', href: '/daily', icon: Calendar },
        { label: 'History', href: '/history', icon: History },
      ];

  if (!session) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#0B0F19]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Cloud className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-amber-400 transition-colors">
                CloudPrep
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                CLF-C02
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-none">
              AWS Certified Cloud Practitioner
            </p>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right User & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium text-slate-300 truncate max-w-[100px]">
              {session.username}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
