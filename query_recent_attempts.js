const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const attempts = await prisma.examAttempt.findMany({
    orderBy: { startedAt: 'desc' },
    take: 3
  });
  console.log(JSON.stringify(attempts, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
