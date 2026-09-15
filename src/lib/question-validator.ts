export interface QuestionInput {
  questionCode: string;
  questionText: string;
  type: 'SINGLE_SELECT' | 'MULTI_SELECT';
  requiredSelections: number;
  options: { label: string; text: string; isCorrect: boolean }[];
  explanation: string;
  domain: string;
  domainId: number;
  topic: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags: string[];
  sourceModule: string;
  status?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateQuestion(q: QuestionInput, existingTexts?: Set<string>): ValidationResult {
  const errors: string[] = [];

  // 1. Check question code & text
  if (!q.questionCode || q.questionCode.trim().length === 0) {
    errors.push('Question code is required.');
  }
  if (!q.questionText || q.questionText.trim().length < 15) {
    errors.push('Question text must be at least 15 characters long.');
  }

  // 2. Duplicate question text check
  if (existingTexts && existingTexts.has(q.questionText.trim().toLowerCase())) {
    errors.push(`Duplicate question detected: "${q.questionText.substring(0, 50)}..."`);
  }

  // 3. Option count check (4-5 options)
  if (!q.options || q.options.length < 4 || q.options.length > 5) {
    errors.push(`Question must have between 4 and 5 options, got ${q.options ? q.options.length : 0}.`);
  }

  // 4. Duplicate option texts
  if (q.options) {
    const seenTexts = new Set<string>();
    for (const opt of q.options) {
      const cleanText = opt.text.trim().toLowerCase();
      if (!cleanText) {
        errors.push(`Option label ${opt.label} has empty text.`);
      }
      if (seenTexts.has(cleanText)) {
        errors.push(`Duplicate option text detected in option ${opt.label}: "${opt.text}".`);
      }
      seenTexts.add(cleanText);
    }
  }

  // 5. Correct answer check
  const correctOptions = q.options ? q.options.filter((o) => o.isCorrect) : [];
  if (correctOptions.length === 0) {
    errors.push('Question must have at least one correct answer.');
  }

  // 6. Single-select rules
  if (q.type === 'SINGLE_SELECT') {
    if (correctOptions.length !== 1) {
      errors.push(`Single-select questions must have exactly 1 correct answer, found ${correctOptions.length}.`);
    }
    if (q.requiredSelections !== 1) {
      errors.push(`Single-select questions must have requiredSelections = 1, found ${q.requiredSelections}.`);
    }
  }

  // 7. Multi-select rules
  if (q.type === 'MULTI_SELECT') {
    if (correctOptions.length < 2) {
      errors.push(`Multi-select questions must have at least 2 correct answers, found ${correctOptions.length}.`);
    }
    if (q.requiredSelections !== correctOptions.length) {
      errors.push(
        `Multi-select requiredSelections (${q.requiredSelections}) does not match number of correct answers (${correctOptions.length}).`
      );
    }
  }

  // 8. Explanation check
  if (!q.explanation || q.explanation.trim().length < 20) {
    errors.push('Explanation must be at least 20 characters explaining the correct AWS concept.');
  }

  // 9. Domain and Topic checks
  const validDomains = [
    'Cloud Concepts',
    'Security and Compliance',
    'Cloud Technology and Services',
    'Billing, Pricing and Support',
  ];
  if (!validDomains.includes(q.domain)) {
    errors.push(`Invalid domain "${q.domain}". Must be one of: ${validDomains.join(', ')}.`);
  }
  if (!q.topic || q.topic.trim().length === 0) {
    errors.push('Topic is required.');
  }

  // 10. Difficulty check
  if (!['EASY', 'MEDIUM', 'HARD'].includes(q.difficulty)) {
    errors.push(`Invalid difficulty "${q.difficulty}". Must be EASY, MEDIUM, or HARD.`);
  }

  // 11. Source module check
  if (!q.sourceModule || q.sourceModule.trim().length === 0) {
    errors.push('Source module is required.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
