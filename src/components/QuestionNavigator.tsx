'use client';

import React, { useState } from 'react';

export interface NavigatorItem {
  position: number;
  isAnswered: boolean;
  isFlagged: boolean;
}

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentPosition: number;
  items: NavigatorItem[];
  onSelect: (position: number) => void;
  className?: string;
}

type FilterType = 'all' | 'answered' | 'unanswered' | 'flagged';

export default function QuestionNavigator({
  totalQuestions,
  currentPosition,
  items,
  onSelect,
  className = '',
}: QuestionNavigatorProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  const answeredCount = items.filter((i) => i.isAnswered).length;
  const flaggedCount = items.filter((i) => i.isFlagged).length;
  const unansweredCount = totalQuestions - answeredCount;

  const filteredItems = items.filter((item) => {
    if (filter === 'answered') return item.isAnswered;
    if (filter === 'unanswered') return !item.isAnswered;
    if (filter === 'flagged') return item.isFlagged;
    return true;
  });

  return (
    <div className={`bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-2xl backdrop-blur-xl ${className}`}>
      {/* Header & Stats */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">Question Navigator</h3>
          <p className="text-xs text-slate-400">Total: {totalQuestions} Questions</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
            {answeredCount} Answered
          </span>
          <span className="px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg">
            {flaggedCount} ⚑ Flagged
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950/60 rounded-xl border border-slate-800/50 mb-4 text-xs font-medium">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`py-1.5 rounded-lg transition-all ${
            filter === 'all'
              ? 'bg-slate-800 text-white font-semibold shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All ({totalQuestions})
        </button>
        <button
          type="button"
          onClick={() => setFilter('answered')}
          className={`py-1.5 rounded-lg transition-all ${
            filter === 'answered'
              ? 'bg-emerald-900/50 text-emerald-300 font-semibold shadow'
              : 'text-slate-400 hover:text-emerald-400'
          }`}
        >
          Done ({answeredCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('unanswered')}
          className={`py-1.5 rounded-lg transition-all ${
            filter === 'unanswered'
              ? 'bg-slate-800 text-slate-200 font-semibold shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Left ({unansweredCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('flagged')}
          className={`py-1.5 rounded-lg transition-all ${
            filter === 'flagged'
              ? 'bg-amber-900/50 text-amber-300 font-semibold shadow'
              : 'text-slate-400 hover:text-amber-400'
          }`}
        >
          ⚑ Flag ({flaggedCount})
        </button>
      </div>

      {/* Grid of 1-65 Questions */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-2 max-h-[320px] overflow-y-auto pr-1">
        {filteredItems.map((item) => {
          const isCurrent = item.position === currentPosition;
          let btnStyle = 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:bg-slate-700/60 hover:text-slate-200';

          if (item.isAnswered && !item.isFlagged) {
            btnStyle = 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-semibold hover:bg-emerald-900/50';
          } else if (item.isFlagged && !item.isAnswered) {
            btnStyle = 'bg-amber-950/40 border-amber-500/40 text-amber-300 font-semibold hover:bg-amber-900/50';
          } else if (item.isAnswered && item.isFlagged) {
            btnStyle = 'bg-gradient-to-br from-emerald-950/50 to-amber-950/50 border-amber-400/50 text-amber-200 font-semibold';
          }

          if (isCurrent) {
            btnStyle = 'ring-2 ring-amber-400 border-amber-400 bg-amber-500/20 text-white font-bold shadow-lg shadow-amber-500/10 scale-105';
          }

          return (
            <button
              key={item.position}
              type="button"
              onClick={() => onSelect(item.position)}
              className={`relative h-10 rounded-xl border flex flex-col items-center justify-center text-xs transition-all duration-150 ${btnStyle}`}
              aria-label={`Go to question ${item.position}`}
            >
              <span>{item.position}</span>
              {item.isFlagged && (
                <span className="absolute top-0.5 right-1 text-[9px] text-amber-400 font-bold">
                  ●
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-600"></span>
          <span>Unanswered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-400"></span>
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-amber-400"></span>
          <span>Flagged</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full ring-2 ring-amber-400 bg-transparent"></span>
          <span>Current</span>
        </div>
      </div>
    </div>
  );
}
