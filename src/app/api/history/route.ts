import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'candidate_default';

    const attempts = await prisma.examAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        mode: true,
        status: true,
        startedAt: true,
        submittedAt: true,
        passed: true,
        scoredCorrect: true,
        scoredQuestions: true,
        scorePercentage: true,
        timeSpentSeconds: true,
        violationCount: true,
        proctoringClean: true,
      },
    });

    const totalAttempts = attempts.length;
    const passedAttempts = attempts.filter((a) => a.passed).length;
    const averageScore = totalAttempts > 0
      ? (attempts.reduce((sum, a) => sum + a.scorePercentage, 0) / totalAttempts).toFixed(1)
      : '0.0';

    return NextResponse.json({
      success: true,
      stats: {
        totalAttempts,
        passedAttempts,
        passRate: totalAttempts > 0 ? ((passedAttempts / totalAttempts) * 100).toFixed(1) : '0.0',
        averageScore,
      },
      attempts,
    });
  } catch (error: any) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
