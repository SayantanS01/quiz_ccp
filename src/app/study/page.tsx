'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  Layers,
  HelpCircle,
  Award
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';

interface Option {
  id: string;
  label: string;
  text: string;
}

interface Question {
  id: string;
  questionCode: string;
  questionText: string;
  type: 'SINGLE_SELECT' | 'MULTI_SELECT';
  requiredSelections: number;
  domain: string;
  domainId: number;
  topic: string;
  difficulty: string;
  options: Option[];
  sourceModule?: string;
}

export default function StudyPage() {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;

  // Filters
  const [domainFilter, setDomainFilter] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Per-question state
  const [userSelections, setUserSelections] = useState<Record<string, string[]>>({});
  const [evalResults, setEvalResults] = useState<Record<string, { isCorrect: boolean; correctAnswers: string[]; explanation: string }>>({});
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          limit: limit.toString(),
          offset: ((page - 1) * limit).toString(),
        });
        if (domainFilter) params.set('domainId', domainFilter);
        if (difficultyFilter) params.set('difficulty', difficultyFilter);
        if (searchQuery) params.set('search', searchQuery);

        const res = await fetch(`/api/study?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setQuestions(data.questions);
          setTotal(data.total);
        }
      } catch (err) {
        console.error('Failed to load study questions:', err);
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, [page, domainFilter, difficultyFilter, searchQuery]);

  const handleSelectOption = (qId: string, type: string, required: number, label: string) => {
    // If already verified, don't change
    if (evalResults[qId]) return;

    setUserSelections((prev) => {
      const existing = prev[qId] || [];
      if (type === 'SINGLE_SELECT') {
        return { ...prev, [qId]: [label] };
      } else {
        if (existing.includes(label)) {
          return { ...prev, [qId]: existing.filter((l) => l !== label) };
        } else {
          if (existing.length < required) {
            return { ...prev, [qId]: [...existing, label].sort() };
          } else {
            return { ...prev, [qId]: [...existing.slice(1), label].sort() };
          }
        }
      }
    });
  };

  const checkAnswer = async (qId: string) => {
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
      console.error('Error checking answer:', err);
    }
  };

  const toggleBookmark = (qId: string) => {
    setBookmarked((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 mb-8">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Interactive Learning Lab</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-white">Untimed Study Mode</h1>
              <p className="text-sm text-slate-400 mt-1">
                Explore all 840 verified questions with instant answers, architecture breakdowns, and domain filters.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold">
                {total} Questions Available
              </span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 mb-8 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search concepts, AWS services (e.g. S3, IAM, KMS)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={domainFilter}
              onChange={(e) => {
                setDomainFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="">All CLF-C02 Domains</option>
              <option value="1">Domain 1: Cloud Concepts</option>
              <option value="2">Domain 2: Security & Compliance</option>
              <option value="3">Domain 3: Cloud Technology & Services</option>
              <option value="4">Domain 4: Billing, Pricing & Support</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={difficultyFilter}
              onChange={(e) => {
                setDifficultyFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-10 h-10 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mb-3" />
            <p className="text-xs font-semibold">Loading practice questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
            <p className="text-sm font-semibold text-slate-300">No questions found matching your filter criteria.</p>
            <button
              onClick={() => {
                setDomainFilter('');
                setDifficultyFilter('');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((q, idx) => {
              const selected = userSelections[q.id] || [];
              const evalRes = evalResults[q.id];
              const isBooked = !!bookmarked[q.id];

              return (
                <div
                  key={q.id}
                  className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl"
                >
                  {/* Top bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                        {q.questionCode}
                      </span>
                      <span className="text-xs font-semibold text-slate-300 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded">
                        {q.domain}
                      </span>
                      <span className="text-xs text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
                        {q.topic}
                      </span>
                      {q.sourceModule && (
                        <span className="text-[10px] text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded">
                          {q.sourceModule}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleBookmark(q.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isBooked
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                        title="Bookmark for later"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {q.type === 'SINGLE_SELECT' ? 'Single Choice' : `Select ${q.requiredSelections}`}
                      </span>
                    </div>
                  </div>

                  {/* Question Text */}
                  <h3 className="text-base font-semibold text-white mb-6 leading-relaxed">
                    {q.questionText}
                  </h3>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {q.options.map((opt) => {
                      const isSelected = selected.includes(opt.label);
                      const isCorrectAnswer = evalRes?.correctAnswers.includes(opt.label);

                      let optionStyle = 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800/60';
                      if (evalRes) {
                        if (isCorrectAnswer) {
                          optionStyle = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 font-semibold';
                        } else if (isSelected && !isCorrectAnswer) {
                          optionStyle = 'bg-rose-950/30 border-rose-500/50 text-rose-200';
                        }
                      } else if (isSelected) {
                        optionStyle = 'bg-amber-500/15 border-amber-500 text-white ring-1 ring-amber-500/40';
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={!!evalRes}
                          onClick={() => handleSelectOption(q.id, q.type, q.requiredSelections, opt.label)}
                          className={`w-full p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${optionStyle}`}
                        >
                          <div
                            className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${
                              evalRes && isCorrectAnswer
                                ? 'bg-emerald-500 text-slate-950'
                                : evalRes && isSelected
                                ? 'bg-rose-500 text-white'
                                : isSelected
                                ? 'bg-amber-500 text-slate-950 font-black'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {opt.label}
                          </div>
                          <div className="flex-1 text-xs sm:text-sm font-medium">
                            {opt.text}
                          </div>
                          {evalRes && isCorrectAnswer && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-1" />
                          )}
                          {evalRes && isSelected && !isCorrectAnswer && (
                            <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Actions & Instant Feedback */}
                  {!evalRes ? (
                    <div className="mt-5 flex justify-end">
                      <button
                        type="button"
                        disabled={selected.length === 0}
                        onClick={() => checkAnswer(q.id)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 disabled:opacity-40 transition-all hover:scale-105"
                      >
                        Check Answer & Explanation
                      </button>
                    </div>
                  ) : (
                    <div className="mt-5 p-4 rounded-xl bg-slate-900 border border-amber-500/30 text-xs">
                      <div className="flex items-center gap-2 mb-2 font-bold text-amber-400">
                        <Award className="w-4 h-4" />
                        <span>AWS Architecture Explanation</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                        {evalRes.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <span className="text-xs text-slate-400 font-medium">
                  Page <strong className="text-white">{page}</strong> of {totalPages}
                </span>

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 disabled:opacity-30"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
