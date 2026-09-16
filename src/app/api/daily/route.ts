import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawUserId = searchParams.get('userId');
    const userId = rawUserId && rawUserId.trim() !== '' ? rawUserId.trim() : 'candidate_default';

    // Today's UTC date string YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    // Get offset from SystemSettings if admin triggered reshuffle
    const offsetSetting = await prisma.systemSetting.findUnique({ where: { key: 'daily_seed_offset' } });
    const offset = offsetSetting ? parseInt(offsetSetting.value, 10) : 0;

    // High-entropy SHA-256 seed derived from (today + userId + offset)
    const seedInput = `${today}:${userId.toLowerCase()}:${offset}`;
    const hash = crypto.createHash('sha256').update(seedInput).digest();
    const seed = hash.readUInt32BE(0);
    const rng = mulberry32(seed);

    // Fetch all active question IDs partitioned by sourceType
    const allQuestions = await prisma.question.findMany({
      where: { status: 'active' },
      select: { id: true, sourceType: true },
      orderBy: { id: 'asc' },
    });

    const scenarioQuestions = allQuestions.filter((q) => q.sourceType === 'scenario_based');
    const normalQuestions = allQuestions.filter((q) => q.sourceType !== 'scenario_based');

    const selectedIds = new Set<string>();

    // Helper to pick unique questions without duplicates
    const pickUnique = (pool: any[], count: number) => {
      if (pool.length === 0) return;
      let attempts = 0;
      while (selectedIds.size < count && attempts < pool.length * 3) {
        const idx = Math.floor(rng() * pool.length);
        selectedIds.add(pool[idx].id);
        attempts++;
      }
    };

    // Pick 5 scenario questions + 5 normal questions
    pickUnique(scenarioQuestions, 5);
    const targetTotal = selectedIds.size + 5;
    pickUnique(normalQuestions, targetTotal);

    const questions = await prisma.question.findMany({
      where: { id: { in: Array.from(selectedIds) } },
      include: {
        options: {
          orderBy: { label: 'asc' },
        },
      },
    });

    // Check if user has completed today's challenge
    const todayAttempt = await prisma.examAttempt.findFirst({
      where: {
        userId,
        mode: 'DAILY_CHALLENGE',
        status: { in: ['SUBMITTED', 'AUTO_SUBMITTED'] },
        createdAt: {
          gte: new Date(`${today}T00:00:00.000Z`),
        },
      },
    });

    // Calculate streak
    const dailyAttempts = await prisma.examAttempt.findMany({
      where: {
        userId,
        mode: 'DAILY_CHALLENGE',
        status: { in: ['SUBMITTED', 'AUTO_SUBMITTED'] },
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    const completedDates = new Set(
      dailyAttempts.map((a) => a.createdAt.toISOString().split('T')[0])
    );

    let streak = 0;
    let checkDate = new Date();
    // If not completed today, start checking from yesterday for active streak
    if (!completedDates.has(today)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dStr = checkDate.toISOString().split('T')[0];
      if (completedDates.has(dStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return NextResponse.json({
      success: true,
      today,
      streak,
      alreadyCompletedToday: Boolean(todayAttempt),
      todayScore: todayAttempt ? todayAttempt.totalCorrect : null,
      questions,
    });
  } catch (error: any) {
    console.error('Error fetching daily challenge:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch daily challenge' },
      { status: 500 }
    );
  }
}

// Record daily completion to preserve streak
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, totalCorrect, totalQuestions } = body;

    const user = userId && userId.trim() !== '' ? userId.trim() : 'candidate_default';
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Check if already completed today
    const existing = await prisma.examAttempt.findFirst({
      where: {
        userId: user,
        mode: 'DAILY_CHALLENGE',
        createdAt: {
          gte: new Date(`${today}T00:00:00.000Z`),
        },
      },
    });

    if (existing) {
      return NextResponse.json({ success: true, message: 'Already recorded today' });
    }

    await prisma.examAttempt.create({
      data: {
        userId: user,
        mode: 'DAILY_CHALLENGE',
        status: 'SUBMITTED',
        startedAt: now,
        submittedAt: now,
        expiresAt: now,
        totalQuestions: totalQuestions || 10,
        scoredQuestions: totalQuestions || 10,
        unscoredQuestions: 0,
        totalCorrect: totalCorrect || 0,
        scoredCorrect: totalCorrect || 0,
        unscoredCorrect: 0,
        scorePercentage: Math.round(((totalCorrect || 0) / (totalQuestions || 10)) * 100),
        passed: (totalCorrect || 0) >= 7,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error recording daily challenge:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
