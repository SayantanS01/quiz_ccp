const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const attempts = await prisma.examAttempt.count({ where: { userId: 'sayantan' } });
  const mistakes = await prisma.userMistake.count({ where: { userId: 'sayantan' } });
  console.log(`Attempts for sayantan: ${attempts}`);
  console.log(`Mistakes for sayantan: ${mistakes}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
