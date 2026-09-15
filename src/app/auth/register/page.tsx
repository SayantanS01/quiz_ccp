'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Cloud, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { createUser } from '@/lib/idb';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || passcode.length !== 4) {
      setError('Please enter your name and a 4-digit passcode.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: name.toLowerCase().replace(/\s+/g, ''),
          name,
          passcode
        })
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);
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
        <h2 className="text-2xl font-bold text-center mb-2">Welcome</h2>
        <p className="text-slate-400 text-center mb-6 text-sm">Create your account to start preparing for AWS Certified Cloud Practitioner.</p>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <p className="text-sm text-emerald-400 font-medium">Account created successfully. Redirecting to login...</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
              placeholder="Enter your name"
              disabled={loading || success}
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
              disabled={loading || success}
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-amber-500 hover:text-amber-400 font-medium transition-colors">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
