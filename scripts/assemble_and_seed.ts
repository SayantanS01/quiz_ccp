import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { validateQuestion, QuestionInput } from '../src/lib/question-validator';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting CloudPrep Master Question Bank & Database Seeding...');

  const questionsFilePath = path.join(__dirname, '..', 'prisma', 'questions_650.json');
  if (!fs.existsSync(questionsFilePath)) {
    throw new Error(`Questions file not found at ${questionsFilePath}`);
  }

  const rawData = fs.readFileSync(questionsFilePath, 'utf-8');
  const questions: (QuestionInput & { id?: string })[] = JSON.parse(rawData);

  console.log(`📦 Loaded ${questions.length} questions from JSON.`);
  if (questions.length !== 650) {
    throw new Error(`Expected exactly 650 questions, found ${questions.length}!`);
  }

  // 1. Validate all questions against the 12-point engine
  console.log('🔍 Executing 12-point Question Validation Engine on all 650 items...');
  const seenTexts = new Set<string>();
  let validationErrors = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const res = validateQuestion(q, seenTexts);
    seenTexts.add(q.questionText.trim().toLowerCase());

    if (!res.valid) {
      console.error(`❌ Validation failed for [${q.questionCode}]:`, res.errors);
      validationErrors++;
    }
  }

  if (validationErrors > 0) {
    throw new Error(`Validation failed for ${validationErrors} questions! Aborting seed.`);
  }
  console.log('✅ All 650 questions passed the 12-point validation check with 0 errors!');

  // 2. Clear previous questions/attempts to ensure fresh state
  console.log('🧹 Purging existing question data for clean seed...');
  await prisma.attemptQuestion.deleteMany({});
  await prisma.proctorEvent.deleteMany({});
  await prisma.examAttempt.deleteMany({});
  await prisma.bookmark.deleteMany({});
  await prisma.questionOption.deleteMany({});
  await prisma.question.deleteMany({});

  // 3. Insert in transactional batches
  console.log('💾 Seeding 650 questions with options into SQLite...');
  const batchSize = 50;
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    for (const q of batch) {
      await prisma.question.create({
        data: {
          id: q.id || `cp-${q.questionCode.toLowerCase()}`,
          questionCode: q.questionCode,
          questionText: q.questionText,
          type: q.type,
          requiredSelections: q.requiredSelections,
          domain: q.domain,
          domainId: q.domainId,
          topic: q.topic,
          difficulty: q.difficulty,
          explanation: q.explanation,
          tags: JSON.stringify(q.tags),
          sourceModule: q.sourceModule,
          status: q.status || 'APPROVED',
          options: {
            create: q.options.map((opt) => ({
              label: opt.label,
              text: opt.text,
              isCorrect: opt.isCorrect,
            })),
          },
        },
      });
    }
    process.stdout.write(`   -> Seeded ${Math.min(i + batchSize, questions.length)} / ${questions.length} questions\r`);
  }
  console.log('\n✅ 650 questions seeded successfully!');

  // 4. Seed system settings
  console.log('⚙️ Initializing CloudPrep System Settings...');
  const settings = [
    { key: 'passing_scored_correct', value: '35', description: 'Passing threshold: minimum 35 scored questions correct out of 50' },
    { key: 'scored_question_count', value: '50', description: 'Number of scored questions in standard exam' },
    { key: 'unscored_question_count', value: '15', description: 'Number of unscored test questions in standard exam' },
    { key: 'total_question_count', value: '65', description: 'Total questions presented to candidate' },
    { key: 'exam_duration_minutes', value: '90', description: 'Standard examination time limit in minutes' },
    { key: 'proctoring_warning_threshold', value: '3', description: 'Number of warnings before auto-termination' },
    { key: 'proctoring_auto_terminate', value: 'true', description: 'Automatically terminate exam when violation threshold reached' },
  ];

  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description },
      create: s,
    });
  }
  console.log('✅ System settings seeded successfully!');

  // 5. Final summary
  const totalInDb = await prisma.question.count();
  const totalOptions = await prisma.questionOption.count();
  console.log(`\n🎉 Seed Complete! Summary:`);
  console.log(`   - Master Questions in DB: ${totalInDb}`);
  console.log(`   - Question Options in DB: ${totalOptions}`);
  console.log(`   - System Settings in DB: ${await prisma.systemSetting.count()}`);
}

main()
  .catch((e) => {
    console.error('Fatal error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
