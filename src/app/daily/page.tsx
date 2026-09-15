'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Sparkles, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function DailyChallengePage() {
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [todayDate, setTodayDate] = useState('');
  const [userSelections, setUserSelections] = useState<Record<string, string[]>>({});
  const [evalResults, setEvalResults] = useState<Record<string, any>>({});

  useEffect(() => {
    async function loadDaily() {
      try {
        setLoading(true);
        const res = await fetch('/api/daily');
        const data = await res.json();
        if (data.success) {
          setStreak(data.streak || 0);
          setQuestions(data.questions || []);
          setTodayDate(data.today || '');
        }
      } catch (err) {
        console.error('Failed to load daily challenge:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDaily();
  }, []);

  const handleSelectOption = (qId: string, type: string, required: number, label: string) => {
    if (evalResults[qId]) return;
    setUserSelections((prev) => {
      const existing = prev[qId] || [];
      if (type === 'SINGLE_SELECT') {
        return { ...prev, [qId]: [label] };
      } else {
        if (existing.includes(label)) {
          return { ...prev, [qId]: existing.filter((l) => l !== label) };
        } else {
          return { ...prev, [qId]: existing.length < required ? [...existing, label].sort() : [...existing.slice(1), label].sort() };
        }
      }
    });
  };

  const verifyQuestion = async (qId: string) => {
    const selected = userSelections[qId];
    if (!selected || selected.length === 0) return;

    try {
      const res = await fetch('/api/study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: qId, selectedOptions: selected }),
      });
      const data = await res.json();
      if (data.success) {
        setEvalResults((prev) => ({
          ...prev,
          [qId]: {
            isCorrect: data.isCorrect,
            correctAnswers: data.correctAnswers,
            explanation: data.explanation,
          },
        }));
      }
    } catch (err) {
      console.error('Failed to verify answer:', err);
    }
  };

  const answeredCount = Object.keys(evalResults).length;
  const correctCount = Object.values(evalResults).filter((r: any) => r.isCorrect).length;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Calendar className="w-4 h-4" />
              <span>Daily Knowledge Retention</span>
            </div>
            <h1 className="text-3xl font-black text-white">Daily 10-Question Challenge</h1>
            <p className="text-sm text-slate-400 mt-1">
              10 fresh questions refreshed daily to build muscle memory and exam confidence.
            </p>
          </div>

          {/* Streak Badge */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black text-white">{streak} Day{streak !== 1 ? 's' : ''}</div>
              <p className="text-[11px] text-amber-400 font-semibold">Active Daily Streak</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
            <span>Completed: <strong className="text-white">{answeredCount}</strong> / {questions.length}</span>
          </div>
          {answeredCount > 0 && (
            <div className="text-xs font-bold text-emerald-400">
              Accuracy: {correctCount} / {answeredCount} ({Math.round((correctCount / answeredCount) * 100)}%)
            </div>
          )}
        </div>

        {/* Question Cards */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-10 h-10 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mb-3" />
            <p className="text-xs font-semibold">Loading daily challenge questions...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((q, idx) => {
              const selected = userSelections[q.id] || [];
              const evalRes = evalResults[q.id];

              return (
                <div
                  key={q.id}
                  className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
                        {q.questionCode}
                      </span>
                      <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded">
                        {q.domain}
                      </span>
                      <span className="text-xs text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
                        {q.topic}
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-slate-400">
                      Challenge #{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white mb-6 leading-relaxed">
                    {q.questionText}
                  </h3>

                  <div className="space-y-2.5">
                    {q.options.map((opt: any) => {
                      const isSelected = selected.includes(opt.label);
                      const isCorrect = evalRes?.correctAnswers.includes(opt.label);

                      let style = 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800/60';
                      if (evalRes) {
                        if (isCorrect) {
                          style = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 font-semibold';
                        } else if (isSelected && !isCorrect) {
                          style = 'bg-rose-950/30 border-rose-500/50 text-rose-200';
                        }
                      } else if (isSelected) {
                        style = 'bg-amber-500/15 border-amber-500 text-white ring-1 ring-amber-500/40';
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={!!evalRes}
                          onClick={() => handleSelectOption(q.id, q.type, q.requiredSelections, opt.label)}
                          className={`w-full p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${style}`}
                        >
                          <div
                            className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${
                              evalRes && isCorrect
                                ? 'bg-emerald-500 text-slate-950'
                                : evalRes && isSelected
                                ? 'bg-rose-500 text-white'
                                : isSelected
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {opt.label}
                          </div>
                          <div className="flex-1 text-xs sm:text-sm font-medium">
                            {opt.text}
                          </div>
                          {evalRes && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-1" />
                          )}
                          {evalRes && isSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {!evalRes ? (
                    <div className="mt-5 flex justify-end">
                      <button
                        type="button"
                        disabled={selected.length === 0}
                        onClick={() => verifyQuestion(q.id)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition-all disabled:opacity-40"
                      >
                        Submit Answer
                      </button>
                    </div>
                  ) : (
                    <div className="mt-5 p-4 rounded-xl bg-slate-900 border border-amber-500/30 text-xs">
                      <div className="flex items-center gap-2 mb-2 font-bold text-amber-400">
                        <Award className="w-4 h-4" />
                        <span>Daily Solution Review</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                        {evalRes.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
