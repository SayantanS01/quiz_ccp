'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Sliders, 
  Users,
  History,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Database,
  Search,
  RefreshCw,
  Eye,
  LogOut,
  Download
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { LocalAttempt, User } from '@/lib/idb';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'question_bank'>('dashboard');
  
  const [users, setUsers] = useState<User[]>([]);
  const [attempts, setAttempts] = useState<LocalAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingUser, setDeletingUser] = useState<string | null>(null);

  // Bank stats (from API)
  const [bankStats, setBankStats] = useState({ total: 0 });

  useEffect(() => {
    loadLocalData();
    fetch('/api/admin/questions?limit=1')
      .then(res => res.json())
      .then(data => {
        if (data.success) setBankStats({ total: data.total });
      }).catch(console.error);
  }, []);

  const loadLocalData = async () => {
    setLoading(true);
    try {
      const [uRes, aRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/attempts')
      ]);
      const uData = await uRes.json();
      const aData = await aRes.json();
      if (uData.success) setUsers(uData.users);
      if (aData.success) setAttempts(aData.attempts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (username: string) => {
    // Note: Backend deletion would require a new API endpoint. 
    // We can stub this out or remove it for now since they are in Postgres.
    alert('Deleting users is disabled in this cloud deployment.');
  };

  const handleDownloadPackage = async (attemptId: string) => {
    try {
      const { LocalReportRepository } = await import('@/lib/repositories');
      const blob = await LocalReportRepository.generateCompletePackage(attemptId);
      if (!blob) throw new Error('Could not generate package');
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CloudPrep_${attemptId}_Package.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Failed to generate download package.');
    }
  };

  // Dashboard calculations
  const now = new Date().getTime();
  const completedAttempts = attempts.filter(a => a.submittedAt);
  const passedAttempts = completedAttempts.filter(a => a.passed);
  const failedAttempts = completedAttempts.filter(a => !a.passed);
  const activeAttempts = attempts.filter(a => !a.submittedAt);
  const expiringSoon = attempts.filter(a => {
    const expiresAt = new Date(a.expiresAt).getTime();
    return expiresAt > now && (expiresAt - now) < (24 * 60 * 60 * 1000);
  });

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-lg">
                <Sliders className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white">CloudPrep Admin Portal</h1>
            </div>
            <p className="text-slate-400">Manage local user accounts, monitor exam attempts, and audit the question pool.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            {[
              { id: 'dashboard', label: 'Dashboard & Attempts', icon: History },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'question_bank', label: 'Question Bank', icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                    <p className="text-sm font-semibold text-slate-400 mb-1">Total Local Users</p>
                    <p className="text-3xl font-black text-white">{users.length}</p>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                    <p className="text-sm font-semibold text-slate-400 mb-1">Total Attempts</p>
                    <p className="text-3xl font-black text-white">{attempts.length}</p>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                    <p className="text-sm font-semibold text-emerald-400 mb-1">Passed Attempts</p>
                    <p className="text-3xl font-black text-emerald-400">{passedAttempts.length}</p>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                    <p className="text-sm font-semibold text-rose-400 mb-1">Failed Attempts</p>
                    <p className="text-3xl font-black text-rose-400">{failedAttempts.length}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                    <p className="text-sm font-semibold text-blue-400 mb-1">Active (In Progress)</p>
                    <p className="text-3xl font-black text-white">{activeAttempts.length}</p>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                    <p className="text-sm font-semibold text-slate-400 mb-1">Completed</p>
                    <p className="text-3xl font-black text-white">{completedAttempts.length}</p>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                    <p className="text-sm font-semibold text-amber-400 mb-1">Expiring &lt; 24h</p>
                    <p className="text-3xl font-black text-white">{expiringSoon.length}</p>
                  </div>
                </div>

                {/* Attempts Table */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">All Attempts</h2>
                    <button onClick={loadLocalData} className="text-slate-400 hover:text-white flex items-center gap-1.5 text-sm">
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                  </div>

                  <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                          <tr>
                            <th className="px-6 py-4 font-semibold">Candidate</th>
                            <th className="px-6 py-4 font-semibold">Attempt ID</th>
                            <th className="px-6 py-4 font-semibold">Date</th>
                            <th className="px-6 py-4 font-semibold">Score</th>
                            <th className="px-6 py-4 font-semibold">Result</th>
                            <th className="px-6 py-4 font-semibold">Expires</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {attempts.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                                No local attempts found.
                              </td>
                            </tr>
                          ) : (
                            attempts.map((att) => (
                              <tr key={att.attemptId} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">{att.candidateName}</td>
                                <td className="px-6 py-4 text-slate-400 font-mono text-xs">{att.attemptId.split('-').pop()}</td>
                                <td className="px-6 py-4 text-slate-300">{new Date(att.startedAt).toLocaleString()}</td>
                                <td className="px-6 py-4">
                                  {att.submittedAt ? (
                                    <>
                                      <span className="font-bold text-white">{att.percentage}%</span>
                                      <span className="text-slate-500 text-xs ml-2">({att.score}/{att.totalScored})</span>
                                    </>
                                  ) : (
                                    <span className="text-blue-400">In Progress</span>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  {att.submittedAt ? (
                                    att.passed ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-semibold">PASS</span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-xs font-semibold">FAIL</span>
                                    )
                                  ) : '-'}
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-xs">
                                  {new Date(att.expiresAt).toLocaleTimeString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  {att.submittedAt && (
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        onClick={() => handleDownloadPackage(att.attemptId)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-medium transition-colors border border-blue-500/20"
                                        title="Download JSON, LOG, and PDF Package"
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                        ZIP
                                      </button>
                                      <Link 
                                        href={`/exam/result/${att.attemptId}`}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                        View
                                      </Link>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Local User Accounts</h2>
                </div>

                <div className="grid gap-4">
                  {users.length === 0 ? (
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center text-slate-500">
                      No users registered locally yet.
                    </div>
                  ) : (
                    users.map((u) => {
                      const userAtts = attempts.filter(a => a.username === u.username);
                      const bestScore = userAtts.reduce((max, a) => Math.max(max, a.percentage || 0), 0);
                      const avgScore = userAtts.length ? Math.round(userAtts.reduce((acc, a) => acc + (a.percentage || 0), 0) / userAtts.length) : 0;
                      
                      return (
                        <div key={u.username} className="bg-[#111827] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row gap-6 justify-between items-center hover:border-slate-700 transition-colors">
                          <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full">
                            <div>
                              <h3 className="text-lg font-bold text-white">{u.displayName}</h3>
                              <p className="text-sm text-slate-400 font-mono">@{u.username}</p>
                            </div>
                            
                            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                              <div>
                                <p className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">Created</p>
                                <p className="text-slate-300">{new Date(u.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">Attempts</p>
                                <p className="text-white font-medium">{userAtts.length}</p>
                              </div>
                              <div>
                                <p className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">Best</p>
                                <p className="text-emerald-400 font-bold">{bestScore}%</p>
                              </div>
                              <div>
                                <p className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">Average</p>
                                <p className="text-amber-400 font-bold">{avgScore}%</p>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteUser(u.username)}
                            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-sm font-semibold transition-colors border border-rose-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {activeTab === 'question_bank' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center max-w-2xl mx-auto mt-10">
                  <Database className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-white mb-2">Master Question Repository</h2>
                  <p className="text-slate-400 mb-6">
                    The backend API currently hosts <strong className="text-white">{bankStats.total}</strong> active questions. For deep auditing, duplicate management, and full JSON exports, please use the API directly or a database client (SQLite) as the Admin Portal UI is optimized for User and Attempt Management in this local-auth build.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
