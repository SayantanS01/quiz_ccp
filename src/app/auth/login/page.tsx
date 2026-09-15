'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Cloud, ArrowRight, AlertTriangle } from 'lucide-react';
import { loginUser } from '@/lib/idb';
import { useAuth } from '@/components/AuthProvider';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshSession } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || passcode.length !== 4) {
      setError('Please enter your name and a 4-digit passcode.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: name,
          passcode
        })
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Invalid credentials');
      }

      // Save session locally so the rest of the app knows who is logged in
      const { getDB } = await import('@/lib/idb');
      const db = await getDB();
      if (db) {
        await db.put('sessions', {
          id: 'current_session',
          username: data.user.username,
          candidateName: data.user.name,
          role: data.user.role,
          loggedInAt: new Date().toISOString()
        });
      }

      await refreshSession();
      // AuthProvider will automatically redirect based on role
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center mb-8 z-10">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2.5 rounded-xl shadow-lg shadow-orange-500/20">
            <Cloud className="w-8 h-8 text-black" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">CloudPrep</h1>
        </div>
        <p className="text-amber-500 font-medium tracking-wide">AWS Cloud Practitioner</p>
        <p className="text-slate-400 mt-2 italic">"Practice smarter. Prepare better."</p>
      </div>

      <div className="bg-[#111827]/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl z-10 relative">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">
              Name / Username
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
              placeholder="Enter your name"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">
              4-digit Passcode
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors tracking-[0.5em] font-mono"
              placeholder="●●●●"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Logging in...' : 'Login'}
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-amber-500 hover:text-amber-400 font-medium transition-colors">
              Create Account
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm mb-3">Admin?</p>
          <Link 
            href="/admin/login" 
            className="inline-flex items-center justify-center px-4 py-2 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
