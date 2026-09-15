import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'candidate_default';

    // Get today's UTC date string YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    // Get offset from SystemSettings
    const offsetSetting = await prisma.systemSetting.findUnique({ where: { key: 'daily_seed_offset' } });
    const offset = offsetSetting ? parseInt(offsetSetting.value, 10) : 0;

    // Compute simple hash from date + userId + offset to seed selection
    const seedString = `${today}-${userId}-${offset}`;
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      hash = (hash << 5) - hash + seedString.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);

    // Fetch all active question IDs, partitioned by sourceType
    const allQuestions = await prisma.question.findMany({
      where: { status: 'active' },
      select: { id: true, sourceType: true },
      orderBy: { id: 'asc' },
    });

    const scenarioQuestions = allQuestions.filter(q => q.sourceType === 'scenario_based');
    const normalQuestions = allQuestions.filter(q => q.sourceType !== 'scenario_based');

    const selectedIds: string[] = [];

    // Helper to pick deterministically
    const pickQuestions = (pool: any[], count: number, hashSeed: number) => {
      if (pool.length === 0) return;
      for (let i = 0; i < count; i++) {
        const idx = (hashSeed + i * 37) % pool.length;
        selectedIds.push(pool[idx].id);
      }
    };

    // Pick 5 scenario and 5 normal
    pickQuestions(scenarioQuestions, 5, seed);
    pickQuestions(normalQuestions, 5, seed + 100); // Use a slightly different seed so it doesn't just mirror indices

    const questions = await prisma.question.findMany({
      where: { id: { in: selectedIds } },
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
