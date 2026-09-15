import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      name: 'Admin',
      passcode: '0216',
      role: 'admin',
    },
  });
  console.log('Admin user seeded:', admin);
}
main().finally(() => prisma.$disconnect());
