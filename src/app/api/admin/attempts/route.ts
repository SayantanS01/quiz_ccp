import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const attemptId = searchParams.get('id');

    if (attemptId) {
      const attempt = await prisma.examAttempt.findUnique({
        where: { id: attemptId },
        include: {
          proctorEvents: {
            orderBy: { timestamp: 'asc' },
          },
          questions: {
            include: {
              question: true,
            },
            orderBy: { position: 'asc' },
          },
        },
      });

      if (!attempt) {
        return NextResponse.json({ success: false, error: 'Attempt not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, attempt });
    }

    // List recent attempts
    const attempts = await prisma.examAttempt.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { proctorEvents: true },
        },
      },
    });

    // Summary statistics
    const totalAttempts = await prisma.examAttempt.count();
    const passedAttempts = await prisma.examAttempt.count({ where: { passed: true } });
    const terminatedAttempts = await prisma.examAttempt.count({ where: { status: 'TERMINATED' } });

    return NextResponse.json({
      success: true,
      stats: {
        totalAttempts,
        passedAttempts,
        passRate: totalAttempts > 0 ? ((passedAttempts / totalAttempts) * 100).toFixed(1) : '0.0',
        terminatedAttempts,
      },
      attempts,
    });
  } catch (error: any) {
    console.error('Admin attempts error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch attempts' },
      { status: 500 }
    );
  }
}
