import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const attempts = await prisma.examAttempt.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        questions: true,
        proctorEvents: true,
      }
    });

    // Map Prisma models to the LocalAttempt structure expected by the Admin UI
    const formattedAttempts = attempts.map(attempt => ({
      attemptId: attempt.id,
      username: attempt.userId,
      candidateName: attempt.userId, // We used username for candidateName
      mode: attempt.mode,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      status: attempt.status === 'READY' || attempt.status === 'IN_PROGRESS' ? 'in_progress' : 'completed',
      durationSeconds: 5400,
      questionCount: attempt.totalQuestions,
      scoredQuestionCount: attempt.scoredQuestions,
      unscoredQuestionCount: attempt.unscoredQuestions,
      questions: attempt.questions.map(q => ({
        questionId: q.questionId,
        displayNumber: q.position,
        isScored: q.isScored,
        selectedAnswers: q.selectedOptions ? JSON.parse(q.selectedOptions) : [],
        flagged: q.isFlagged,
        isCorrect: q.isCorrect
      })),
      incidents: attempt.proctorEvents.map(e => ({
        timestamp: e.timestamp,
        type: e.eventType,
        details: e.metadata
      })),
      score: attempt.scoredCorrect,
      totalScored: attempt.scoredQuestions,
      percentage: attempt.scorePercentage,
      passed: attempt.passed,
      expiresAt: attempt.expiresAt
    }));

    return NextResponse.json({ success: true, attempts: formattedAttempts });
  } catch (error: any) {
    console.error('Fetch attempts error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
