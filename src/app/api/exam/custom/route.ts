import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper to shuffle an array (Fisher-Yates)
function shuffleArray<T>(array: T[], rng: () => number = Math.random): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const modulePrefixes: string[] = body.modulePrefixes || [];
    const numQuestions: number = body.numQuestions || 10;
    const userId = body.userId || 'candidate_default';
    const mode = 'CUSTOM_QUIZ';

    if (!modulePrefixes.length) {
      return NextResponse.json({ success: false, error: 'At least one module must be selected.' }, { status: 400 });
    }

    // 1. Fetch questions that belong to ANY of the selected modules
    // Since sourceModule might have suffixes (e.g. "Module 1 - Introduction"), 
    // we use a combination of startsWith for each prefix.
    const orConditions = modulePrefixes.map(prefix => ({
      sourceModule: {
        startsWith: prefix
      }
    }));

    const pool = await prisma.question.findMany({
      where: {
        OR: orConditions,
        status: 'active',
      },
      include: { options: true },
    });

    if (pool.length === 0) {
      return NextResponse.json({ success: false, error: 'No questions found for the selected modules.' }, { status: 404 });
    }

    // 2. Pick and shuffle up to numQuestions
    const rng = Math.random;
    const shuffledPool = shuffleArray(pool, rng);
    const selectedQuestions = shuffledPool.slice(0, numQuestions);
    const actualTotal = selectedQuestions.length;

    // 3. Determine exam duration (2 minutes per question standard for practice)
    const now = new Date();
    const durationMinutes = actualTotal * 2;
    const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);

    // 4. Create ExamAttempt in database
    const attempt = await prisma.examAttempt.create({
      data: {
        userId,
        mode,
        status: 'IN_PROGRESS',
        startedAt: now,
        expiresAt,
        totalQuestions: actualTotal,
        scoredQuestions: actualTotal,
        unscoredQuestions: 0,
        questions: {
          create: selectedQuestions.map((q, index) => {
            const shuffledOptions = shuffleArray(q.options as any[]);
            return {
              position: index + 1,
              questionId: q.id,
              isScored: true, // all scored in custom quiz
              isFlagged: false,
              optionsOrder: JSON.stringify(shuffledOptions.map((o: any) => o.id)),
            };
          }),
        },
      },
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

    // 5. Format response for candidate: HIDE isCorrect, HIDE isScored, HIDE explanation
    const candidateQuestions = attempt.questions.map((aq) => {
      const orderIds: string[] = aq.optionsOrder ? JSON.parse(aq.optionsOrder) : [];
      const orderedOptions = orderIds
        .map((optId, idx) => {
          const opt = aq.question.options.find((o) => o.id === optId);
          if (!opt) return null;
          const uiLabel = String.fromCharCode(65 + idx);
          return {
            id: opt.id,
            label: uiLabel,
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
        selectedOptions: null,
        isFlagged: false,
      };
    });

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      mode: attempt.mode,
      startedAt: attempt.startedAt,
      expiresAt: attempt.expiresAt,
      durationMinutes,
      totalQuestions: actualTotal,
      questions: candidateQuestions,
    });
  } catch (error: any) {
    console.error('Error starting custom quiz:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to start custom quiz' },
      { status: 500 }
    );
  }
}
