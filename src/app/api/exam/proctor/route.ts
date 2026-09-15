import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { attemptId, eventType, severity = 'WARNING', metadata, durationSeconds } = body;

    if (!attemptId || !eventType) {
      return NextResponse.json({ success: false, error: 'attemptId and eventType are required' }, { status: 400 });
    }

    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      return NextResponse.json({ success: false, error: 'Attempt not found' }, { status: 404 });
    }

    // Log the proctor event
    await prisma.proctorEvent.create({
      data: {
        attemptId,
        eventType,
        severity,
        durationSeconds: durationSeconds || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    // Increment violation count
    const newViolationCount = attempt.violationCount + 1;
    let shouldTerminate = false;
    let newStatus = attempt.status;
    let terminationReason = attempt.terminationReason;

    // Fetch threshold setting
    const thresholdSetting = await prisma.systemSetting.findUnique({
      where: { key: 'proctoring_warning_threshold' },
    });
    const threshold = thresholdSetting ? parseInt(thresholdSetting.value, 10) : 3;

    if (newViolationCount >= threshold) {
      shouldTerminate = true;
      newStatus = 'TERMINATED';
      terminationReason = `Exam terminated: Exceeded maximum allowed proctoring violations (${newViolationCount} / ${threshold}).`;
    }

    await prisma.examAttempt.update({
      where: { id: attemptId },
      data: {
        violationCount: newViolationCount,
        proctoringClean: false,
        status: newStatus,
        terminationReason,
      },
    });

    return NextResponse.json({
      success: true,
      violationCount: newViolationCount,
      warningLevel: Math.min(newViolationCount, 3),
      isTerminated: shouldTerminate,
      terminationReason,
    });
  } catch (error: any) {
    console.error('Error logging proctor event:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to record proctor event' },
      { status: 500 }
    );
  }
}
