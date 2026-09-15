import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateQuestion, QuestionInput } from '@/lib/question-validator';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const domainId = searchParams.get('domainId');
    const difficulty = searchParams.get('difficulty');
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const sourceType = searchParams.get('sourceType');
    const exportJson = searchParams.get('export') === 'true';
    const limit = parseInt(searchParams.get('limit') || '25', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    const where: any = {};
    if (domainId) where.domainId = parseInt(domainId, 10);
    if (difficulty) where.difficulty = difficulty;
    if (status) where.status = status;
    if (source) where.source = source;
    if (sourceType) where.sourceType = sourceType;
    if (search) {
      where.OR = [
        { questionCode: { contains: search } },
        { questionText: { contains: search } },
        { topic: { contains: search } },
        { source: { contains: search } },
        { sourceModule: { contains: search } },
      ];
    }

    if (exportJson) {
      const allExport = await prisma.question.findMany({
        where,
        include: {
          options: {
            orderBy: { label: 'asc' },
          },
        },
        orderBy: { questionCode: 'asc' },
      });
      return NextResponse.json({ success: true, count: allExport.length, questions: allExport });
    }

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        include: {
          options: {
            orderBy: { label: 'asc' },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { questionCode: 'asc' },
      }),
      prisma.question.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      questions,
    });
  } catch (error: any) {
    console.error('Admin questions GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body: QuestionInput = await req.json();

    // 1. Check duplicate text in DB
    const existing = await prisma.question.findFirst({
      where: {
        questionText: { equals: body.questionText.trim() },
      },
    });

    const existingSet = new Set<string>();
    if (existing) {
      existingSet.add(body.questionText.trim().toLowerCase());
    }

    // 2. Validate using 12-point engine
    const validation = validateQuestion(body, existingSet);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 422 }
      );
    }

    // 3. Generate question code if not provided
    let questionCode = body.questionCode;
    if (!questionCode) {
      const count = await prisma.question.count();
      questionCode = `CP-${(count + 1).toString().padStart(3, '0')}`;
    }

    // 4. Save question and options
    const newQuestion = await prisma.question.create({
      data: {
        questionCode,
        questionText: body.questionText,
        type: body.type,
        requiredSelections: body.requiredSelections,
        domain: body.domain,
        domainId: body.domainId,
        topic: body.topic,
        difficulty: body.difficulty,
        explanation: body.explanation,
        tags: JSON.stringify(body.tags || []),
        sourceModule: body.sourceModule || 'Custom Admin Entry',
        source: (body as any).source || 'Admin Added',
        sourceType: (body as any).sourceType || 'admin',
        concept: (body as any).concept || null,
        status: body.status || 'active',
        options: {
          create: body.options.map((opt) => ({
            label: opt.label,
            text: opt.text,
            isCorrect: opt.isCorrect,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    return NextResponse.json({ success: true, question: newQuestion });
  } catch (error: any) {
    console.error('Admin question creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create question' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body: QuestionInput & { id: string } = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Question id is required' }, { status: 400 });
    }

    const validation = validateQuestion(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 422 }
      );
    }

    // Delete existing options and re-create them
    await prisma.questionOption.deleteMany({
      where: { questionId: body.id },
    });

    const updated = await prisma.question.update({
      where: { id: body.id },
      data: {
        questionCode: body.questionCode,
        questionText: body.questionText,
        type: body.type,
        requiredSelections: body.requiredSelections,
        domain: body.domain,
        domainId: body.domainId,
        topic: body.topic,
        difficulty: body.difficulty,
        explanation: body.explanation,
        tags: JSON.stringify(body.tags || []),
        sourceModule: body.sourceModule,
        source: (body as any).source || undefined,
        sourceType: (body as any).sourceType || undefined,
        concept: (body as any).concept || undefined,
        status: body.status || 'active',
        options: {
          create: body.options.map((opt) => ({
            label: opt.label,
            text: opt.text,
            isCorrect: opt.isCorrect,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    return NextResponse.json({ success: true, question: updated });
  } catch (error: any) {
    console.error('Admin question update error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update question' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Question id is required' }, { status: 400 });
    }

    await prisma.question.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Question deleted' });
  } catch (error: any) {
    console.error('Admin question delete error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete question' },
      { status: 500 }
    );
  }
}
