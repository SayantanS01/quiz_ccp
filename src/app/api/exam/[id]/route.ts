import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    const now = new Date();
    const remainingSeconds = Math.max(0, Math.floor((attempt.expiresAt.getTime() - now.getTime()) / 1000));
    const isExpired = remainingSeconds <= 0;

    // Build candidate questions (without answer keys)
    const candidateQuestions = attempt.questions.map((aq) => {
      const orderIds: string[] = aq.optionsOrder ? JSON.parse(aq.optionsOrder) : [];
      const orderedOptions = orderIds
        .map((optId, idx) => {
          const opt = aq.question.options.find((o) => o.id === optId);
          if (!opt) return null;
          return {
            id: opt.id,
            label: String.fromCharCode(65 + idx),
            text: opt.text,
          };
        })
        .filter(Boolean);

      return {
        position: aq.position,
        id: aq.id,
        questionCode: aq.question.questionCode,
        questionText: aq.question.questionText,
        type: aq.question.type,
        requiredSelections: aq.question.requiredSelections,
        domain: aq.question.domain,
        topic: aq.question.topic,
        difficulty: aq.question.difficulty,
        options: orderedOptions,
        selectedOptions: aq.selectedOptions ? JSON.parse(aq.selectedOptions) : null,
        isFlagged: aq.isFlagged,
      };
    });

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      mode: attempt.mode,
      status: attempt.status,
      startedAt: attempt.startedAt,
      expiresAt: attempt.expiresAt,
      remainingSeconds,
      isExpired,
      violationCount: attempt.violationCount,
      totalQuestions: attempt.totalQuestions,
      questions: candidateQuestions,
    });
  } catch (error: any) {
    console.error('Error fetching exam attempt:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch exam attempt' },
      { status: 500 }
    );
  }
}
