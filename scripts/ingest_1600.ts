import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to PostgreSQL to seed database with ~1600 questions...');
  
  const questionSetDir = path.join(process.cwd(), 'question_set');
  if (!fs.existsSync(questionSetDir)) {
    console.error('Error: question_set directory not found');
    process.exit(1);
  }

  const files = fs.readdirSync(questionSetDir).filter(f => f.endsWith('.json'));
  
  console.log('Fetching existing questions to avoid duplicates...');
  const existingQuestions = await prisma.question.findMany({ select: { questionCode: true } });
  const existingSet = new Set(existingQuestions.map(q => q.questionCode));

  let count = 0;
  let skipped = 0;

  for (const file of files) {
    if (file === 'cloudprep_question_bank_manifest.json') continue;
    
    const filePath = path.join(questionSetDir, file);
    const rawData = fs.readFileSync(filePath, 'utf8');
    const bank = JSON.parse(rawData);
    const questions = Array.isArray(bank) ? bank : bank.questions;

    if (!questions) {
        console.log(`No questions array found in ${file}`);
        continue;
    }

    console.log(`Processing ${file} (${questions.length} questions)...`);

    const insertPromises = [];
    for (const q of questions) {
      if (existingSet.has(q.id)) {
        skipped++;
        continue;
      }

      let type = q.type === 'single_select' ? 'SINGLE_SELECT' : 'MULTI_SELECT';
      if (!q.type && q.correct_answers) {
          type = q.correct_answers.length > 1 ? 'MULTI_SELECT' : 'SINGLE_SELECT';
      }

      let requiredSelections = 1;
      if (q.correct_answers) {
          requiredSelections = q.correct_answers.length;
      } else if (q.requiredSelections) {
          requiredSelections = q.requiredSelections;
      }

      let domainId = 1;
      const d = q.domain || '';
      if (d.includes('Security') || d.includes('Compliance')) domainId = 2;
      else if (d.includes('Technology')) domainId = 3;
      else if (d.includes('Billing') || d.includes('Pricing')) domainId = 4;

      const sourceType = q.source_type === 'scenario_based' || q.scenario_based ? 'scenario_based' : 'normal';

      insertPromises.push(
        prisma.question.create({
          data: {
            id: q.id,
            questionCode: q.id,
            questionText: q.question,
            type: type,
            requiredSelections: requiredSelections,
            domain: d || 'General',
            domainId: domainId,
            topic: q.topic || 'General',
            difficulty: (q.difficulty || 'MEDIUM').toUpperCase(),
            explanation: q.explanation || 'No explanation provided.',
            tags: JSON.stringify([]),
            sourceModule: q.source_module || '',
            source: file,
            sourceType: sourceType,
            status: 'active',
            options: {
              create: q.options.map((opt: any) => ({
                id: `${q.id}-${opt.id}`,
                label: opt.id,
                text: opt.text,
                isCorrect: q.correct_answers.includes(opt.id)
              }))
            }
          }
        }).catch(err => {
          console.error(`Error inserting ${q.id}:`, err.message);
        })
      );
      existingSet.add(q.id);
    }

    // Process in batches of 5 to prevent Prisma connection pool timeouts (limit 13)
    for (let i = 0; i < insertPromises.length; i += 5) {
      const batch = insertPromises.slice(i, i + 5);
      await Promise.all(batch);
      count += batch.length;
    }
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
