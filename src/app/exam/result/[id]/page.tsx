'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  FileText, 
  ArrowRight, 
  RotateCcw, 
  BarChart3, 
  BookOpen, 
  Layers, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Filter,
  Check,
  X
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { PDFReportView } from '@/components/PDFReportView';
import { useAuth } from '@/components/AuthProvider';

interface OptionReview {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
}

interface QuestionReview {
  aqId: string;
  position: number;
  questionCode: string;
  questionText: string;
  type: string;
  domain: string;
  topic: string;
  difficulty: string;
  explanation: string;
  sourceModule?: string;
  isScored: boolean;
  options: OptionReview[];
  correctAnswers: string[];
  selectedOptions: string[];
  isCorrect: boolean;
}

export default function ExamResultPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [filterType, setFilterType] = useState<'all' | 'correct' | 'incorrect' | 'scored' | 'unscored'>('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});

  const { session } = useAuth();

  useEffect(() => {
    async function loadResult() {
      try {
        setLoading(true);
        const res = await fetch(`/api/exam/result/${attemptId}`);
        const resultData = await res.json();
        if (resultData.success) {
          setData(resultData);

          if (resultData.summary?.passed) {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
            });
          }
        } else {
          throw new Error('Result not found');
        }
      } catch (err) {
        console.error('Failed to load result:', err);
      } finally {
        setLoading(false);
      }
    }

    if (attemptId) {
      loadResult();
    }
  }, [attemptId]);



  const toggleQuestionExpand = (pos: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [pos]: !prev[pos],
    }));
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mb-4" />
        <p className="text-sm text-slate-300 font-semibold">
          Compiling official score report & domain analytics...
        </p>
      </div>
    );
  }

  if (!data || !data.attempt) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Result Report Not Found</h2>
        <p className="text-sm text-slate-400 max-w-md mb-6">
          The requested examination result could not be retrieved.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { attempt, summary: apiSummary, questions } = data;
  const summary = {
    ...apiSummary,
    scoredScore: apiSummary.scoredCorrect,
    totalScored: apiSummary.scoredQuestions,
    unscoredScore: apiSummary.unscoredCorrect,
    totalUnscored: apiSummary.unscoredQuestions,
    percentage: apiSummary.scoredAccuracyPercent,
  };

  const filteredQuestions = questions.filter((q: QuestionReview) => {
    if (filterType === 'correct') return q.isCorrect;
    if (filterType === 'incorrect') return !q.isCorrect;
    if (filterType === 'scored') return q.isScored;
    if (filterType === 'unscored') return !q.isScored;
    return true;
  });

  const isCustom = attempt.mode === 'CUSTOM_QUIZ';

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Pass/Fail Banner */}
        <div
          className={`rounded-3xl p-8 sm:p-10 border shadow-2xl relative overflow-hidden mb-10 ${
            summary.passed
              ? 'bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border-emerald-500/40 shadow-emerald-950/30'
              : 'bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border-rose-500/40 shadow-rose-950/30'
          }`}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border">
                {summary.passed ? (
                  <span className="text-emerald-400 bg-emerald-500/10 border-emerald-500/30 px-3 py-0.5 rounded-full flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> OFFICIAL STATUS: PASSED
                  </span>
                ) : (
                  <span className="text-rose-400 bg-rose-500/10 border-rose-500/30 px-3 py-0.5 rounded-full flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> OFFICIAL STATUS: DID NOT PASS
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {summary.passed
                  ? 'Congratulations! You Passed the Exam'
                  : 'Keep Practicing — You Can Do It!'}
              </h1>

              {/* 35/50 Scored Rule Explanation */}
              {isCustom ? (
                <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                  You scored <strong className="text-white font-bold">{summary.scoredScore} out of {summary.totalScored}</strong> on your custom practice quiz ({summary.percentage}%). Overall total: {summary.totalCorrect} / {summary.totalQuestions} correct.
                </p>
              ) : (
                <>
                  <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                    You scored <strong className="text-white font-bold">{summary.scoredScore} out of {summary.totalScored}</strong> on the scored examination items ({summary.percentage}%). Under the official CLF-C02 specification, a minimum of <strong className="text-amber-400">35 / 50 (70%)</strong> is required to pass.
                  </p>
                  <p className="text-xs text-slate-400">
                    The additional {summary.totalUnscored} questions were unscored pretest items (you answered {summary.unscoredScore} of {summary.totalUnscored} correctly). Overall total: {summary.totalCorrect} / {summary.totalQuestions} correct.
                  </p>
                </>
              )}
            </div>

            {/* Score Wheel / Big Stat */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[180px]">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Scored Result
              </div>
              <div
                className={`text-4xl sm:text-5xl font-black ${
                  summary.passed ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {summary.scoredScore} <span className="text-xl font-normal text-slate-500">/ {isCustom ? summary.totalQuestions : 50}</span>
              </div>
              <div className="mt-2 text-xs font-semibold text-slate-300">
                {summary.percentage}% Final Score
              </div>
            </div>
          </div>

          {/* Action Bar inside Banner */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <PDFReportView
              attempt={attempt}
              summary={summary}
              questions={questions}
            />

            <div className="flex items-center gap-3">
              <Link
                href={session?.isAdmin ? "/admin" : "/"}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
              >
                {session?.isAdmin ? "Admin Portal" : "Dashboard"}
              </Link>

              <Link
                href="/exam/setup/FULL_MOCK"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all hover:scale-105"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Exam</span>
              </Link>

              <Link
                href="/study"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-xs border border-slate-700 transition-all hover:scale-105"
              >
                <BookOpen className="w-4 h-4" />
                <span>Study Questions</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Time Spent</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {formatDuration(attempt.timeSpentSeconds || 0)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{isCustom ? summary.totalQuestions * 2 : 90}m allotted time</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Unscored Pretest</span>
              <Layers className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {summary.unscoredScore} <span className="text-xs text-slate-400">/ {isCustom ? summary.totalUnscored : 15}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">AWS evaluation items</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Total Raw Score</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {summary.totalCorrect} <span className="text-xs text-slate-400">/ {summary.totalQuestions}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Combined accuracy</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Proctoring Record</span>
              {attempt.violationCount === 0 ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              )}
            </div>
            <div className={`text-xl font-bold ${attempt.violationCount === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {attempt.violationCount === 0 ? 'Clean Record' : `${attempt.violationCount} Strikes`}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Honor code compliance</p>
          </div>
        </div>

        {/* Domain Mastery Breakdown */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 mb-10">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <span>CLF-C02 Domain Mastery Performance</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(summary.domainBreakdown || {}).map(([domainName, data]: [string, any]) => {
              const pct = data.percentage;
              let barColor = 'bg-rose-500';
              let badge = 'Needs Review';
              let badgeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/30';

              if (pct >= 75) {
                barColor = 'bg-emerald-500';
                badge = 'Proficient';
                badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
              } else if (pct >= 65) {
                barColor = 'bg-amber-500';
                badge = 'Borderline';
                badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
              }

              return (
                <div key={domainName} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="font-bold text-white text-xs sm:text-sm">{domainName}</h4>
                      <span className="text-[11px] text-slate-400">
                        {data.correct} of {data.total} answered correctly
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle}`}>
                      {badge}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mt-3">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="text-right mt-1.5 text-xs font-bold text-slate-300">
                    {pct}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Review */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>Comprehensive {summary.totalQuestions}-Question Audit</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Review your selections, official answers, and in-depth AWS architecture explanations.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              {(['all', 'correct', 'incorrect', 'scored', 'unscored'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilterType(tab)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-all ${
                    filterType === tab
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* List of Questions */}
          <div className="space-y-4">
            {filteredQuestions.map((q: QuestionReview) => {
              const isExpanded = expandedQuestions[q.position] ?? true; // default expanded

              return (
                <div
                  key={q.aqId}
                  className={`rounded-xl border transition-all print:break-inside-avoid print:mb-6 ${
                    q.isCorrect
                      ? 'bg-slate-950/40 border-slate-800 hover:border-emerald-500/40'
                      : 'bg-rose-950/10 border-rose-500/20 hover:border-rose-500/40'
                  }`}
                >
                  {/* Question Header Bar */}
                  <div
                    onClick={() => toggleQuestionExpand(q.position)}
                    className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                          q.isCorrect
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {q.position}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-mono text-[11px] font-bold text-slate-300">
                            {q.questionCode}
                          </span>
                          <span className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                            {q.domain}
                          </span>
                          {q.isScored ? (
                            <span className="text-[10px] text-cyan-400 bg-cyan-950/50 border border-cyan-500/30 px-2 py-0.5 rounded">
                              Scored Item
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">
                              Unscored Pretest
                            </span>
                          )}
                          {q.sourceModule && (
                            <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">
                              {q.sourceModule}
                            </span>
                          )}
                        </div>

                        <p className="text-sm font-semibold text-white line-clamp-2 sm:line-clamp-1">
                          {q.questionText}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {q.isCorrect ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4" /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-400 font-bold text-xs">
                          <XCircle className="w-4 h-4" /> Incorrect
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Body: Options & Architectural Explanation */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 pt-0 border-t border-slate-800/60 mt-2 space-y-4 text-xs">
                      {/* Full question text if truncated */}
                      <p className="text-slate-200 text-sm font-medium leading-relaxed">
                        {q.questionText}
                      </p>

                      {/* Options Grid */}
                      <div className="space-y-2">
                        {q.options.map((opt) => {
                          const isCandidateChoice = q.selectedOptions.includes(opt.label);
                          const isCorrectChoice = q.correctAnswers.includes(opt.label);

                          let borderStyle = 'border-slate-800 bg-slate-900/40 text-slate-300';
                          if (isCorrectChoice) {
                            borderStyle = 'border-emerald-500/60 bg-emerald-950/30 text-emerald-200 font-semibold';
                          } else if (isCandidateChoice && !isCorrectChoice) {
                            borderStyle = 'border-rose-500/60 bg-rose-950/30 text-rose-200';
                          }

                          return (
                            <div
                              key={opt.id}
                              className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${borderStyle}`}
                            >
                              <div
                                className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${
                                  isCorrectChoice
                                    ? 'bg-emerald-500 text-slate-950'
                                    : isCandidateChoice
                                    ? 'bg-rose-500 text-white'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {opt.label}
                              </div>

                              <div className="flex-1 text-xs sm:text-sm">
                                <p>{opt.text}</p>
                                {(opt as any).explanation && (
                                  <div className="mt-2 p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-200/80 text-[11px] leading-relaxed">
                                    <span className="font-bold text-indigo-400 mr-1">Explanation:</span>
                                    {(opt as any).explanation}
                                  </div>
                                )}
                              </div>

                              <div className="flex-shrink-0 text-[11px] font-bold">
                                {isCorrectChoice && (
                                  <span className="text-emerald-400 flex items-center gap-1">
                                    <Check className="w-3.5 h-3.5" /> Correct Answer
                                  </span>
                                )}
                                {isCandidateChoice && !isCorrectChoice && (
                                  <span className="text-rose-400 flex items-center gap-1">
                                    <X className="w-3.5 h-3.5" /> Your Choice
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* AWS Architecture Explanation Box */}
                      <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 mt-4">
                        <div className="flex items-center gap-2 text-amber-400 font-bold mb-1.5">
                          <BookOpen className="w-4 h-4" />
                          <span>Official AWS Explanation</span>
                        </div>
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
