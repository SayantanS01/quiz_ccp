'use client';

import React, { useEffect, useState } from 'react';

interface TimerDisplayProps {
  expiresAt: string | Date;
  onExpire?: () => void;
  className?: string;
}

export default function TimerDisplay({ expiresAt, onExpire, className = '' }: TimerDisplayProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    const end = new Date(expiresAt).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((end - now) / 1000));
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const end = new Date(expiresAt).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      setSecondsRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        if (onExpire) {
          onExpire();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;

  const formattedTime =
    hours > 0
      ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Visual states: Normal (> 20 min), Warning (5 - 20 min), Critical (< 5 min)
  let statusClass = 'text-cyan-300 border-cyan-500/30 bg-cyan-950/20';
  let badgeText = 'Normal';
  let badgeClass = 'bg-cyan-500/20 text-cyan-300';

  if (secondsRemaining <= 300) {
    statusClass = 'text-rose-400 border-rose-500/50 bg-rose-950/40 animate-pulse';
    badgeText = 'CRITICAL (<5m)';
    badgeClass = 'bg-rose-500/30 text-rose-300';
  } else if (secondsRemaining <= 1200) {
    statusClass = 'text-amber-300 border-amber-500/40 bg-amber-950/30';
    badgeText = 'Warning (<20m)';
    badgeClass = 'bg-amber-500/20 text-amber-300';
  }

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded-xl border backdrop-blur-md shadow-lg transition-all ${statusClass} ${className}`}
      role="timer"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5 animate-spin-slow"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
          Remaining
        </span>
      </div>

      <span className="font-mono text-xl font-bold tracking-wider">
        {formattedTime}
      </span>

      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeClass}`}>
        {badgeText}
      </span>
    </div>
  );
}
