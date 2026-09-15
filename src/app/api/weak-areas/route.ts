import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { evaluateAnswer } from '@/lib/scoring-engine';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });
    }

    const mistakes = await prisma.userMistake.findMany({
      where: { userId },
      orderBy: { mistakeCount: 'desc' },
      include: {
        question: {
          include: {
            options: true,
          }
        }
      }
    });

    return NextResponse.json({ success: true, mistakes });
  } catch (error: any) {
    console.error('Fetch weak areas error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, questionId, selectedOptions } = body;

    if (!userId || !questionId || !selectedOptions) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch the question to evaluate
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { options: true }
    });

    if (!question) {
      return NextResponse.json({ success: false, error: 'Question not found' }, { status: 404 });
    }

    // Get correct labels
    const correctLabels = question.options
      .filter(o => o.isCorrect)
      .map(o => o.label);

    const isCorrect = evaluateAnswer(question.type, correctLabels, selectedOptions);

    if (isCorrect) {
      // Remove from mistakes if they learned it!
      await prisma.userMistake.delete({
        where: {
          userId_questionId: {
            userId,
            questionId
          }
        }
      }).catch(() => {}); // ignore if it was already deleted
    }

    return NextResponse.json({
      success: true,
      isCorrect,
      explanation: question.explanation,
      correctAnswers: correctLabels
    });
  } catch (error: any) {
    console.error('Verify concept error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
