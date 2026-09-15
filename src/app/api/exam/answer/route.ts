import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { attemptId, position, selectedOptions, isFlagged } = body;

    if (!attemptId || position === undefined) {
      return NextResponse.json({ success: false, error: 'attemptId and position are required' }, { status: 400 });
    }

    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      return NextResponse.json({ success: false, error: 'Attempt not found' }, { status: 404 });
    }

    if (attempt.status !== 'IN_PROGRESS') {
      return NextResponse.json({ success: false, error: `Exam is already ${attempt.status}` }, { status: 403 });
    }

    // Check expiration
    const now = new Date();
    if (attempt.expiresAt.getTime() < now.getTime()) {
      return NextResponse.json({ success: false, error: 'EXPIRED', message: 'Exam duration has elapsed' }, { status: 400 });
    }

    const updateData: any = {};
    if (selectedOptions !== undefined) {
      updateData.selectedOptions = selectedOptions ? JSON.stringify(selectedOptions) : null;
    }
    if (isFlagged !== undefined) {
      updateData.isFlagged = Boolean(isFlagged);
    }

    await prisma.attemptQuestion.update({
      where: {
        attemptId_position: {
          attemptId,
          position,
        },
      },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error saving answer:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to record answer' },
      { status: 500 }
    );
  }
}
