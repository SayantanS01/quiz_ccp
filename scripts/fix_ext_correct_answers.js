const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  console.log('⚡ Fast batch fixing correct_answers for all 800 EXT questions...');

  const files = [
    'question_set/cloudprep_extended_mixed_4x200/cloudprep_extended_mixed_set_01.json',
    'question_set/cloudprep_extended_mixed_4x200/cloudprep_extended_mixed_set_02.json',
    'question_set/cloudprep_extended_mixed_4x200/cloudprep_extended_mixed_set_03.json',
    'question_set/cloudprep_extended_mixed_4x200/cloudprep_extended_mixed_set_04.json'
  ];

  const questionMap = new Map();
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const q of (data.questions || [])) {
      const qCode = q.id || q.questionCode;
      const correctList = q.correct_answers || q.correctAnswers || (q.correct_answer ? [q.correct_answer] : []);
      if (correctList.length > 0) {
        questionMap.set(qCode, {
          correctList,
          explanation: q.explanation || ''
        });
      }
    }
  }

  console.log(`Loaded ${questionMap.size} questions from JSON files.`);

  // Fetch all EXT questions with options in 1 query!
  const dbQuestions = await prisma.question.findMany({
    where: { questionCode: { startsWith: 'EXT-' } },
    include: { options: true }
  });

  console.log(`Fetched ${dbQuestions.length} EXT questions from database.`);

  const BATCH_SIZE = 40;
  let updatedCount = 0;

  for (let i = 0; i < dbQuestions.length; i += BATCH_SIZE) {
    const chunk = dbQuestions.slice(i, i + BATCH_SIZE);

    const promises = chunk.map(async (dbQ) => {
      const info = questionMap.get(dbQ.questionCode);
      if (!info) return;

      const { correctList, explanation } = info;

      // Option update promises
      const optUpdates = dbQ.options.map(opt => {
        const shouldBeCorrect = correctList.includes(opt.label);
        if (opt.isCorrect !== shouldBeCorrect) {
          return prisma.questionOption.update({
            where: { id: opt.id },
            data: {
              isCorrect: shouldBeCorrect,
              explanation: shouldBeCorrect
                ? `Correct: ${opt.text} directly satisfies the requirement for ${dbQ.topic} in accordance with AWS best practices.`
                : `Incorrect: ${opt.text} does not fulfill the criteria for ${dbQ.topic}.`
            }
          });
        }
        return null;
      }).filter(Boolean);

      const correctOptTexts = dbQ.options
        .filter(o => correctList.includes(o.label))
        .map(o => `"${o.text}"`)
        .join(' and ');

      const fullExpl = `Correct answer: ${correctOptTexts || correctList.join(', ')}. ${explanation || `This choice directly satisfies the ${dbQ.topic} requirement within the ${dbQ.domain} domain adhering to AWS Certified Cloud Practitioner best practices.`}`;

      const qUpdate = prisma.question.update({
        where: { id: dbQ.id },
        data: { explanation: fullExpl }
      });

      await Promise.all([...optUpdates, qUpdate]);
      updatedCount++;
    });

    await Promise.all(promises);
    console.log(`Progress: ${Math.min(i + BATCH_SIZE, dbQuestions.length)} / ${dbQuestions.length} questions updated.`);
  }

  console.log(`🎉 Finished! Updated ${updatedCount} questions.`);

  const stillZero = await prisma.question.count({
    where: {
      options: {
        none: { isCorrect: true }
      }
    }
  });
  console.log(`Questions in DB with 0 correct answers now: ${stillZero}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
