import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'candidate_default';

    // 1. Fetch past submitted attempts for candidate
    const pastAttempts = await prisma.examAttempt.findMany({
      where: {
        userId,
        status: { in: ['SUBMITTED', 'AUTO_SUBMITTED'] },
      },
      include: {
        questions: {
          include: {
            question: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const topicStats: Record<string, { total: number; incorrect: number; domain: string }> = {};

    for (const attempt of pastAttempts) {
      for (const aq of attempt.questions) {
        const topic = aq.question.topic;
        const domain = aq.question.domain;
        if (!topicStats[topic]) {
          topicStats[topic] = { total: 0, incorrect: 0, domain };
        }
        topicStats[topic].total++;
        if (aq.isCorrect === false) {
          topicStats[topic].incorrect++;
        }
      }
    }

    // Rank topics by highest incorrect rate
    const rankedWeakTopics = Object.entries(topicStats)
      .map(([topic, stat]) => ({
        topic,
        domain: stat.domain,
        total: stat.total,
        incorrect: stat.incorrect,
        errorRate: stat.total > 0 ? (stat.incorrect / stat.total) * 100 : 0,
      }))
      .filter((t) => t.incorrect > 0)
      .sort((a, b) => b.errorRate - a.errorRate || b.incorrect - a.incorrect);

    let targetTopics = rankedWeakTopics.slice(0, 5).map((t) => t.topic);

    // If no past mistakes or no attempts yet, pick popular challenging topics
    if (targetTopics.length === 0) {
      targetTopics = [
        'Shared Responsibility Model',
        'IAM',
        'VPC',
        'S3 Storage Classes',
        'AWS Organizations',
        'AWS Support Plans',
        'EC2 Pricing',
      ];
    }

    // Fetch 15 questions from these topics
    const questions = await prisma.question.findMany({
      where: {
        status: 'active',
        topic: { in: targetTopics },
      },
      include: {
        options: {
          orderBy: { label: 'asc' },
        },
      },
      take: 15,
    });

    return NextResponse.json({
      success: true,
      hasHistory: pastAttempts.length > 0,
      weakTopics: rankedWeakTopics,
      targetedTopics: targetTopics,
      questions,
    });
  } catch (error: any) {
    console.error('Error fetching weak areas:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch weak areas' },
      { status: 500 }
    );
  }
}
