'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { ApiAttemptRepository } from '@/lib/repositories';
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
  DollarSign,
  Lock,
  Unlock,
  Clock
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
  const router = useRouter();
  const { session } = useAuth();
  
  const [selectedModules, setSelectedModules] = useState<number[]>([]);
  const [numQuestions, setNumQuestions] = useState<number>(10);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [accessMap, setAccessMap] = useState<Record<number, string>>({});
  const [loadingAccess, setLoadingAccess] = useState(true);

  React.useEffect(() => {
    async function fetchAccess() {
      if (!session?.username) return;
      try {
        const res = await fetch(`/api/study/module-access?username=${session.username}`);
        const data = await res.json();
        if (data.success) {
          setAccessMap(data.accessMap);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAccess(false);
      }
    }
    fetchAccess();
  }, [session?.username]);

  const requestAccess = async (moduleId: number) => {
    if (!session?.username) return;
    try {
      const res = await fetch('/api/study/module-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: session.username, moduleId })
      });
      const data = await res.json();
      if (data.success) {
        setAccessMap(prev => ({ ...prev, [moduleId]: data.status }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleModuleToggle = (id: number) => {
    setSelectedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleStartCustomQuiz = async () => {
    if (selectedModules.length === 0) {
      setError('Please select at least one module.');
      return;
    }
    try {
      setIsStarting(true);
      setError(null);
      const username = session?.username || 'candidate_default';
      const candidateName = session?.username || username;
      const prefixes = selectedModules.map(id => `Module ${id}`);
      
      const attempt = await ApiAttemptRepository.startCustomExam(username, candidateName, prefixes, numQuestions);
      
      if (attempt) {
        router.push(`/exam/session/${attempt.attemptId}`);
      } else {
        throw new Error('Failed to create custom exam attempt. Ensure questions are available for the selected modules.');
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'An error occurred while starting the custom quiz');
      setIsStarting(false);
    }
  };

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
            const isAdmin = session?.isAdmin;
            const status = isAdmin ? 'GRANTED' : (accessMap[mod.id] || 'LOCKED');
            const isGranted = status === 'GRANTED';
            const isPending = status === 'PENDING';

            return (
              <div 
                key={mod.id}
                className={`group relative flex flex-col p-6 rounded-2xl bg-slate-900/60 border transition-all ${
                  isGranted 
                    ? 'border-slate-800 hover:border-amber-500/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer' 
                    : 'border-slate-800/50 opacity-80'
                } overflow-hidden`}
                onClick={() => {
                  if (isGranted) {
                    window.open(`/api/study/modules/${mod.id}?username=${session?.username}`, '_blank');
                  }
                }}
              >
                {isGranted && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/0 to-transparent group-hover:via-amber-500/50 transition-all duration-500"></div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isGranted ? mod.bg : 'bg-slate-800'} ${isGranted ? mod.color : 'text-slate-500'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-800/50 px-2.5 py-1 rounded-lg">
                    Module {mod.id}
                  </span>
                </div>

                <h3 className={`text-lg font-bold mb-2 transition-colors line-clamp-2 ${isGranted ? 'text-white group-hover:text-amber-400' : 'text-slate-400'}`}>
                  {mod.title}
                </h3>

                <div className="mt-auto pt-6 flex items-center justify-between text-sm font-semibold transition-colors">
                  {isGranted ? (
                    <>
                      <span className="flex items-center gap-2 text-slate-400 group-hover:text-white">
                        <FileText className="w-4 h-4" />
                        Read PDF
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </>
                  ) : isPending ? (
                    <span className="flex items-center gap-2 text-amber-500 w-full justify-center bg-amber-500/10 py-2 rounded-lg border border-amber-500/20">
                      <Clock className="w-4 h-4" />
                      Pending Approval
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        requestAccess(mod.id);
                      }}
                      className="flex items-center gap-2 text-white w-full justify-center bg-slate-800 hover:bg-slate-700 py-2 rounded-lg transition-colors border border-slate-700"
                    >
                      <Lock className="w-4 h-4" />
                      Request Access
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Quiz Builder Section */}
        <div className="mt-16 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Custom Practice Quiz</h2>
              <p className="text-sm text-slate-400">Build a custom quiz from selected modules</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-3">
                Select Modules (Multiple)
              </label>
              <div className="flex flex-wrap gap-2">
                {MODULES.map(mod => {
                  const isSelected = selectedModules.includes(mod.id);
                  return (
                    <button
                      key={mod.id}
                      onClick={() => handleModuleToggle(mod.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        isSelected 
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' 
                          : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      Module {mod.id}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-3">
                Number of Questions: {numQuestions}
              </label>
              <input 
                type="range" 
                min="5" 
                max="50" 
                step="5"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full max-w-md accent-amber-500"
              />
            </div>

            {error && (
              <p className="text-rose-400 text-sm font-semibold">{error}</p>
            )}

            <button
              onClick={handleStartCustomQuiz}
              disabled={isStarting || selectedModules.length === 0}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isStarting ? 'Preparing Quiz...' : 'Start Custom Quiz'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
