import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to PostgreSQL to seed database...');
  
  const bankPath = path.join(process.cwd(), 'public', 'data', 'question_bank.json');
  if (!fs.existsSync(bankPath)) {
    console.error('Error: question_bank.json not found in public/data/');
    process.exit(1);
  }

  const rawData = fs.readFileSync(bankPath, 'utf8');
  const bank = JSON.parse(rawData);
  const questions = Array.isArray(bank) ? bank : bank.questions;

  console.log(`Loaded ${questions.length} questions from question_bank.json`);
  console.log('Clearing existing data...');
  
  // Clean up existing
  await prisma.proctorEvent.deleteMany({});
  await prisma.attemptQuestion.deleteMany({});
  await prisma.examAttempt.deleteMany({});
  await prisma.questionOption.deleteMany({});
  await prisma.question.deleteMany({});

  console.log('Seeding Questions...');
  
  let count = 0;
  for (const q of questions) {
    await prisma.question.create({
      data: {
        id: q.id,
        questionCode: q.questionCode,
        questionText: q.questionText,
        type: q.type,
        requiredSelections: q.requiredSelections || 1,
        domain: q.domain,
        domainId: q.domain === 'Cloud Concepts' ? 1 : 
                  q.domain === 'Security and Compliance' ? 2 : 
                  q.domain === 'Cloud Technology and Services' ? 3 : 4,
        topic: q.topic || 'General',
        difficulty: q.difficulty || 'MEDIUM',
        explanation: q.explanation || 'No explanation provided.',
        tags: JSON.stringify([]),
        sourceModule: q.sourceModule || '',
        source: q.source || 'Imported',
        sourceType: q.sourceType || 'json',
        status: 'active',
        options: {
          create: q.options.map((opt: any) => ({
            id: opt.id,
            label: opt.label,
            text: opt.text,
            isCorrect: opt.isCorrect
          }))
        }
      }
    });
    count++;
    if (count % 50 === 0) console.log(`Seeded ${count}/${questions.length}...`);
  }

  console.log(`\nSuccessfully seeded ${count} questions to Postgres!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
