const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing all UserMistake entries...');
  await prisma.userMistake.deleteMany({});
  
  console.log('Fetching all incorrect AttemptQuestions...');
  const incorrectAttempts = await prisma.attemptQuestion.findMany({
    where: { isCorrect: false },
    include: {
      attempt: true,
      question: true
    }
  });

  const mistakeMap = {};

  for (const aq of incorrectAttempts) {
    const key = `${aq.attempt.userId}_${aq.questionId}`;
    if (!mistakeMap[key]) {
      mistakeMap[key] = {
        userId: aq.attempt.userId,
        questionId: aq.questionId,
        domain: aq.question.domain,
        mistakeCount: 0,
        lastAttempted: aq.attempt.createdAt
      };
    }
    mistakeMap[key].mistakeCount++;
    if (aq.attempt.createdAt > mistakeMap[key].lastAttempted) {
      mistakeMap[key].lastAttempted = aq.attempt.createdAt;
    }
  }

  const newMistakes = Object.values(mistakeMap);
  console.log(`Rebuilding with ${newMistakes.length} accurate UserMistake entries...`);
  
  if (newMistakes.length > 0) {
    await prisma.userMistake.createMany({
      data: newMistakes
    });
  }

  const finalCount = await prisma.userMistake.count({ where: { userId: 'sayantan' } });
  console.log(`Final mistakes for sayantan: ${finalCount}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
