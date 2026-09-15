// Semantic Duplicate Detection Engine for CloudPrep Question Repository

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'against', 'between',
  'into', 'through', 'during', 'before', 'after', 'above', 'below', 'from',
  'up', 'down', 'in', 'out', 'over', 'under', 'again', 'further', 'then', 'once',
  'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each',
  'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
  'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should',
  'which', 'what', 'who', 'whose', 'whom', 'this', 'that', 'these', 'those',
  'amazon', 'aws', 'service', 'services', 'provide', 'provides', 'used', 'using',
  'company', 'organization', 'needs', 'wants', 'requires', 'best', 'option'
]);

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenize(text: string): string[] {
  const normalized = normalizeText(text);
  return normalized
    .split(' ')
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

export function getNGrams(tokens: string[], n: number = 2): Set<string> {
  const ngrams = new Set<string>();
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.add(tokens.slice(i, i + n).join(' '));
  }
  return ngrams;
}

export function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 1.0;
  if (setA.size === 0 || setB.size === 0) return 0.0;

  let intersectionCount = 0;
  for (const item of setA) {
    if (setB.has(item)) {
      intersectionCount++;
    }
  }

  const unionCount = setA.size + setB.size - intersectionCount;
  return unionCount === 0 ? 0 : intersectionCount / unionCount;
}

export interface IndexedQuestion {
  questionCode: string;
  questionText: string;
  concept?: string;
  topic?: string;
  domain?: string;
  correctAnswersSummary?: string;
  normalizedText: string;
  tokens: Set<string>;
  bigrams: Set<string>;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  similarity: number;
  conflictingQuestionCode?: string;
  conflictingQuestionText?: string;
  rejectionReason?: string;
}

export class SemanticDuplicateIndex {
  private indexedQuestions: IndexedQuestion[] = [];
  private exactTextMap = new Map<string, string>();
  private normalizedTextMap = new Map<string, string>();

  constructor(initialQuestions?: { questionCode: string; questionText: string; concept?: string; topic?: string; domain?: string; correctAnswersSummary?: string }[]) {
    if (initialQuestions) {
      for (const q of initialQuestions) {
        this.addQuestion(q);
      }
    }
  }

  public addQuestion(q: {
    questionCode: string;
    questionText: string;
    concept?: string;
    topic?: string;
    domain?: string;
    correctAnswersSummary?: string;
  }): void {
    const rawExact = q.questionText.trim();
    const normalized = normalizeText(q.questionText);
    const tokenArr = tokenize(q.questionText);
    const tokens = new Set(tokenArr);
    const bigrams = getNGrams(tokenArr, 2);

    this.exactTextMap.set(rawExact, q.questionCode);
    this.normalizedTextMap.set(normalized, q.questionCode);

    this.indexedQuestions.push({
      questionCode: q.questionCode,
      questionText: q.questionText,
      concept: q.concept,
      topic: q.topic,
      domain: q.domain,
      correctAnswersSummary: q.correctAnswersSummary,
      normalizedText: normalized,
      tokens,
      bigrams,
    });
  }

  public checkDuplicate(
    candidateText: string,
    candidateConcept?: string,
    candidateCorrectSummary?: string,
    threshold: number = 0.62
  ): DuplicateCheckResult {
    const rawTrimmed = candidateText.trim();
    const normalized = normalizeText(candidateText);

    // 1. Exact text match
    if (this.exactTextMap.has(rawTrimmed)) {
      const code = this.exactTextMap.get(rawTrimmed)!;
      return {
        isDuplicate: true,
        similarity: 1.0,
        conflictingQuestionCode: code,
        conflictingQuestionText: rawTrimmed,
        rejectionReason: `Exact text match with existing question ${code}`,
      };
    }

    // 2. Normalized text match
    if (this.normalizedTextMap.has(normalized)) {
      const code = this.normalizedTextMap.get(normalized)!;
      return {
        isDuplicate: true,
        similarity: 1.0,
        conflictingQuestionCode: code,
        conflictingQuestionText: normalized,
        rejectionReason: `Normalized wording match with existing question ${code}`,
      };
    }

    const candidateTokensArr = tokenize(candidateText);
    const candidateTokens = new Set(candidateTokensArr);
    const candidateBigrams = getNGrams(candidateTokensArr, 2);

    let maxSimilarity = 0;
    let worstMatch: IndexedQuestion | null = null;
    let worstReason = '';

    for (const existing of this.indexedQuestions) {
      // 3. Concept + Correct Answer collision check
      if (
        candidateConcept &&
        existing.concept &&
        candidateConcept.toLowerCase() === existing.concept.toLowerCase()
      ) {
        let sharedCount = 0;
        for (const t of candidateTokens) {
          if (existing.tokens.has(t)) sharedCount++;
        }
        const tokenSim = jaccardSimilarity(candidateTokens, existing.tokens);
        if (sharedCount >= 2 || tokenSim >= 0.25) {
          return {
            isDuplicate: true,
            similarity: Math.round(Math.max(tokenSim, sharedCount / Math.min(candidateTokens.size, existing.tokens.size)) * 100) / 100,
            conflictingQuestionCode: existing.questionCode,
            conflictingQuestionText: existing.questionText,
            rejectionReason: `Concept collision: Tests same AWS knowledge point (${candidateConcept}) with question ${existing.questionCode} (${sharedCount} shared core terms)`,
          };
        }
      }

      // 4. Token & Bigram Jaccard Similarity
      const tokenSim = jaccardSimilarity(candidateTokens, existing.tokens);
      const bigramSim = jaccardSimilarity(candidateBigrams, existing.bigrams);
      const combinedSim = (tokenSim * 0.6) + (bigramSim * 0.4);

      if (combinedSim > maxSimilarity) {
        maxSimilarity = combinedSim;
        worstMatch = existing;
        worstReason = `High semantic similarity (${Math.round(combinedSim * 100)}%) with ${existing.questionCode}`;
      }
    }

    if (maxSimilarity >= threshold && worstMatch) {
      return {
        isDuplicate: true,
        similarity: Math.round(maxSimilarity * 100) / 100,
        conflictingQuestionCode: worstMatch.questionCode,
        conflictingQuestionText: worstMatch.questionText,
        rejectionReason: worstReason,
      };
    }

    return {
      isDuplicate: false,
      similarity: Math.round(maxSimilarity * 100) / 100,
    };
  }

  public size(): number {
    return this.indexedQuestions.length;
  }
}
