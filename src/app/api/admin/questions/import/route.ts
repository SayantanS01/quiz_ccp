import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateQuestion } from '@/lib/question-validator';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const questions = Array.isArray(data) ? data : (data.questions || []);

    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No questions provided in the JSON payload.' },
        { status: 400 }
      );
    }

    let successCount = 0;
    let skipCount = 0;
    const errors: string[] = [];

    for (const q of questions) {
      try {
        // Basic validation
        if (!q.questionCode || !q.questionText || !q.options || q.options.length < 2) {
          throw new Error('Missing required fields or insufficient options.');
        }

        // Check if question already exists
        const existing = await prisma.question.findUnique({
          where: { questionCode: q.questionCode }
        });

        if (existing) {
          skipCount++;
          continue;
        }

        // Map the string domain back to domainId if not provided
        let domainId = q.domainId || 1;
        if (!q.domainId && q.domain) {
          if (q.domain.includes('Cloud Concepts')) domainId = 1;
          else if (q.domain.includes('Security')) domainId = 2;
          else if (q.domain.includes('Technology')) domainId = 3;
          else if (q.domain.includes('Billing')) domainId = 4;
        }

        await prisma.question.create({
          data: {
            questionCode: q.questionCode,
            questionText: q.questionText,
            type: q.type || 'SINGLE_SELECT',
            requiredSelections: q.requiredSelections || 1,
            domain: q.domain || 'Cloud Concepts',
            domainId: domainId,
            topic: q.topic || 'General',
            difficulty: q.difficulty || 'MEDIUM',
            explanation: q.explanation || 'No explanation provided.',
            tags: q.tags || '[]',
            sourceModule: q.sourceModule || 'Imported via Admin',
            options: {
              create: q.options.map((opt: any) => ({
                label: opt.label || 'X',
                text: opt.text,
                isCorrect: opt.isCorrect === true,
                explanation: opt.explanation || null
              }))
            }
          }
        });
        successCount++;
      } catch (err: any) {
        errors.push(`Row ${q.questionCode || 'Unknown'}: ${err.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import complete. Imported ${successCount} questions. Skipped ${skipCount} duplicates.`,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process JSON upload' },
      { status: 500 }
    );
  }
}
