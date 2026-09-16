import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE an attempt
export async function DELETE(req: Request) {
  try {
    const { attemptId } = await req.json();

    if (!attemptId) {
      return NextResponse.json({ success: false, error: 'Missing attemptId' }, { status: 400 });
    }

    // Delete related records first (cascade)
    await prisma.proctorEvent.deleteMany({ where: { attemptId } });
    await prisma.attemptQuestion.deleteMany({ where: { attemptId } });
    await prisma.examAttempt.deleteMany({ where: { id: attemptId } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete attempt error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST — reconnect (generate link) or reset (new exam)
export async function POST(req: Request) {
  try {
    const { attemptId, action } = await req.json();

    if (!attemptId || !action) {
      return NextResponse.json({ success: false, error: 'Missing attemptId or action' }, { status: 400 });
    }

    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      return NextResponse.json({ success: false, error: 'Attempt not found' }, { status: 404 });
    }

    if (action === 'reconnect') {
      // If the attempt is still in progress, return a session link
      if (attempt.status === 'SUBMITTED') {
        return NextResponse.json({ success: false, error: 'This attempt is already submitted. Cannot reconnect.' }, { status: 400 });
      }

      // Reset the attempt status to IN_PROGRESS if it was stuck at READY
      if (attempt.status === 'READY') {
        await prisma.examAttempt.update({
          where: { id: attemptId },
          data: { status: 'IN_PROGRESS' }
        });
      }

      const link = `/exam/session/${attemptId}`;
      return NextResponse.json({ success: true, link });
    }

    if (action === 'reset') {
      // Delete the old attempt and create a fresh one for the same user/mode
      const userId = attempt.userId;
      const mode = attempt.mode;

      // Clean up old attempt
      await prisma.proctorEvent.deleteMany({ where: { attemptId } });
      await prisma.attemptQuestion.deleteMany({ where: { attemptId } });
      await prisma.examAttempt.deleteMany({ where: { id: attemptId } });

      // Return the info needed to start a new exam
      return NextResponse.json({ 
        success: true, 
        action: 'reset',
        userId,
        mode,
        message: 'Old attempt deleted. User can start a new exam.'
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Attempt action error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
