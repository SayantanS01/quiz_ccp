import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request) {
  try {
    const { userId, action = 'delete' } = await req.json();

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    // First check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      // 1. Delete all UserMistakes for this user
      await tx.userMistake.deleteMany({
        where: { userId }
      });

      // 2. Fetch all attempts by this user to delete associated nested records
      const userAttempts = await tx.examAttempt.findMany({
        where: { userId },
        select: { id: true }
      });
      const attemptIds = userAttempts.map((a) => a.id);
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

      // 4. Finally, delete the User record ONLY if action is 'delete'
      if (action === 'delete') {
        await tx.user.delete({
          where: { id: userId }
        });
      }
    });

    const message = action === 'delete' 
      ? 'User and all associated data successfully deleted.' 
      : 'User progress successfully reset.';
      
    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete user' }, { status: 500 });
  }
}
