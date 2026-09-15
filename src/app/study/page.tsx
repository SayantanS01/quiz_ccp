'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Cloud,
  Database,
  Server,
  Activity,
  DollarSign
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';

const MODULES = [
  {
    id: 1,
    title: 'Introduction to Amazon Web Services',
    filename: 'Module 1 - Introduction to Amazon Web Services.pdf',
    icon: Cloud,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10'
  },
  {
    id: 2,
    title: 'Compute in the Cloud',
    filename: 'Module 2 - Compute in the Cloud.pdf',
    icon: Server,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10'
  },
  {
    id: 3,
    title: 'Global Infrastructure and Reliability',
    filename: 'Module 3 - Global Infrastructure and Reliability.pdf',
    icon: Activity,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10'
  },
  {
    id: 4,
    title: 'Networking',
    filename: 'Module 4 - Networking.pdf',
    icon: Cloud,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10'
  },
  {
    id: 5,
    title: 'Storage and Databases',
    filename: 'Module 5 - Storage and Databases.pdf',
    icon: Database,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10'
  },
  {
    id: 6,
    title: 'Security',
    filename: 'Module 6 - Security.pdf',
    icon: ShieldCheck,
    color: 'text-red-400',
    bg: 'bg-red-500/10'
  },
  {
    id: 7,
    title: 'Monitoring and Analytics',
    filename: 'Module 7 - Monitoring and Analytics.pdf',
    icon: Activity,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10'
  },
  {
    id: 8,
    title: 'Pricing and Support',
    filename: 'Module 8 - Pricing and Support.pdf',
    icon: DollarSign,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10'
  },
  {
    id: 9,
    title: 'Migration and Innovation',
    filename: 'Module 9 - Migration and Innovation.pdf',
    icon: Cloud,
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/10'
  },
  {
    id: 10,
    title: 'The Cloud Journey',
    filename: 'Module 10 - The Cloud Journey.pdf',
    icon: Cloud,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10'
  },
  {
    id: 11,
    title: 'AWS Certified Cloud Practitioner Basics',
    filename: 'Module 11 - AWS Certified Cloud Practitioner Basics.pdf',
    icon: FileText,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10'
  },
  {
    id: 12,
    title: 'Final Assessment',
    filename: 'Module 12 - Final Assessment.pdf',
    icon: BookOpen,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10'
  }
];

export default function StudyPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
              <BookOpen className="w-4 h-4" />
              <span>Official Course Materials</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Study Library</h1>
            <p className="text-slate-400 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
              Master the core concepts before taking the practice exams. Read through the official CloudPrep study modules to build your foundational AWS knowledge.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <a 
                key={mod.id}
                href={`/aws_modules/${encodeURIComponent(mod.filename)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-600 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/0 to-transparent group-hover:via-amber-500/50 transition-all duration-500"></div>
                
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${mod.bg} ${mod.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-800/50 px-2.5 py-1 rounded-lg">
                    Module {mod.id}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
                  {mod.title}
                </h3>

                <div className="mt-auto pt-6 flex items-center text-sm font-semibold text-slate-400 group-hover:text-white transition-colors">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Read PDF
                  </span>
                  <ChevronRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </a>
            );
          })}
        </div>
      </main>
    </div>
  );
}
