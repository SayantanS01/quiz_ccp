'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Cloud, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  RotateCcw,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Award
} from 'lucide-react';
import TimerDisplay from '@/components/TimerDisplay';
import QuestionNavigator, { NavigatorItem } from '@/components/QuestionNavigator';
import ProctorCamera from '@/components/ProctorCamera';

interface Option {
  id: string;
  label: string;
  text: string;
}

interface Question {
  position: number;
  id: string;
  questionCode: string;
  questionText: string;
  type: 'SINGLE_SELECT' | 'MULTI_SELECT';
  requiredSelections: number;
  domain: string;
  topic: string;
  difficulty: string;
  options: Option[];
  selectedOptions: string[] | null;
  isFlagged: boolean;
}

export default function ExamSessionPage() {
  const router = useRouter();
  const params = useParams();
  const attemptId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [examData, setExamData] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPos, setCurrentPos] = useState<number>(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string[]>>({});
  const [flaggedMap, setFlaggedMap] = useState<Record<number, boolean>>({});
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch exam session data
  useEffect(() => {
    async function loadExam() {
      try {
        setLoading(true);
        const { LocalAttemptRepository } = await import('@/lib/repositories');
        const data = await LocalAttemptRepository.getAttempt(attemptId);
        
        if (!data) {
          throw new Error('Failed to load local exam attempt');
        }

        if (data.status === 'completed') {
          router.replace(`/exam/result/${attemptId}`);
          return;
        }

        // Map IDB format to UI format
        const uiQuestions = data.questions.map(q => ({
          position: q.displayNumber,
          id: q.questionId,
          questionCode: '', // Not strictly needed for UI if missing
          questionText: '', 
          type: q.correctAnswers.length > 1 ? 'MULTI_SELECT' : 'SINGLE_SELECT',
          requiredSelections: q.correctAnswers.length,
          domain: '',
          topic: '',
          difficulty: '',
          options: q.displayedOptions.map(o => ({ id: o.id, label: o.label, text: o.text })),
          selectedOptions: q.selectedAnswers,
          isFlagged: q.flagged,
        }));

        setExamData({ ...data, expiresAt: data.expiresAt });
        setQuestions(uiQuestions as any);

        // Pre-populate selections and flagged
        const initialAnswers: Record<number, string[]> = {};
        const initialFlags: Record<number, boolean> = {};
        data.questions.forEach((q) => {
          if (q.selectedAnswers && q.selectedAnswers.length > 0) {
            initialAnswers[q.displayNumber] = q.selectedAnswers;
          }
          if (q.flagged) {
            initialFlags[q.displayNumber] = true;
          }
        });
        setSelectedAnswers(initialAnswers);
        setFlaggedMap(initialFlags);
      } catch (err: any) {
        console.error('Error fetching exam:', err);
        setError(err.message || 'Failed to connect to local exam session.');
      } finally {
        setLoading(false);
      }
    }

    if (attemptId) {
      loadExam();
    }
  }, [attemptId, router]);

  // Persist answer to local backend
  const saveAnswerToBackend = useCallback(
    async (pos: number, answers: string[], isFlagged: boolean) => {
      try {
        const { LocalAttemptRepository } = await import('@/lib/repositories');
        // pos is 1-indexed, we need 0-indexed for the array
        await LocalAttemptRepository.updateQuestionResponse(attemptId, pos - 1, answers, isFlagged);
      } catch (err) {
        console.error('Failed to sync answer locally:', err);
      }
    },
    [attemptId]
  );

  // Handle option selection
  const handleOptionClick = (label: string) => {
    const currentQ = questions.find((q) => q.position === currentPos);
    if (!currentQ) return;

    const existing = selectedAnswers[currentPos] || [];
    let updated: string[] = [];

    if (currentQ.type === 'SINGLE_SELECT') {
      updated = [label];
    } else {
      // MULTI_SELECT
      if (existing.includes(label)) {
        updated = existing.filter((l) => l !== label);
      } else {
        if (existing.length < currentQ.requiredSelections) {
          updated = [...existing, label].sort();
        } else {
          // Replace last selection if max already reached
          updated = [...existing.slice(1), label].sort();
        }
      }
    }

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentPos]: updated,
    }));

    saveAnswerToBackend(currentPos, updated, !!flaggedMap[currentPos]);
  };

  // Toggle flag
  const toggleFlag = () => {
    const newFlagState = !flaggedMap[currentPos];
    setFlaggedMap((prev) => ({
      ...prev,
      [currentPos]: newFlagState,
    }));
    const answers = selectedAnswers[currentPos] || [];
    saveAnswerToBackend(currentPos, answers, newFlagState);
  };

  // Clear selections for current question
  const clearSelection = () => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentPos];
      return copy;
    });
    saveAnswerToBackend(currentPos, [], !!flaggedMap[currentPos]);
  };

  // Submit Exam
  const handleSubmitExam = async () => {
    try {
      setIsSubmitting(true);
      const { LocalAttemptRepository } = await import('@/lib/repositories');
      const attempt = await LocalAttemptRepository.submitExam(attemptId, false);
      if (!attempt) {
        throw new Error('Failed to submit local exam');
      }

      router.push(`/exam/result/${attemptId}`);
    } catch (err: any) {
      console.error('Submit exam error:', err);
      alert(err.message || 'Error submitting exam. Please retry.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mb-4" />
        <p className="text-sm text-slate-300 font-semibold tracking-wide">
          Connecting to secure proctored environment...
        </p>
      </div>
    );
  }

  if (error || !examData) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center p-6 text-white text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Examination Session Error</h2>
        <p className="text-sm text-slate-400 max-w-md mb-6">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const currentQ = questions.find((q) => q.position === currentPos) || questions[0];
  const currentSelections = selectedAnswers[currentPos] || [];
  const isCurrentFlagged = !!flaggedMap[currentPos];

  // Navigator items
  const navigatorItems: NavigatorItem[] = questions.map((q) => ({
    position: q.position,
    isAnswered: !!selectedAnswers[q.position] && selectedAnswers[q.position].length > 0,
    isFlagged: !!flaggedMap[q.position],
  }));

  const answeredCount = Object.keys(selectedAnswers).filter(
    (k) => selectedAnswers[Number(k)]?.length > 0
  ).length;
  const unansweredCount = questions.length - answeredCount;
  const flaggedCount = Object.values(flaggedMap).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Top Authoritative Exam Header */}
      <header className="sticky top-0 z-40 bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Mode */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
              <Cloud className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">CloudPrep Proctored</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  CLF-C02
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Question <span className="text-white font-bold">{currentPos}</span> of {questions.length}
              </p>
            </div>
          </div>

          {/* Synchronized Timer */}
          <div className="flex items-center gap-4">
            <TimerDisplay
              expiresAt={examData.expiresAt}
              onExpire={handleSubmitExam}
            />

            {/* Finish & Submit Button */}
            <button
              type="button"
              onClick={() => setShowFinishModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Finish Exam</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Examination Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Main Question Area */}
        <div className="lg:col-span-8 flex flex-col justify-between rounded-2xl bg-slate-900/60 border border-slate-800/90 p-6 sm:p-8 shadow-xl min-h-[580px]">
          <div>
            {/* Question Meta Badge Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono font-bold">
                  {currentQ.questionCode}
                </span>

                <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold">
                  {currentQ.domain}
                </span>

                <span className="px-2 py-1 rounded-md bg-slate-800/70 text-slate-300 text-xs">
                  {currentQ.topic}
                </span>
              </div>

              {/* Selection Rule Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded-full">
                  {currentQ.type === 'SINGLE_SELECT'
                    ? 'Single Select • Choose 1'
                    : `Multi Select • Choose ${currentQ.requiredSelections}`}
                </span>
              </div>
            </div>

            {/* Question Prompt */}
            <div className="mb-8">
              <h2 className="text-base sm:text-lg font-semibold text-white leading-relaxed select-none">
                {currentQ.questionText}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt) => {
                const isSelected = currentSelections.includes(opt.label);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleOptionClick(opt.label)}
                    className={`w-full p-4 rounded-xl border text-left flex items-start gap-4 transition-all duration-150 select-none ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50'
                        : 'bg-slate-950/40 border-slate-800/90 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    {/* Option Letter Indicator */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-black shadow'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {opt.label}
                    </div>

                    {/* Option Text */}
                    <div className="flex-1 text-sm font-medium leading-relaxed">
                      {opt.text}
                    </div>

                    {/* Radio/Checkbox indicator visual */}
                    <div className="flex-shrink-0 mt-1">
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-amber-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-700" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Question Controls */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            {/* Left Controls: Flag & Clear */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleFlag}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  isCurrentFlagged
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${isCurrentFlagged ? 'fill-current' : ''}`} />
                <span>{isCurrentFlagged ? 'Flagged for Review' : 'Flag Question'}</span>
              </button>

              {currentSelections.length > 0 && (
                <button
                  type="button"
                  onClick={clearSelection}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Selection</span>
                </button>
              )}
            </div>

            {/* Right Controls: Previous & Next */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={currentPos === 1}
                onClick={() => setCurrentPos((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentPos < questions.length ? (
                <button
                  type="button"
                  onClick={() => setCurrentPos((p) => Math.min(questions.length, p + 1))}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-105"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowFinishModal(true)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
                >
                  <span>Review & Finish</span>
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Proctor Camera & Question Navigator */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Proctor Camera */}
          <ProctorCamera
            attemptId={attemptId}
            onAutoSubmit={handleSubmitExam}
            className="w-full"
          />

          {/* Question Grid Navigator */}
          <QuestionNavigator
            totalQuestions={questions.length}
            currentPosition={currentPos}
            items={navigatorItems}
            onSelect={(pos) => setCurrentPos(pos)}
            className="w-full"
          />
        </div>
      </main>

      {/* Finish Exam Confirmation Modal */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Submit Examination?</h3>
                <p className="text-xs text-slate-400">CLF-C02 Final Verification</p>
              </div>
            </div>

            {/* Answered / Unanswered status breakdown */}
            <div className="grid grid-cols-3 gap-3 my-6 text-center text-xs">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-lg font-black text-emerald-400">{answeredCount}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Answered</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-lg font-black text-slate-200">{unansweredCount}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Unanswered</div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="text-lg font-black text-amber-400">{flaggedCount}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Flagged</div>
              </div>
            </div>

            {unansweredCount > 0 && (
              <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  You have <strong className="text-white">{unansweredCount} unanswered questions</strong>. AWS exams do not penalize guessing, so answering all questions is strongly recommended.
                </span>
              </div>
            )}

            <div className="space-y-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitExam}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 disabled:opacity-50"
              >
                {isSubmitting ? 'Calculating Official Score...' : 'Confirm Submission & View Results'}
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowFinishModal(false)}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-all"
              >
                Return to Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
