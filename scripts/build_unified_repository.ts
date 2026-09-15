import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { SemanticDuplicateIndex } from '../src/lib/duplicate-detector';
import { validateQuestion } from '../src/lib/question-validator';
import { PDF_CANDIDATE_QUESTIONS, CandidateQuestion } from './pdf_candidates_data';

const prisma = new PrismaClient();

const DOMAIN_MAP: Record<string, { name: string; id: number }> = {
  'Cloud Concepts': { name: 'Cloud Concepts', id: 1 },
  'Security and Compliance': { name: 'Security and Compliance', id: 2 },
  'Security': { name: 'Security and Compliance', id: 2 },
  'Technology': { name: 'Cloud Technology and Services', id: 3 },
  'Cloud Technology and Services': { name: 'Cloud Technology and Services', id: 3 },
  'Billing and Pricing': { name: 'Billing, Pricing and Support', id: 4 },
  'Billing, Pricing and Support': { name: 'Billing, Pricing and Support', id: 4 },
};

function normalizeDomain(rawDomain: string): { name: string; id: number } {
  const match = DOMAIN_MAP[rawDomain.trim()];
  if (match) return match;
  return { name: 'Cloud Technology and Services', id: 3 };
}

function generateExplanation(q: any): string {
  const correctLabels = q.correct_answers || [];
  const correctOptions = q.options.filter((o: any) => correctLabels.includes(o.id));
  const correctText = correctOptions.map((o: any) => o.text).join('; ');
  return `Correct answer: ${correctText}. In AWS, ${q.topic} principles specify this selection as the recommended architectural solution adhering to AWS Certified Cloud Practitioner best practices.`;
}

async function main() {
  console.log('=== Step 1: Loading 8 JSON Question Bank Files (800 Questions) ===');
  const jsonDir = path.join(process.cwd(), 'question_set');
  const jsonFiles = [
    'cloudprep_aws_cp_set_01.json',
    'cloudprep_aws_cp_set_02.json',
    'cloudprep_aws_cp_set_03.json',
    'cloudprep_aws_cp_set_04.json',
    'cloudprep_aws_cp_set_05.json',
    'cloudprep_aws_cp_set_06.json',
    'cloudprep_aws_cp_set_07.json',
    'cloudprep_aws_cp_set_08.json',
  ];

  const duplicateIndex = new SemanticDuplicateIndex();
  const allJsonQuestions: any[] = [];

  for (let i = 0; i < jsonFiles.length; i++) {
    const filename = jsonFiles[i];
    const filepath = path.join(jsonDir, filename);
    const content = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    const qs = content.questions || [];
    const setNumStr = String(i + 1).padStart(2, '0');
    const sourceLabel = `JSON Set ${setNumStr}`;

    for (const q of qs) {
      const dInfo = normalizeDomain(q.domain);
      const explanation = q.explanation && q.explanation.trim().length > 15
        ? q.explanation.trim()
        : generateExplanation(q);

      const formatted = {
        questionCode: q.id,
        questionText: q.question.trim(),
        type: q.type === 'multi_select' ? 'MULTI_SELECT' : 'SINGLE_SELECT',
        requiredSelections: q.correct_answers.length,
        domain: dInfo.name,
        domainId: dInfo.id,
        topic: q.topic || 'General AWS',
        difficulty: (q.difficulty || 'MEDIUM').toUpperCase(),
        explanation,
        tags: JSON.stringify([q.topic, `Set ${setNumStr}`, 'CLF-C02']),
        sourceModule: q.source_module || `JSON Set ${setNumStr}`,
        source: sourceLabel,
        sourceType: 'json',
        status: 'active',
        concept: `${q.topic} - ${dInfo.name}`,
        options: q.options.map((opt: any) => ({
          label: opt.id,
          text: opt.text.trim(),
          isCorrect: q.correct_answers.includes(opt.id),
        })),
      };

      allJsonQuestions.push(formatted);
      duplicateIndex.addQuestion({
        questionCode: formatted.questionCode,
        questionText: formatted.questionText,
        concept: formatted.concept,
        topic: formatted.topic,
        domain: formatted.domain,
        correctAnswersSummary: formatted.options.filter((o: any) => o.isCorrect).map((o: any) => o.text).join(', '),
      });
    }
  }

  console.log(`Loaded and indexed ${allJsonQuestions.length} JSON questions.`);

  console.log('\n=== Step 2: Processing PDF Candidate Questions with Duplicate Prevention ===');
  const acceptedPdfQuestions: any[] = [];
  const rejectedDuplicateQuestions: any[] = [];

  for (const candidate of PDF_CANDIDATE_QUESTIONS) {
    const dupCheck = duplicateIndex.checkDuplicate(
      candidate.questionText,
      candidate.concept,
      candidate.options.filter(o => o.isCorrect).map(o => o.text).join(', ')
    );

    if (dupCheck.isDuplicate) {
      console.log(`❌ REJECTED DUPLICATE: ${candidate.questionCode} -> Reason: ${dupCheck.rejectionReason}`);
      rejectedDuplicateQuestions.push({
        ...candidate,
        status: 'rejected',
        sourceType: 'pdf_generated',
        rejectionReason: dupCheck.rejectionReason,
        conflictingQuestionCode: dupCheck.conflictingQuestionCode,
      });
    } else {
      console.log(`✅ ACCEPTED UNIQUE: ${candidate.questionCode} [${candidate.source}] - ${candidate.concept}`);
      const accepted = {
        ...candidate,
        status: 'active',
        sourceType: 'pdf_generated',
      };
      acceptedPdfQuestions.push(accepted);
      // Add accepted question to index so subsequent candidates are checked against it
      duplicateIndex.addQuestion({
        questionCode: accepted.questionCode,
        questionText: accepted.questionText,
        concept: accepted.concept,
        topic: accepted.topic,
        domain: accepted.domain,
        correctAnswersSummary: accepted.options.filter(o => o.isCorrect).map(o => o.text).join(', '),
      });
    }
  }

  console.log(`\nCandidate Analysis Summary:`);
  console.log(`- Accepted Unique PDF Questions: ${acceptedPdfQuestions.length}`);
  console.log(`- Rejected Duplicate Candidates: ${rejectedDuplicateQuestions.length}`);

  console.log('\n=== Step 3: Seeding Database with Unified Repository ===');
  // Clear existing attempt questions, questions, and options
  await prisma.attemptQuestion.deleteMany({});
  await prisma.proctorEvent.deleteMany({});
  await prisma.examAttempt.deleteMany({});
  await prisma.bookmark.deleteMany({});
  await prisma.questionOption.deleteMany({});
  await prisma.question.deleteMany({});

  const allToInsert = [
    ...allJsonQuestions,
    ...acceptedPdfQuestions.map(q => ({
      ...q,
      tags: JSON.stringify(q.tags),
    })),
    ...rejectedDuplicateQuestions.map(q => ({
      ...q,
      tags: JSON.stringify(q.tags),
    })),
  ];

  console.log(`Writing ${allToInsert.length} total questions to database...`);

  // Batch insert questions
  for (const q of allToInsert) {
    await prisma.question.create({
      data: {
        questionCode: q.questionCode,
        questionText: q.questionText,
        type: q.type,
        requiredSelections: q.requiredSelections,
        domain: q.domain,
        domainId: q.domainId,
        topic: q.topic,
        difficulty: q.difficulty,
        explanation: q.explanation,
        tags: q.tags,
        sourceModule: q.sourceModule,
        source: q.source,
        sourceType: q.sourceType,
        status: q.status,
        concept: q.concept,
        rejectionReason: q.rejectionReason,
        conflictingQuestionCode: q.conflictingQuestionCode,
        options: {
          create: q.options.map((opt: any) => ({
            label: opt.label,
            text: opt.text,
            isCorrect: opt.isCorrect,
          })),
        },
      },
    });
  }

  // Ensure default system settings exist
  const defaultSettings = [
    { key: 'warningThresholdLevel1', value: '1', description: 'Violations before first advisory modal' },
    { key: 'warningThresholdLevel2', value: '2', description: 'Violations before serious countdown warning' },
    { key: 'warningThresholdLevel3', value: '3', description: 'Violations before automatic exam termination' },
    { key: 'passingThresholdScored', value: '35', description: 'Scored correct questions required to pass' },
    { key: 'totalExamQuestions', value: '65', description: 'Total questions presented in full mock exam' },
    { key: 'scoredQuestionsCount', value: '50', description: 'Designated scored questions' },
    { key: 'unscoredQuestionsCount', value: '15', description: 'Designated unscored practice questions' },
  ];

  for (const s of defaultSettings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description },
      create: { key: s.key, value: s.value, description: s.description },
    });
  }

  const activeCount = await prisma.question.count({ where: { status: 'active' } });
  const rejectedCount = await prisma.question.count({ where: { status: 'rejected' } });
  const totalOptions = await prisma.questionOption.count();

  console.log(`\n🎉 Unified Repository Successfully Seeded!`);
  console.log(`- Active Questions in Master Exam Pool: ${activeCount} (800 JSON + ${activeCount - 800} PDF)`);
  console.log(`- Rejected Duplicate Candidates in Audit Log: ${rejectedCount}`);
  console.log(`- Total Options in Database: ${totalOptions}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
