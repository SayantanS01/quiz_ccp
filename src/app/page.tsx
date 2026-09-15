'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Cloud, 
  ShieldCheck, 
  History, 
  CheckCircle2, 
  Award,
  AlertTriangle,
  Play
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/components/AuthProvider';
import { getUserAttempts, LocalAttempt } from '@/lib/idb';

export default function HomePage() {
  const { session } = useAuth();
  const [attempts, setAttempts] = useState<LocalAttempt[]>([]);
  const [stats, setStats] = useState({
    bestScore: 0,
    averageScore: 0,
    passed: 0,
    failed: 0,
  });

  useEffect(() => {
    if (session?.username) {
      loadAttempts(session.username);
    }
  }, [session]);

  const loadAttempts = async (username: string) => {
    const userAttempts = await getUserAttempts(username);
    const completed = userAttempts.filter(a => a.score !== null);
    
    setAttempts(completed);

    if (completed.length > 0) {
      let passed = 0;
      let failed = 0;
      let totalScore = 0;
      let best = 0;

      completed.forEach(a => {
        if (a.passed) passed++;
        else failed++;
        
        const score = a.percentage || 0;
        totalScore += score;
        if (score > best) best = score;
      });

      setStats({
        bestScore: best,
        averageScore: Math.round(totalScore / completed.length),
        passed,
        failed
      });
    }
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-10 border-b border-slate-800 pb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Welcome, <span className="text-amber-500">{session.username}</span>
          </h1>
          <p className="text-slate-400">Track your progress and launch practice exams.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Exam Launch Box */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-900 to-[#111827] border border-slate-800 rounded-2xl p-8 relative overflow-hidden shadow-xl shadow-black/50">
              <div className="absolute top-0 right-0 p-12 bg-amber-500/5 rounded-full blur-[80px]" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold uppercase tracking-widest mb-4">
                  Official Simulation
                </div>
                
                <h2 className="text-3xl font-black text-white mb-1">
                  AWS CLOUD PRACTITIONER
                </h2>
                <h3 className="text-xl text-slate-300 font-medium mb-6">
                  Practice Exam
                </h3>

                <div className="flex items-center gap-6 mb-8 text-sm font-medium text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span>65 Questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-blue-500" />
                    <span>90 Minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-purple-500" />
                    <span>AI Proctored</span>
                  </div>
                </div>

                <Link
                  href="/exam/setup/FULL_MOCK"
                  className="inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 px-8 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Start Practice Exam
                </Link>
              </div>
            </div>

            {/* Recent Attempts Table */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-amber-500" />
                Previous Attempts
              </h3>
              
              {attempts.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
                  No attempts recorded yet. Launch a practice exam to see your history!
                </div>
              ) : (
                <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Date</th>
                        <th className="px-6 py-4 font-semibold">Score</th>
                        <th className="px-6 py-4 font-semibold">Result</th>
                        <th className="px-6 py-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {attempts.slice(0, 5).map((att) => (
                        <tr key={att.attemptId} className="hover:bg-slate-800/20 transition-colors">
                          <td className="px-6 py-4 text-slate-300">
                            {new Date(att.startedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-white">{att.percentage}%</span>
                            <span className="text-slate-500 text-xs ml-2">({att.score}/{att.totalScored})</span>
                          </td>
                          <td className="px-6 py-4">
                            {att.passed ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                PASS
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 text-xs font-semibold">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                FAIL
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link 
                              href={`/exam/result/${att.attemptId}`}
                              className="text-amber-500 hover:text-amber-400 font-medium text-xs"
                            >
                              Review
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Your Performance</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 text-center">
                <p className="text-sm text-slate-400 font-medium mb-1">Best Score</p>
                <p className="text-3xl font-black text-white">{stats.bestScore}%</p>
              </div>
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 text-center">
                <p className="text-sm text-slate-400 font-medium mb-1">Average</p>
                <p className="text-3xl font-black text-white">{stats.averageScore}%</p>
              </div>
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-xl p-6">
              <p className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Attempt Outcomes</p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-medium mb-1.5">
                    <span className="text-emerald-400">Passed</span>
                    <span className="text-white">{stats.passed}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full" 
                      style={{ width: attempts.length ? `${(stats.passed / attempts.length) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm font-medium mb-1.5">
                    <span className="text-red-400">Failed</span>
                    <span className="text-white">{stats.failed}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full" 
                      style={{ width: attempts.length ? `${(stats.failed / attempts.length) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-3 text-amber-500 mb-3">
                <Award className="w-5 h-5" />
                <h4 className="font-bold text-white">Target Score</h4>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                The official AWS Certified Cloud Practitioner exam requires a scaled score of 700 to pass. Aim to consistently score above <strong className="text-amber-500">75%</strong> on these practice exams to ensure readiness.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
