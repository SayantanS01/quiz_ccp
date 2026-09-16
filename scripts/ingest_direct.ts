import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const files = [
    '/home/sayantan-axcess/Documents/Quiz_PROJ/question_set/cloudprep_extended_mixed_4x200/cloudprep_extended_mixed_set_01.json',
    '/home/sayantan-axcess/Documents/Quiz_PROJ/question_set/cloudprep_extended_mixed_4x200/cloudprep_extended_mixed_set_02.json',
    '/home/sayantan-axcess/Documents/Quiz_PROJ/question_set/cloudprep_extended_mixed_4x200/cloudprep_extended_mixed_set_03.json',
    '/home/sayantan-axcess/Documents/Quiz_PROJ/question_set/cloudprep_extended_mixed_4x200/cloudprep_extended_mixed_set_04.json'
  ];

  let totalImported = 0;
  let totalSkipped = 0;

  for (const file of files) {
    console.log(`\nReading ${file}...`);
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const questions = data.questions || [];

    for (const q of questions) {
      const qCode = q.id || q.questionCode;

      // Check existing
      const existing = await prisma.question.findUnique({
        where: { questionCode: qCode }
      });

      if (existing) {
        totalSkipped++;
        continue;
      }

      // Map domain
      let domainId = q.domain_id || 1;
      let domain = q.domain || "Cloud Concepts";
      if (!q.domain_id && q.domain) {
        if (q.domain.includes('Cloud Concepts')) domainId = 1;
        else if (q.domain.includes('Security')) domainId = 2;
        else if (q.domain.includes('Technology')) domainId = 3;
        else if (q.domain.includes('Billing')) domainId = 4;
      }

      // Map options
      let correctCount = 0;
      const mappedOptions = q.options.map((opt: any, idx: number) => {
        if (opt.isCorrect || opt.is_correct) correctCount++;
        return {
          label: opt.id || opt.label || String.fromCharCode(65 + idx),
          text: opt.text,
          isCorrect: opt.isCorrect === true || opt.is_correct === true,
          explanation: opt.explanation || 'No explanation provided.'
        };
      });

      await prisma.question.create({
        data: {
          questionCode: qCode,
          questionText: q.question || q.questionText,
          type: (q.type || 'single_select').toUpperCase(),
          requiredSelections: q.requiredSelections || correctCount || 1,
          domain: domain,
          domainId: domainId,
          topic: q.topic || 'General',
          difficulty: q.difficulty || (q.is_scenario_based ? 'HARD' : 'MEDIUM'),
          explanation: q.explanation || 'No explanation provided.',
          tags: JSON.stringify(q.tags || []),
          sourceModule: q.source || 'Extended Mixed Sets',
          options: {
            create: mappedOptions
          }
        }
      });
      totalImported++;
    }
  }

  console.log(`\n🎉 Import Complete!`);
  console.log(`Total Imported: ${totalImported}`);
  console.log(`Total Skipped: ${totalSkipped}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
