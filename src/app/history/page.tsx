'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  History, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [attempts, setAttempts] = useState<any[]>([]);

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);
        const res = await fetch('/api/history');
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setAttempts(data.attempts || []);
        }
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <History className="w-4 h-4" />
              <span>Candidate Testing Audit</span>
            </div>
            <h1 className="text-3xl font-black text-white">Examination History & Progress</h1>
            <p className="text-sm text-slate-400 mt-1">
              Review all completed and historical practice examinations, diagnostic scorecards, and proctoring audits.
            </p>
          </div>

          <Link
            href="/exam/setup/FULL_MOCK"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
          >
            <Award className="w-4 h-4" />
            <span>Launch New Mock Exam</span>
          </Link>
        </div>

        {/* Stats Summary Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold">Total Examinations</span>
              <div className="text-2xl font-black text-white mt-1">
                {stats.totalAttempts}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold">Passed Attempts</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {stats.passedAttempts}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold">Overall Pass Rate</span>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {stats.passRate}%
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold">Average Scored %</span>
              <div className="text-2xl font-black text-white mt-1">
                {stats.averageScore}%
              </div>
            </div>
          </div>
        )}

        {/* Attempts Table */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-10 h-10 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mb-3" />
            <p className="text-xs font-semibold">Loading attempt records...</p>
          </div>
        ) : attempts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
            <Award className="w-12 h-12 text-amber-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold text-white mb-1">No Past Examinations Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
              You have not completed any proctored mock exams yet. Take your first 65-question practice exam to establish your baseline score.
            </p>
            <Link
              href="/exam/setup/FULL_MOCK"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow"
            >
              Start First Practice Exam
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Exam Mode</th>
                    <th className="py-3.5 px-4">Result</th>
                    <th className="py-3.5 px-4">Scored (35/50 rule)</th>
                    <th className="py-3.5 px-4">Duration</th>
                    <th className="py-3.5 px-4">Proctoring</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {attempts.map((att) => {
                    const dateStr = new Date(att.startedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <tr key={att.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-slate-200">
                          {dateStr}
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-300">
                          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px]">
                            {att.mode}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-bold">
                          {att.passed ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
                              <XCircle className="w-3.5 h-3.5" /> FAILED
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-white">
                          {att.scoredCorrect} / {att.scoredQuestions || 50}{' '}
                          <span className="text-slate-400 font-normal">
                            ({att.scorePercentage}%)
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-400">
                          {formatDuration(att.timeSpentSeconds || 0)}
                        </td>

                        <td className="py-3.5 px-4">
                          {att.violationCount === 0 ? (
                            <span className="text-emerald-400 font-medium flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" /> Clean
                            </span>
                          ) : (
                            <span className="text-rose-400 font-medium flex items-center gap-1">
                              <ShieldAlert className="w-3.5 h-3.5" /> {att.violationCount} Strikes
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/exam/result/${att.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 font-bold transition-all"
                          >
                            <span>Scorecard</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
