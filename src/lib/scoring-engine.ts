export interface ScoredQuestionResult {
  questionId: string;
  isScored: boolean;
  type: string;
  correctAnswers: string[]; // labels e.g. ["A"] or ["A", "C"]
  selectedOptions: string[]; // candidate chosen labels e.g. ["A"] or ["A", "C"]
  isCorrect: boolean;
  domain: string;
  topic: string;
}

export interface ExamScoreSummary {
  totalQuestions: number;
  scoredQuestions: number;
  unscoredQuestions: number;
  scoredCorrect: number;
  scoredIncorrect: number;
  unscoredCorrect: number;
  unscoredIncorrect: number;
  totalCorrect: number;
  passingThreshold: number;
  passed: boolean;
  scoredAccuracyPercent: number;
  totalAccuracyPercent: number;
  domainBreakdown: Record<
    string,
    { total: number; correct: number; percentage: number }
  >;
  topicBreakdown: Record<
    string,
    { total: number; correct: number; percentage: number }
  >;
}

/**
 * Validates whether the candidate's selected answers match the correct answers.
 * Exact-match scoring: No partial credit.
 */
export function evaluateAnswer(
  type: string,
  correctAnswers: string[],
  selectedOptions: string[]
): boolean {
  if (!selectedOptions || selectedOptions.length === 0) return false;

  const sortedCorrect = [...correctAnswers].map((a) => a.trim().toUpperCase()).sort();
  const sortedSelected = [...selectedOptions].map((a) => a.trim().toUpperCase()).sort();

  if (sortedCorrect.length !== sortedSelected.length) return false;

  return sortedCorrect.every((val, idx) => val === sortedSelected[idx]);
}

/**
 * Server-authoritative Exam Scoring Engine.
 * 65 Questions total: 50 Scored, 15 Unscored.
 * Passing Rule: scoredCorrect >= 35 out of 50.
 * Unscored questions NEVER determine pass/fail.
 */
export function scoreExamAttempt(
  questions: {
    questionId: string;
    isScored: boolean;
    type: string;
    correctAnswers: string[];
    selectedOptions: string[];
    domain: string;
    topic: string;
  }[]
): ExamScoreSummary {
  const TOTAL_QUESTIONS = 65;
  const SCORED_QUESTIONS = 50;
  const UNSCORED_QUESTIONS = 15;
  const PASSING_CORRECT = 35;

  let scoredCorrect = 0;
  let scoredIncorrect = 0;
  let unscoredCorrect = 0;
  let unscoredIncorrect = 0;

  const domainMap: Record<string, { total: number; correct: number }> = {};
  const topicMap: Record<string, { total: number; correct: number }> = {};

  for (const q of questions) {
    const isCorrect = evaluateAnswer(q.type, q.correctAnswers, q.selectedOptions);

    if (q.isScored) {
      if (isCorrect) {
        scoredCorrect++;
      } else {
        scoredIncorrect++;
      }
    } else {
      if (isCorrect) {
        unscoredCorrect++;
      } else {
        unscoredIncorrect++;
      }
    }

    // Domain tracking
    if (!domainMap[q.domain]) {
      domainMap[q.domain] = { total: 0, correct: 0 };
    }
    domainMap[q.domain].total++;
    if (isCorrect) domainMap[q.domain].correct++;

    // Topic tracking
    if (!topicMap[q.topic]) {
      topicMap[q.topic] = { total: 0, correct: 0 };
    }
    topicMap[q.topic].total++;
    if (isCorrect) topicMap[q.topic].correct++;
  }

  const passed = scoredCorrect >= PASSING_CORRECT;
  const totalCorrect = scoredCorrect + unscoredCorrect;
  const scoredAccuracyPercent =
    SCORED_QUESTIONS > 0 ? Math.round((scoredCorrect / SCORED_QUESTIONS) * 100) : 0;
  const totalAccuracyPercent =
    questions.length > 0 ? Math.round((totalCorrect / questions.length) * 100) : 0;

  const domainBreakdown: Record<
    string,
    { total: number; correct: number; percentage: number }
  > = {};
  for (const [domain, stats] of Object.entries(domainMap)) {
    domainBreakdown[domain] = {
      total: stats.total,
      correct: stats.correct,
      percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    };
  }

  const topicBreakdown: Record<
    string,
    { total: number; correct: number; percentage: number }
  > = {};
  for (const [topic, stats] of Object.entries(topicMap)) {
    topicBreakdown[topic] = {
      total: stats.total,
      correct: stats.correct,
      percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    };
  }

  return {
    totalQuestions: questions.length,
    scoredQuestions: SCORED_QUESTIONS,
    unscoredQuestions: UNSCORED_QUESTIONS,
    scoredCorrect,
    scoredIncorrect,
    unscoredCorrect,
    unscoredIncorrect,
    totalCorrect,
    passingThreshold: PASSING_CORRECT,
    passed,
    scoredAccuracyPercent,
    totalAccuracyPercent,
    domainBreakdown,
    topicBreakdown,
  };
}
