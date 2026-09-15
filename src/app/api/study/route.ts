import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { evaluateAnswer } from '@/lib/scoring-engine';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const domainId = searchParams.get('domainId');
    const difficulty = searchParams.get('difficulty');
    const topic = searchParams.get('topic');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const where: any = { status: 'active' };
    if (domainId) where.domainId = parseInt(domainId, 10);
    if (difficulty) where.difficulty = difficulty.toUpperCase();
    if (topic) where.topic = topic;
    if (search) {
      where.OR = [
        { questionText: { contains: search } },
        { questionCode: { contains: search } },
        { topic: { contains: search } },
      ];
    }

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        include: {
          options: {
            orderBy: { label: 'asc' },
          },
        },
        skip: offset,
        take: limit,
        orderBy: { questionCode: 'asc' },
      }),
      prisma.question.count({ where }),
    ]);

    // Also get distinct topics and domains for filter dropdowns
    const topics = await prisma.question.findMany({
      where: { status: 'active' },
      select: { topic: true, domain: true, domainId: true },
      distinct: ['topic'],
    });

    return NextResponse.json({
      success: true,
      total,
      questions,
      filterOptions: {
        topics,
        difficulties: ['EASY', 'MEDIUM', 'HARD'],
        domains: [
          { id: 1, name: 'Cloud Concepts' },
          { id: 2, name: 'Security and Compliance' },
          { id: 3, name: 'Cloud Technology and Services' },
          { id: 4, name: 'Billing, Pricing and Support' },
        ],
      },
    });
  } catch (error: any) {
    console.error('Error fetching study questions:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch study questions' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { questionId, selectedOptions } = body;

    if (!questionId || !selectedOptions) {
      return NextResponse.json(
        { success: false, error: 'questionId and selectedOptions are required' },
        { status: 400 }
      );
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { options: true },
    });

    if (!question) {
      return NextResponse.json({ success: false, error: 'Question not found' }, { status: 404 });
    }

    const correctLabels = question.options
      .filter((o) => o.isCorrect)
      .map((o) => o.label);

    const isCorrect = evaluateAnswer(question.type, correctLabels, selectedOptions);

    return NextResponse.json({
      success: true,
      isCorrect,
      correctAnswers: correctLabels,
      explanation: question.explanation,
    });
  } catch (error: any) {
    console.error('Error verifying study question:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to verify answer' },
      { status: 500 }
    );
  }
}
