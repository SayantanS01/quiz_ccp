import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mulberry32 PRNG
function mulberry32(a: number) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

// Helper to shuffle an array (Fisher-Yates) with optional PRNG
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
    const mode = body.mode || 'FULL_MOCK';
    const userId = body.userId || 'candidate_default';

    // 1. Fetch questions based on mode
    let targetD1 = 16;
    let targetD2 = 19;
    let targetD3 = 22;
    let targetD4 = 8;

    if (mode === 'SECURITY_CHALLENGE') {
      targetD1 = 8;
      targetD2 = 35;
      targetD3 = 16;
      targetD4 = 6;
    } else if (mode === 'TECH_DEEP_DIVE') {
      targetD1 = 8;
      targetD2 = 12;
      targetD3 = 39;
      targetD4 = 6;
    } else if (mode === 'BILLING_SPECIALIST') {
      targetD1 = 10;
      targetD2 = 12;
      targetD3 = 15;
      targetD4 = 28;
    } else if (mode === 'FOUNDATION') {
      targetD1 = 30;
      targetD2 = 15;
      targetD3 = 12;
      targetD4 = 8;
    }

    // Fetch active questions by domain
    const [d1Pool, d2Pool, d3Pool, d4Pool] = await Promise.all([
      prisma.question.findMany({
        where: { domainId: 1, status: 'active' },
        include: { options: true },
      }),
      prisma.question.findMany({
        where: { domainId: 2, status: 'active' },
        include: { options: true },
      }),
      prisma.question.findMany({
        where: { domainId: 3, status: 'active' },
        include: { options: true },
      }),
      prisma.question.findMany({
        where: { domainId: 4, status: 'active' },
        include: { options: true },
      }),
    ]);

    // Setup PRNG
    let rng = Math.random;

    // Helper to sample with single/multi select balancing
    function sampleDomain(pool: any[], targetCount: number) {
      const single = shuffleArray(pool.filter(q => q.type === 'SINGLE_SELECT'), rng);
      const multi = shuffleArray(pool.filter(q => q.type === 'MULTI_SELECT'), rng);
      
      const targetMulti = Math.max(1, Math.round(targetCount * 0.22));
      const targetSingle = targetCount - targetMulti;

      const pickedMulti = multi.slice(0, targetMulti);
      const pickedSingle = single.slice(0, targetSingle);
      let combined = [...pickedSingle, ...pickedMulti];

      if (combined.length < targetCount) {
        const remaining = pool.filter(q => !combined.some(c => c.id === q.id));
        combined.push(...shuffleArray(remaining, rng).slice(0, targetCount - combined.length));
      }
      return combined.slice(0, targetCount);
    }

    // Pick balanced questions from each domain
    const pickedD1 = sampleDomain(d1Pool, targetD1);
    const pickedD2 = sampleDomain(d2Pool, targetD2);
    const pickedD3 = sampleDomain(d3Pool, targetD3);
    const pickedD4 = sampleDomain(d4Pool, targetD4);

    let selectedQuestions = [...pickedD1, ...pickedD2, ...pickedD3, ...pickedD4];

    // Ensure we have exactly 65 questions
    if (selectedQuestions.length < 65) {
      const allPool = shuffleArray([...d1Pool, ...d2Pool, ...d3Pool, ...d4Pool], rng);
      for (const q of allPool) {
        if (!selectedQuestions.find((sq) => sq.id === q.id)) {
          selectedQuestions.push(q);
          if (selectedQuestions.length === 65) break;
        }
      }
    } else if (selectedQuestions.length > 65) {
      selectedQuestions = selectedQuestions.slice(0, 65);
    }

    // 2. Randomly designate 50 scored and 15 unscored
    // Create an array of 65 booleans: 50 true, 15 false, then shuffle
    const scoredDesignations = shuffleArray([
      ...Array(50).fill(true),
      ...Array(15).fill(false),
    ], rng);

    // 3. Shuffle question order
    const shuffledQuestions = shuffleArray(selectedQuestions, rng);

    // 4. Determine exam duration (90 minutes standard)
    const now = new Date();
    const durationMinutes = 90;
    const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);

    // 5. Create ExamAttempt in database
    const attempt = await prisma.examAttempt.create({
      data: {
        userId,
        mode,
        status: 'IN_PROGRESS',
        startedAt: now,
        expiresAt,
        totalQuestions: 65,
        scoredQuestions: 50,
        unscoredQuestions: 15,
        questions: {
          create: shuffledQuestions.map((q, index) => {
            const isScored = scoredDesignations[index];
            const shuffledOptions = shuffleArray(q.options as any[]);
            return {
              position: index + 1,
              questionId: q.id,
              isScored,
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

    // 6. Format response for candidate: HIDE isCorrect, HIDE isScored, HIDE explanation
    const candidateQuestions = attempt.questions.map((aq) => {
      const orderIds: string[] = aq.optionsOrder ? JSON.parse(aq.optionsOrder) : [];
      // Re-order options according to optionsOrder
      const orderedOptions = orderIds
        .map((optId, idx) => {
          const opt = aq.question.options.find((o) => o.id === optId);
          if (!opt) return null;
          // Assign standardized label A, B, C, D in UI order
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
      totalQuestions: 65,
      questions: candidateQuestions,
    });
  } catch (error: any) {
    console.error('Error starting exam:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to start exam' },
      { status: 500 }
    );
  }
}
