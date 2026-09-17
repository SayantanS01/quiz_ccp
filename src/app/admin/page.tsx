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
  Download,
  Link2,
  RotateCcw,
  Copy,
  X,
  Lock,
  Unlock,
  Check
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { LocalAttempt } from '@/lib/idb';
import { User } from '@prisma/client';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'question_bank' | 'module_access'>('dashboard');
  
  const [users, setUsers] = useState<User[]>([]);
  const [attempts, setAttempts] = useState<LocalAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingUser, setDeletingUser] = useState<string | null>(null);

  // Bank stats (from API)
  const [bankStats, setBankStats] = useState({ total: 0 });
  const [reconnectLink, setReconnectLink] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadBankStats = () => {
    fetch('/api/admin/questions?limit=1')
      .then(res => res.json())
      .then(data => {
        if (data.success) setBankStats({ total: data.total });
      }).catch(console.error);
  };

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAttempts = async () => {
    try {
      const res = await fetch('/api/admin/attempts');
      const data = await res.json();
      if (data.success) setAttempts(data.attempts);
    } catch (err) {
      console.error(err);
    }
  };

  const loadPendingRequests = async () => {
    try {
      const res = await fetch('/api/admin/module-access');
      const data = await res.json();
      if (data.success) {
        setPendingRequests(data.requests);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAccessAction = async (id: string, action: 'GRANT' | 'DENY') => {
    try {
      setActionLoading(`access_${id}`);
      const res = await fetch('/api/admin/module-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      });
      if (res.ok) {
        await loadPendingRequests();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([
        loadUsers(),
        loadAttempts(),
        loadBankStats(),
        loadPendingRequests()
      ]);
      setLastUpdated(new Date());
      setLoading(false);
    };

    loadAll();

    // Real-time: refresh every 15 seconds
    const interval = setInterval(() => {
      loadAttempts();
      loadPendingRequests();
      setLastUpdated(new Date());
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const loadLocalData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadUsers(),
        loadAttempts()
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAttempt = async (attemptId: string) => {
    if (!confirm(`Delete this attempt permanently? This cannot be undone.`)) return;
    setActionLoading(attemptId);
    try {
      const res = await fetch('/api/admin/attempts/manage', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId })
      });
      const data = await res.json();
      if (data.success) await loadLocalData();
      else alert(data.error);
    } catch (err) { console.error(err); }
    setActionLoading(null);
  };

  const handleReconnect = async (attemptId: string) => {
    setActionLoading(attemptId);
    try {
      const res = await fetch('/api/admin/attempts/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId, action: 'reconnect' })
      });
      const data = await res.json();
      if (data.success) {
        const fullLink = `${window.location.origin}${data.link}`;
        setReconnectLink(fullLink);
      } else {
        alert(data.error);
      }
    } catch (err) { console.error(err); }
    setActionLoading(null);
  };

  const handleReset = async (attemptId: string) => {
    if (!confirm(`Reset this attempt? The old attempt will be deleted and a new exam will need to be started by the user.`)) return;
    setActionLoading(attemptId);
    try {
      const res = await fetch('/api/admin/attempts/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId, action: 'reset' })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Attempt reset. User "${data.userId}" can start a new ${data.mode} exam.`);
        await loadLocalData();
      } else {
        alert(data.error);
      }
    } catch (err) { console.error(err); }
    setActionLoading(null);
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
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-lg">
              <Sliders className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">CloudPrep Admin Portal</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-slate-400">Manage user accounts, monitor exam attempts, and audit the question pool.</p>
            <p className="text-slate-600 text-xs">Last updated: {lastUpdated.toLocaleTimeString()} — auto-refreshes every 15s</p>
          </div>

          <div className="flex items-center gap-2 mt-6 border-b border-slate-800 pb-px overflow-x-auto hide-scrollbar">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Sliders },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'question_bank', label: 'Question Bank', icon: Database },
              { id: 'module_access', label: 'Module Access', icon: Lock },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
                    isActive 
                      ? 'border-purple-500 text-purple-400 bg-purple-500/10 rounded-t-lg' 
                      : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-t-lg'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
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
                    <p className="text-sm font-semibold text-slate-400 mb-1">Total Users</p>
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
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={async () => {
                          if (!confirm('Are you sure you want to globally reshuffle the Daily Challenge questions for all users?')) return;
                          try {
                            const res = await fetch('/api/admin/daily/reshuffle', { method: 'POST' });
                            const data = await res.json();
                            if (data.success) alert('Daily Challenge reshuffled successfully!');
                            else alert('Failed: ' + data.error);
                          } catch (err) { console.error(err); }
                        }} 
                        className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 text-sm font-semibold hover:bg-amber-500/20 transition-colors"
                      >
                        Reshuffle Daily Questions
                      </button>
                      <button onClick={loadLocalData} className="text-slate-400 hover:text-white flex items-center gap-1.5 text-sm">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                          <tr>
                            <th className="px-6 py-4 font-semibold">Candidate</th>
                            <th className="px-6 py-4 font-semibold">Type</th>
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
                              <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                                No attempts found.
                              </td>
                            </tr>
                          ) : (
                            attempts.map((att) => (
                              <tr key={att.attemptId} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">{att.candidateName}</td>
                                <td className="px-6 py-4">
                                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                    {(att.mode || 'UNKNOWN').replace(/_/g, ' ')}
                                  </span>
                                </td>
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
                                  <div className="flex items-center justify-end gap-2 flex-wrap">
                                    {/* Reconnect — only for in-progress attempts */}
                                    {!att.submittedAt && (
                                      <button
                                        onClick={() => handleReconnect(att.attemptId)}
                                        disabled={actionLoading === att.attemptId}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-medium transition-colors border border-cyan-500/20"
                                        title="Generate reconnect link for user"
                                      >
                                        <Link2 className="w-3.5 h-3.5" />
                                        Reconnect
                                      </button>
                                    )}

                                    {/* Reset — available for any attempt */}
                                    <button
                                      onClick={() => handleReset(att.attemptId)}
                                      disabled={actionLoading === att.attemptId}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-medium transition-colors border border-amber-500/20"
                                      title="Delete old attempt and allow user to restart"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5" />
                                      Reset
                                    </button>

                                    {/* View — only for completed attempts */}
                                    {(att.submittedAt || att.status === 'completed') && (
                                      <Link 
                                        href={`/exam/result/${att.attemptId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                        View
                                      </Link>
                                    )}

                                    {/* Delete */}
                                    <button
                                      onClick={() => handleDeleteAttempt(att.attemptId)}
                                      disabled={actionLoading === att.attemptId}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium transition-colors border border-rose-500/20"
                                      title="Delete this attempt permanently"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      Delete
                                    </button>
                                  </div>
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
                  <h2 className="text-xl font-bold text-white">User Accounts</h2>
                </div>

                <div className="grid gap-4">
                  {users.length === 0 ? (
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center text-slate-500">
                      No users registered yet.
                    </div>
                  ) : (
                    users.map((u) => {
                      const userAtts = attempts.filter(a => a.username === u.username);
                      const bestScore = userAtts.reduce((max, a) => Math.max(max, a.percentage || 0), 0);
                      const avgScore = userAtts.length ? Math.round(userAtts.reduce((acc, a) => acc + (a.percentage || 0), 0) / userAtts.length) : 0;
                      
                      return (
                        <div key={u.username} className="bg-[#111827] border border-slate-800 rounded-xl p-5 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center hover:border-slate-700 transition-colors">
                          <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full">
                            <div>
                              <h3 className="text-lg font-bold text-white">{u.name || 'Unknown User'}</h3>
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
                          <div className="flex flex-col gap-2 shrink-0">
                            <button
                              onClick={async () => {
                                if (!confirm(`Are you sure you want to RESET progress for ${u.username}? This wipes all history and attempts, giving them a fresh start without deleting their account.`)) return;
                                try {
                                  const res = await fetch('/api/admin/users/manage', {
                                    method: 'DELETE',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ userId: u.id, action: 'reset' })
                                  });
                                  const data = await res.json();
                                  if (data.success) {
                                    alert('User progress successfully reset.');
                                    loadLocalData();
                                  } else {
                                    alert('Error resetting user: ' + data.error);
                                  }
                                } catch (err) {
                                  alert('Failed to reset user.');
                                }
                              }}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-sm font-semibold transition-colors border border-amber-500/20"
                            >
                              <RotateCcw className="w-4 h-4" />
                              Reset
                            </button>
                            
                            <button
                              onClick={async () => {
                                if (!confirm(`Are you sure you want to permanently delete user ${u.username}? This will wipe ALL their history, attempts, and mistakes.`)) return;
                                try {
                                  const res = await fetch('/api/admin/users/manage', {
                                    method: 'DELETE',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ userId: u.id, action: 'delete' })
                                  });
                                  const data = await res.json();
                                  if (data.success) {
                                    alert('User successfully deleted.');
                                    loadLocalData();
                                  } else {
                                    alert('Error deleting user: ' + data.error);
                                  }
                                } catch (err) {
                                  alert('Failed to delete user.');
                                }
                              }}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-sm font-semibold transition-colors border border-rose-500/20"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
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
                    The backend API currently hosts <strong className="text-white">{bankStats.total}</strong> active questions.
                  </p>

                  <div className="p-6 bg-slate-950/50 rounded-xl border border-slate-800/80 max-w-md mx-auto">
                    <h3 className="text-sm font-bold text-slate-300 mb-4">Bulk Import via JSON</h3>
                    <input
                      type="file"
                      accept=".json"
                      id="jsonUpload"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onload = async (event) => {
                          try {
                            const json = JSON.parse(event.target?.result as string);
                            const res = await fetch('/api/admin/questions/import', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(json)
                            });
                            const data = await res.json();
                            if (data.success) {
                              alert(data.message);
                              // Refresh stats
                              fetch('/api/admin/questions?limit=1')
                                .then(r => r.json())
                                .then(d => { if (d.success) setBankStats({ total: d.total }); });
                            } else {
                              alert('Import failed: ' + data.error);
                            }
                          } catch (err) {
                            alert('Invalid JSON file.');
                          }
                        };
                        reader.readAsText(file);
                        e.target.value = ''; // reset input
                      }}
                    />
                    <label 
                      htmlFor="jsonUpload" 
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30 cursor-pointer transition-colors"
                    >
                      <Download className="w-5 h-5 rotate-180" />
                      Select JSON File
                    </label>
                    <p className="text-[10px] text-slate-500 mt-3 text-left">
                      Must be an array of questions. Now supports <code>explanation</code> strings inside individual option objects.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'module_access' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Pending Module Access Requests</h2>
                    <p className="text-sm text-slate-400">Review and approve access to locked study materials.</p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                      <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-700">
                        <tr>
                          <th className="px-6 py-4 font-semibold">User</th>
                          <th className="px-6 py-4 font-semibold">Module</th>
                          <th className="px-6 py-4 font-semibold">Requested At</th>
                          <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {pendingRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-bold text-white">{req.user?.name || req.user?.username || 'Unknown'}</div>
                              <div className="text-xs text-slate-500">@{req.userId}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                                Module {req.moduleId}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs">
                              {new Date(req.createdAt).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleAccessAction(req.id, 'GRANT')}
                                  disabled={actionLoading === `access_${req.id}`}
                                  className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                                  title="Grant Access"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleAccessAction(req.id, 'DENY')}
                                  disabled={actionLoading === `access_${req.id}`}
                                  className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                                  title="Deny Access"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {pendingRequests.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                              No pending module access requests.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Reconnect Link Modal */}
      {reconnectLink && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Link2 className="w-5 h-5 text-cyan-400" />
                Reconnect Link Generated
              </h3>
              <button onClick={() => setReconnectLink(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-400 mb-4">Share this link with the user so they can resume their exam session:</p>
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex items-center gap-2">
              <input 
                type="text" 
                readOnly 
                value={reconnectLink} 
                className="bg-transparent text-cyan-300 text-sm font-mono flex-1 outline-none"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(reconnectLink);
                  alert('Link copied to clipboard!');
                }}
                className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
