import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scoreExamAttempt, evaluateAnswer } from '@/lib/scoring-engine';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const attemptId = params.id;
    if (!attemptId) {
      return NextResponse.json({ success: false, error: 'Attempt ID is required' }, { status: 400 });
    }

    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        proctorEvents: {
          orderBy: { timestamp: 'asc' },
        },
        questions: {
          include: {
            question: {
              include: {
                options: true,
              },
            },
          },
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json({ success: false, error: 'Exam attempt not found' }, { status: 404 });
    }

    // Format questions review
    const questionEvaluations = attempt.questions.map((aq) => {
      const orderIds: string[] = aq.optionsOrder ? JSON.parse(aq.optionsOrder) : [];
      
      const orderedOptions = orderIds.map((optId, idx) => {
        const opt = aq.question.options.find((o) => o.id === optId);
        const label = String.fromCharCode(65 + idx);
        return {
          id: optId,
          label,
          text: opt ? opt.text : '',
          isCorrect: opt ? opt.isCorrect : false,
        };
      });

      const correctLabels = orderedOptions
        .filter((o) => o.isCorrect)
        .map((o) => o.label);

      const selectedLabels: string[] = aq.selectedOptions
        ? JSON.parse(aq.selectedOptions)
        : [];

      const isCorrect = evaluateAnswer(aq.question.type, correctLabels, selectedLabels);

      return {
        aqId: aq.id,
        position: aq.position,
        questionId: aq.question.id,
        questionCode: aq.question.questionCode,
        questionText: aq.question.questionText,
        type: aq.question.type,
        domain: aq.question.domain,
        topic: aq.question.topic,
        difficulty: aq.question.difficulty,
        explanation: aq.question.explanation,
        sourceModule: aq.question.sourceModule,
        isScored: aq.isScored,
        options: orderedOptions,
        correctAnswers: correctLabels,
        selectedOptions: selectedLabels,
        isCorrect,
      };
    });

    // Domain and Topic analytics
    const scoreSummary = scoreExamAttempt(
      questionEvaluations.map((q) => ({
        questionId: q.questionId,
        isScored: q.isScored,
        type: q.type,
        correctAnswers: q.correctAnswers,
        selectedOptions: q.selectedOptions,
        domain: q.domain,
        topic: q.topic,
      }))
    );

    return NextResponse.json({
      success: true,
      attempt: {
        id: attempt.id,
        mode: attempt.mode,
        status: attempt.status,
        startedAt: attempt.startedAt,
        submittedAt: attempt.submittedAt,
        timeSpentSeconds: attempt.timeSpentSeconds,
        passed: attempt.passed,
        scoredCorrect: attempt.scoredCorrect,
        scoredIncorrect: attempt.scoredIncorrect,
        unscoredCorrect: attempt.unscoredCorrect,
        unscoredIncorrect: attempt.unscoredIncorrect,
        totalCorrect: attempt.totalCorrect,
        scorePercentage: attempt.scorePercentage,
        proctoringClean: attempt.proctoringClean,
        violationCount: attempt.violationCount,
        terminationReason: attempt.terminationReason,
        proctorEvents: attempt.proctorEvents,
      },
      summary: scoreSummary,
      questions: questionEvaluations,
    });
  } catch (error: any) {
    console.error('Error fetching exam result:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch exam result' },
      { status: 500 }
    );
  }
}
