import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scoreExamAttempt, evaluateAnswer } from '@/lib/scoring-engine';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { attemptId, autoSubmitted = false } = body;

    if (!attemptId) {
      return NextResponse.json({ success: false, error: 'attemptId is required' }, { status: 400 });
    }

    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
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

    if (attempt.status === 'SUBMITTED' || attempt.status === 'AUTO_SUBMITTED') {
      return NextResponse.json({
        success: true,
        alreadySubmitted: true,
        attemptId: attempt.id,
      });
    }

    // Process questions and compute correctness
    const questionEvaluations = attempt.questions.map((aq) => {
      const orderIds: string[] = aq.optionsOrder ? JSON.parse(aq.optionsOrder) : [];
      
      // Map ordered options to UI labels A, B, C, D...
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

      // Find the labels of correct options
      const correctLabels = orderedOptions
        .filter((o) => o.isCorrect)
        .map((o) => o.label);

      // Selected options by candidate
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
        isScored: aq.isScored,
        options: orderedOptions,
        correctAnswers: correctLabels,
        selectedOptions: selectedLabels,
        isCorrect,
      };
    });

    // Score using scoring engine
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

    const now = new Date();
    const timeSpentSeconds = Math.max(
      0,
      Math.floor((now.getTime() - attempt.startedAt.getTime()) / 1000)
    );

    // Update individual attempt questions
    for (const q of questionEvaluations) {
      await prisma.attemptQuestion.update({
        where: { id: q.aqId },
        data: { isCorrect: q.isCorrect },
      });
    }

    // Update ExamAttempt record
    const updatedAttempt = await prisma.examAttempt.update({
      where: { id: attemptId },
      data: {
        status: autoSubmitted ? 'AUTO_SUBMITTED' : 'SUBMITTED',
        submittedAt: now,
        timeSpentSeconds,
        scoredCorrect: scoreSummary.scoredCorrect,
        scoredIncorrect: scoreSummary.scoredIncorrect,
        unscoredCorrect: scoreSummary.unscoredCorrect,
        unscoredIncorrect: scoreSummary.unscoredIncorrect,
        totalCorrect: scoreSummary.totalCorrect,
        passed: scoreSummary.passed,
        scorePercentage: scoreSummary.scoredAccuracyPercent,
      },
    });

    return NextResponse.json({
      success: true,
      attemptId: updatedAttempt.id,
      mode: updatedAttempt.mode,
      status: updatedAttempt.status,
      passed: updatedAttempt.passed,
      scoredCorrect: updatedAttempt.scoredCorrect,
      scoredIncorrect: updatedAttempt.scoredIncorrect,
      unscoredCorrect: updatedAttempt.unscoredCorrect,
      unscoredIncorrect: updatedAttempt.unscoredIncorrect,
      totalCorrect: updatedAttempt.totalCorrect,
      scorePercentage: updatedAttempt.scorePercentage,
      timeSpentSeconds: updatedAttempt.timeSpentSeconds,
      summary: scoreSummary,
      questions: questionEvaluations,
    });
  } catch (error: any) {
    console.error('Error submitting exam:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit exam' },
      { status: 500 }
    );
  }
}
