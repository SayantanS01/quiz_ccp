const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const modules = await prisma.question.groupBy({
    by: ['sourceModule', 'source'],
    _count: {
      id: true
    }
  });
  console.log(modules);
}

main().catch(console.error).finally(() => prisma.$disconnect());
