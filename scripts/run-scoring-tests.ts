import { scoreExamAttempt } from '../src/lib/scoring-engine';

interface TestCase {
  id: number;
  name: string;
  scoredCorrectCount: number;
  unscoredCorrectCount: number;
  expectedPass: boolean;
}

const testCases: TestCase[] = [
  { id: 1, name: '35 scored correct -> PASS', scoredCorrectCount: 35, unscoredCorrectCount: 0, expectedPass: true },
  { id: 2, name: '34 scored correct -> FAIL', scoredCorrectCount: 34, unscoredCorrectCount: 0, expectedPass: false },
  { id: 3, name: '30 scored correct, 15 unscored correct -> FAIL', scoredCorrectCount: 30, unscoredCorrectCount: 15, expectedPass: false },
  { id: 4, name: '35 scored correct, 0 unscored correct -> PASS', scoredCorrectCount: 35, unscoredCorrectCount: 0, expectedPass: true },
  { id: 5, name: '50 scored correct -> PASS', scoredCorrectCount: 50, unscoredCorrectCount: 0, expectedPass: true },
  { id: 6, name: '0 scored correct, 15 unscored correct -> FAIL', scoredCorrectCount: 0, unscoredCorrectCount: 15, expectedPass: false },
  { id: 7, name: '34 scored correct, 15 unscored correct -> FAIL', scoredCorrectCount: 34, unscoredCorrectCount: 15, expectedPass: false },
  { id: 8, name: '35 scored correct, 15 unscored correct -> PASS', scoredCorrectCount: 35, unscoredCorrectCount: 15, expectedPass: true },
];

function buildMockExam(scoredCorrectCount: number, unscoredCorrectCount: number) {
  const questions = [];

  // 50 Scored questions
  for (let i = 1; i <= 50; i++) {
    const isCorrect = i <= scoredCorrectCount;
    questions.push({
      questionId: `q-scored-${i}`,
      isScored: true,
      type: 'SINGLE_SELECT',
      correctAnswers: ['A'],
      selectedOptions: isCorrect ? ['A'] : ['B'],
      domain: 'Cloud Concepts',
      topic: 'Introduction to AWS',
    });
  }

  // 15 Unscored questions
  for (let i = 1; i <= 15; i++) {
    const isCorrect = i <= unscoredCorrectCount;
    questions.push({
      questionId: `q-unscored-${i}`,
      isScored: false,
      type: 'SINGLE_SELECT',
      correctAnswers: ['C'],
      selectedOptions: isCorrect ? ['C'] : ['D'],
      domain: 'Security and Compliance',
      topic: 'IAM',
    });
  }

  return questions;
}

console.log('====================================================');
console.log('RUNNING AUTOMATED SCORING ENGINE TESTS (SECTION 57)');
console.log('====================================================\n');

let passedTests = 0;
let failedTests = 0;

for (const tc of testCases) {
  const mockQuestions = buildMockExam(tc.scoredCorrectCount, tc.unscoredCorrectCount);
  const result = scoreExamAttempt(mockQuestions);

  const passedCondition = result.passed === tc.expectedPass;
  const scoredMatch = result.scoredCorrect === tc.scoredCorrectCount;
  const unscoredMatch = result.unscoredCorrect === tc.unscoredCorrectCount;

  if (passedCondition && scoredMatch && unscoredMatch) {
    console.log(`✅ Test ${tc.id}: ${tc.name}`);
    console.log(`   -> Scored Correct: ${result.scoredCorrect}/50 | Unscored Correct: ${result.unscoredCorrect}/15 | Result: ${result.passed ? 'PASS' : 'FAIL'}`);
    passedTests++;
  } else {
    console.error(`❌ Test ${tc.id} FAILED: ${tc.name}`);
    console.error(`   Expected pass=${tc.expectedPass}, got pass=${result.passed}`);
    console.error(`   Scored: expected ${tc.scoredCorrectCount}, got ${result.scoredCorrect}`);
    console.error(`   Unscored: expected ${tc.unscoredCorrectCount}, got ${result.unscoredCorrect}`);
    failedTests++;
  }
}

console.log('\n----------------------------------------------------');
console.log(`Summary: ${passedTests}/${testCases.length} Tests Passed. ${failedTests} Failed.`);
console.log('----------------------------------------------------');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🌟 ALL 8 MANDATORY SCORING TESTS PASSED PERFECTLY!\n');
}
