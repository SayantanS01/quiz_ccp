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
  console.log('Fetching existing questions to avoid duplicates...');
  const existingQuestions = await prisma.question.findMany({ select: { id: true } });
  const existingSet = new Set(existingQuestions.map(q => q.id));

  console.log('Seeding Questions...');
  
  let count = 0;
  let skipped = 0;
  for (const q of questions) {
    if (existingSet.has(q.id)) {
      skipped++;
      continue;
    }
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
    if (count % 50 === 0) console.log(`Seeded ${count} new questions...`);
  }

  console.log(`\nSuccessfully seeded ${count} new questions to Postgres! (Skipped ${skipped} existing questions)`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
