import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// CONFIGURATION
// ==========================================
// Set your API key in your terminal before running:
// export OPENAI_API_KEY="sk-..."
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const BATCH_SIZE = 5; // How many questions to process concurrently

if (!OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY environment variable is missing.");
  console.error("Run: export OPENAI_API_KEY='your-key-here' && npx ts-node scripts/generate_explanations.ts");
  process.exit(1);
}

async function generateExplanationForOptions(question: any) {
  const prompt = `
You are an expert AWS Solutions Architect. I will give you a multiple-choice question and its options.
For each option (A, B, C, D), provide a short, concise, 1-2 sentence explanation of WHY it is correct or incorrect.

Question: ${question.questionText}
Options:
${question.options.map((o: any) => `${o.label}: ${o.text}`).join('\n')}

Format your response strictly as JSON like this:
{
  "A": "Explanation for why A is correct or incorrect.",
  "B": "Explanation for why B is correct or incorrect.",
  "C": "...",
  "D": "..."
}
`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'CloudPrep Admin',
    },
    body: JSON.stringify({
      model: "openai/gpt-4o", 
      max_tokens: 300,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You output strict JSON." },
        { role: "user", content: prompt }
      ]
    })
  });

  const data: any = await response.json();
  if (data.error) {
    throw new Error(data.error.message);
  }
  
  return JSON.parse(data.choices[0].message.content);
}

async function processBatch(questions: any[]) {
  const promises = questions.map(async (q) => {
    try {
      const explanations = await generateExplanationForOptions(q);
      
      // Update each option in the database
      for (const opt of q.options) {
        if (explanations[opt.label]) {
          await prisma.questionOption.update({
            where: { id: opt.id },
            data: { explanation: explanations[opt.label] }
          });
        }
      }
      console.log(`✅ Updated Question ${q.questionCode}`);
    } catch (err: any) {
      console.error(`❌ Failed Question ${q.questionCode}: ${err.message}`);
    }
  });

  await Promise.all(promises);
}

async function main() {
  console.log("🔍 Fetching questions without option explanations...");
  
  // Find questions where at least one option has a null explanation
  const questions = await prisma.question.findMany({
    where: {
      options: {
        some: { explanation: null }
      }
    },
    include: {
      options: true
    }
  });

  console.log(`Found ${questions.length} questions to process.`);

  // Process in batches to avoid rate limits and connection pooling issues
  // OpenRouter new accounts have a 20 RPM limit (1 request every 3 seconds).
  // With BATCH_SIZE = 5, we make 5 requests at once. We must wait 15-20 seconds before the next batch.
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  for (let i = 0; i < questions.length; i += BATCH_SIZE) {
    const batch = questions.slice(i, i + BATCH_SIZE);
    console.log(`\n⏳ Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(questions.length / BATCH_SIZE)}...`);
    await processBatch(batch);
    
    if (i + BATCH_SIZE < questions.length) {
      console.log(`Waiting 16 seconds to respect OpenRouter rate limits (20 RPM)...`);
      await delay(16000);
    }
  }

  console.log("\n🎉 Finished generating explanations!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
