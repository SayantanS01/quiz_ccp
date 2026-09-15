import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function exportData() {
  const qs = await prisma.question.findMany({
    include: { options: true }
  });
  
  const publicDataDir = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(publicDataDir)) {
    fs.mkdirSync(publicDataDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDataDir, 'question_bank.json'), JSON.stringify(qs, null, 2));
  console.log(`Exported ${qs.length} questions to public/data/question_bank.json`);
}

exportData()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
