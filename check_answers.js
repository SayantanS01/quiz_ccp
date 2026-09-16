const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Checking for data integrity issues in question options...");
  
  const questions = await prisma.question.findMany({
    include: {
      options: true
    }
  });
  
  let noCorrectAnswers = [];
  let allCorrectAnswers = [];
  
  for (const q of questions) {
    if (!q.options || q.options.length === 0) continue;
    
    const correctOptions = q.options.filter(o => o.isCorrect);
    
    if (correctOptions.length === 0) {
      noCorrectAnswers.push(q);
    } else if (correctOptions.length === q.options.length && q.options.length > 1) {
       allCorrectAnswers.push(q);
    }
  }
  
  console.log(`Total questions checked: ${questions.length}`);
  console.log(`Questions with NO correct answer marked: ${noCorrectAnswers.length}`);
  console.log(`Questions where ALL options are marked correct: ${allCorrectAnswers.length}`);
  
  if (noCorrectAnswers.length > 0) {
    console.log("Sample of questions with no correct answer:");
    for (let i = 0; i < Math.min(5, noCorrectAnswers.length); i++) {
      console.log(`ID: ${noCorrectAnswers[i].id}, Type: ${noCorrectAnswers[i].sourceType}, Text: ${noCorrectAnswers[i].text.substring(0, 50)}...`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
