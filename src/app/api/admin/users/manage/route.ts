import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    // First check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        attempts: true
      }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Use a transaction to safely delete all related data in cascade
    // Prisma will delete AttemptQuestions because ExamAttempt deletes cascade
    // UserMistakes must be deleted as well.
    // ProctorEvents should also be deleted via ExamAttempt cascade
    await prisma.$transaction(async (tx) => {
      // 1. Delete all UserMistakes for this user
      await tx.userMistake.deleteMany({
        where: { userId }
      });

      // 2. Delete all AttemptQuestions for all attempts by this user
      const attemptIds = user.attempts.map((a) => a.id);
      if (attemptIds.length > 0) {
        await tx.attemptQuestion.deleteMany({
          where: {
            attemptId: { in: attemptIds }
          }
        });
        
        await tx.proctorEvent.deleteMany({
          where: {
            attemptId: { in: attemptIds }
          }
        });
      }

      // 3. Delete all ExamAttempts
      await tx.examAttempt.deleteMany({
        where: { userId }
      });

      // 4. Finally, delete the User record
      await tx.user.delete({
        where: { id: userId }
      });
    });

    return NextResponse.json({ success: true, message: 'User and all associated data successfully deleted.' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete user' }, { status: 500 });
  }
}
