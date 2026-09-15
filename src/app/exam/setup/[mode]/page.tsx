'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Camera, 
  Mic, 
  Maximize2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ChevronLeft,
  Lock,
  User,
  Clock,
  Award,
  AlertTriangle
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/components/AuthProvider';

export default function ExamSetupPage() {
  const router = useRouter();
  const params = useParams();
  const mode = (params.mode as string) || 'FULL_MOCK';
  const { session } = useAuth();

  const [candidateName, setCandidateName] = useState('');
  const [candidateId, setCandidateId] = useState('');

  useEffect(() => {
    if (session?.username) {
      setCandidateName(session.username);
      setCandidateId(session.username);
    }
  }, [session]);

  // Device Check States
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [hasMic, setHasMic] = useState<boolean | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [agreedRules, setAgreedRules] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Request media permissions on mount
  useEffect(() => {
    async function setupDevices() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCamera(true);
        setHasMic(true);
      } catch (err) {
        console.warn('Media devices not permitted or unavailable:', err);
        // If real camera is blocked, allow simulated proctoring for development
        setHasCamera(false);
        setHasMic(false);
      }
    }

    setupDevices();

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const requestFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  const handleStartExam = async () => {
    if (!agreedRules) {
      setErrorMsg('You must review and agree to the AWS Proctored Examination Rules.');
      return;
    }

    setIsStarting(true);
    setErrorMsg(null);

    try {
      // If user hasn't toggled fullscreen, try to enter fullscreen
      if (!document.fullscreenElement) {
        try {
          await document.documentElement.requestFullscreen();
        } catch (_) {}
      }

      const { ApiAttemptRepository } = await import('@/lib/repositories');
      
      // Use candidate name or default username
      const activeName = session?.candidateName || session?.username || 'Test User';
      const activeUsername = session?.username || 'testuser';

      const attempt = await ApiAttemptRepository.startExam(
        activeUsername,
        activeName,
        mode
      );

      if (!attempt) {
        throw new Error('Failed to generate local attempt.');
      }

      // Route to live session
      router.push(`/exam/session/${attempt.attemptId}`);
    } catch (err: any) {
      console.error('Failed to start exam:', err);
      setErrorMsg(err.message || 'An error occurred while initializing the local exam session.');
      setIsStarting(false);
    }
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'SECURITY_CHALLENGE': return 'Security & Compliance Challenge';
      case 'TECH_DEEP_DIVE': return 'Technology & Services Deep Dive';
      case 'BILLING_SPECIALIST': return 'Billing & Pricing Specialist';
      case 'FOUNDATION': return 'Cloud Concepts Foundation';
      default: return 'Full CLF-C02 Mock Exam (65 Questions)';
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Header */}
        <div className="border-b border-slate-800/80 pb-6 mb-8">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Pre-Exam Verification & System Check</span>
          </div>
          <h1 className="text-3xl font-black text-white">
            {getModeTitle()}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Complete the verification checklist below before entering the secured examination environment.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Device Check & Video */}
          <div className="lg:col-span-6 space-y-6">
            {/* Candidate Credentials Card */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" />
                <span>Candidate Information</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Candidate ID</label>
                  <input
                    type="text"
                    value={candidateId}
                    onChange={(e) => setCandidateId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Webcam Stream Preview */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Proctor Camera Feed</span>
                </h3>
                {hasCamera ? (
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Video Feed
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold">
                    Virtual Simulation Mode
                  </span>
                )}
              </div>

              <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                  style={{ transform: 'scaleX(-1)' }}
                />
                {!hasCamera && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-slate-950/80">
                    <Camera className="w-10 h-10 text-slate-600 mb-2" />
                    <p className="text-xs text-slate-300 font-semibold">Webcam Not Detected / Blocked</p>
                    <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                      Proctoring will operate in simulated verification mode. You can still take the full exam!
                    </p>
                  </div>
                )}
              </div>

              {/* Hardware Checklist items */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <span className="flex items-center gap-2 text-slate-300">
                    <Camera className="w-4 h-4 text-slate-400" />
                    <span>Webcam Vision Tracking</span>
                  </span>
                  {hasCamera ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                    </span>
                  ) : (
                    <span className="text-amber-400 font-medium">Simulated</span>
                  )}
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <span className="flex items-center gap-2 text-slate-300">
                    <Mic className="w-4 h-4 text-slate-400" />
                    <span>Microphone Input Channel</span>
                  </span>
                  {hasMic ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                    </span>
                  ) : (
                    <span className="text-amber-400 font-medium">Simulated</span>
                  )}
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <span className="flex items-center gap-2 text-slate-300">
                    <Maximize2 className="w-4 h-4 text-slate-400" />
                    <span>Fullscreen Lock</span>
                  </span>
                  {isFullscreen ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Enabled
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={requestFullscreen}
                      className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold text-[11px] border border-amber-500/30"
                    >
                      Enable Fullscreen
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Exam Rules & Passing Criteria */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>CLF-C02 Exam Blueprint & Scoring Rules</span>
              </h3>

              <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>90-Minute Server Authoritative Timer</span>
                  </div>
                  <p className="text-slate-400">
                    You have exactly 90 minutes. The countdown is synchronized with the server. If the timer reaches 00:00:00, the exam will automatically submit.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Exact 35 / 50 Passing Standard (15 Unscored)</span>
                  </div>
                  <p className="text-slate-300">
                    The exam comprises 65 questions. Exactly 50 questions count toward your final score, while 15 questions are unscored evaluation items (hidden from candidates). You must answer at least <span className="font-bold text-white">35 out of the 50 scored questions</span> correctly (70%) to pass.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Strict AI Proctoring & Tab Switch Policy</span>
                  </div>
                  <p className="text-slate-400">
                    Switching browser tabs, leaving the window, or exiting fullscreen logs a strike. Accumulating 3 strikes triggers an integrity violation notice on your final score audit report.
                  </p>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="mt-6 pt-5 border-t border-slate-800/80">
                <label className="flex items-start gap-3 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    checked={agreedRules}
                    onChange={(e) => setAgreedRules(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs text-slate-300 group-hover:text-white leading-relaxed">
                    I understand the testing regulations, agree to the proctoring honor code, and confirm I am prepared to begin the examination without external aids.
                  </span>
                </label>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleStartExam}
                disabled={isStarting || !agreedRules}
                className="mt-6 w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                <span>{isStarting ? 'Initializing Exam Environment...' : 'Enter Proctored Exam (65 Questions)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
