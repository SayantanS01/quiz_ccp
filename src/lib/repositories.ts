import { getDB, IDBQuestion, LocalAttempt, IDBMonitoringEvent, IDBQuestionResponse, generateId } from './idb';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper to shuffle arrays
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export class LocalQuestionRepository {
  static async syncQuestionBank() {
    const db = await getDB();
    if (!db) return;
    
    // Check if seeded
    const count = await db.count('questionBank');
    if (count > 0) return; // Already seeded

    try {
      const res = await fetch('/data/question_bank.json');
      if (!res.ok) throw new Error('Failed to fetch static question bank');
      const questions: IDBQuestion[] = await res.json();
      
      const tx = db.transaction('questionBank', 'readwrite');
      for (const q of questions) {
        tx.store.put(q);
      }
      await tx.done;
      console.log(`Seeded ${questions.length} questions into Local IDB.`);
    } catch (e) {
      console.error('Failed to seed question bank:', e);
    }
  }

  static async getQuestionsByDomain(domainId: number): Promise<IDBQuestion[]> {
    const db = await getDB();
    if (!db) return [];
    return await db.getAllFromIndex('questionBank', 'by-domain', domainId);
  }
}

export class LocalAttemptRepository {
  static async startExam(username: string, mode: string): Promise<LocalAttempt> {
    const db = await getDB();
    if (!db) throw new Error('IDB unavailable');

    await LocalQuestionRepository.syncQuestionBank();

    let targetD1 = 16, targetD2 = 19, targetD3 = 22, targetD4 = 8;
    if (mode === 'SECURITY_CHALLENGE') {
      targetD1 = 8; targetD2 = 35; targetD3 = 16; targetD4 = 6;
    } else if (mode === 'TECH_DEEP_DIVE') {
      targetD1 = 8; targetD2 = 12; targetD3 = 39; targetD4 = 6;
    } else if (mode === 'BILLING_SPECIALIST') {
      targetD1 = 10; targetD2 = 12; targetD3 = 15; targetD4 = 28;
    } else if (mode === 'FOUNDATION') {
      targetD1 = 30; targetD2 = 15; targetD3 = 12; targetD4 = 8;
    }

    const d1Pool = await LocalQuestionRepository.getQuestionsByDomain(1);
    const d2Pool = await LocalQuestionRepository.getQuestionsByDomain(2);
    const d3Pool = await LocalQuestionRepository.getQuestionsByDomain(3);
    const d4Pool = await LocalQuestionRepository.getQuestionsByDomain(4);

    function sampleDomain(pool: IDBQuestion[], targetCount: number) {
      const single = shuffleArray(pool.filter(q => q.type === 'SINGLE_SELECT'));
      const multi = shuffleArray(pool.filter(q => q.type === 'MULTI_SELECT'));
      const targetMulti = Math.max(1, Math.round(targetCount * 0.22));
      const targetSingle = targetCount - targetMulti;
      const pickedMulti = multi.slice(0, targetMulti);
      const pickedSingle = single.slice(0, targetSingle);
      let combined = [...pickedSingle, ...pickedMulti];

      if (combined.length < targetCount) {
        const remaining = pool.filter(q => !combined.some(c => c.id === q.id));
        combined.push(...shuffleArray(remaining).slice(0, targetCount - combined.length));
      }
      return combined.slice(0, targetCount);
    }

    let selectedQuestions = [
      ...sampleDomain(d1Pool, targetD1),
      ...sampleDomain(d2Pool, targetD2),
      ...sampleDomain(d3Pool, targetD3),
      ...sampleDomain(d4Pool, targetD4)
    ];

    if (selectedQuestions.length > 65) selectedQuestions = selectedQuestions.slice(0, 65);
    
    // Exactly 50 scored, 15 unscored
    const scoredDesignations = shuffleArray([
      ...Array(50).fill(true),
      ...Array(15).fill(false),
    ]);

    const shuffledQuestions = shuffleArray(selectedQuestions);

    const now = new Date();
    const durationSeconds = 90 * 60; // 90 minutes
    const expiresAt = new Date(now.getTime() + durationSeconds * 1000); // 90 mins strictly
    
    const attemptsDb = await db.getAllFromIndex('attempts', 'by-username', username);
    const candidateName = attemptsDb.length > 0 ? attemptsDb[0].candidateName : username;

    const attemptId = `CP-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${generateId().substring(0,6).toUpperCase()}`;

    const questionResponses: IDBQuestionResponse[] = shuffledQuestions.map((q, index) => {
      const shuffledOptions = shuffleArray([...q.options]);
      const mappedOptions = shuffledOptions.map((opt, optIndex) => ({
        id: opt.id,
        label: String.fromCharCode(65 + optIndex), // A, B, C, D...
        text: opt.text,
        isCorrect: opt.isCorrect
      }));

      const correctAnswers = mappedOptions.filter(o => o.isCorrect).map(o => o.id);

      return {
        questionId: q.id,
        displayNumber: index + 1,
        originalQuestionId: q.id,
        displayedOptions: mappedOptions,
        selectedAnswers: [],
        correctAnswers,
        isScored: scoredDesignations[index],
        timeSpentSeconds: 0,
        flagged: false
      };
    });

    const localAttempt: LocalAttempt = {
      attemptId,
      username,
      candidateName,
      startedAt: now.toISOString(),
      submittedAt: null,
      status: 'in_progress',
      durationSeconds,
      questionCount: 65,
      scoredQuestionCount: 50,
      unscoredQuestionCount: 15,
      questions: questionResponses,
      incidents: [
        { timestamp: new Date().toISOString(), type: 'EXAM_STARTED', details: `attempt=${attemptId}` }
      ],
      score: null,
      totalScored: null,
      percentage: null,
      passed: null,
      expiresAt: new Date(now.getTime() + (24 * 60 * 60 * 1000)).toISOString() // 24 hr retention
    };

    await db.put('attempts', localAttempt);
    return localAttempt;
  }

  static async getAttempt(attemptId: string): Promise<LocalAttempt | undefined> {
    const db = await getDB();
    if (!db) return undefined;
    return await db.get('attempts', attemptId);
  }

  static async updateQuestionResponse(attemptId: string, qIndex: number, selectedIds: string[], isFlagged: boolean) {
    const db = await getDB();
    if (!db) return;
    
    const tx = db.transaction('attempts', 'readwrite');
    const attempt = await tx.store.get(attemptId);
    if (!attempt || attempt.status === 'completed') return;

    if (attempt.questions[qIndex]) {
      attempt.questions[qIndex].selectedAnswers = selectedIds;
      attempt.questions[qIndex].flagged = isFlagged;
    }

    await tx.store.put(attempt);
    await tx.done;
  }

  static async submitExam(attemptId: string, autoSubmitted: boolean = false): Promise<LocalAttempt | null> {
    const db = await getDB();
    if (!db) return null;

    const tx = db.transaction('attempts', 'readwrite');
    const attempt = await tx.store.get(attemptId);
    if (!attempt || attempt.status === 'completed') return attempt || null;

    attempt.status = 'completed';
    attempt.submittedAt = new Date().toISOString();
    
    LocalMonitoringRepository.logIncident(attempt, autoSubmitted ? 'AUTO_SUBMITTED' : 'EXAM_SUBMITTED');

    // Score calculation
    let scoredCorrect = 0;
    
    for (const q of attempt.questions) {
      if (q.isScored) {
        const selected = new Set(q.selectedAnswers);
        const correct = new Set(q.correctAnswers);
        const isMatch = selected.size === correct.size && [...selected].every(val => correct.has(val));
        if (isMatch) {
          scoredCorrect++;
        }
      }
    }

    attempt.score = scoredCorrect;
    attempt.totalScored = attempt.scoredQuestionCount;
    attempt.percentage = Math.round((scoredCorrect / attempt.scoredQuestionCount) * 100);
    attempt.passed = scoredCorrect >= 35; // 35/50 = PASS

    await tx.store.put(attempt);
    await tx.done;
    return attempt;
  }
}

export class LocalMonitoringRepository {
  static async logIncident(attempt: LocalAttempt, type: string, details?: string) {
    attempt.incidents.push({
      timestamp: new Date().toISOString(),
      type,
      details
    });
  }

  static async persistLog(attemptId: string, type: string, details?: string) {
    const db = await getDB();
    if (!db) return;
    const tx = db.transaction('attempts', 'readwrite');
    const attempt = await tx.store.get(attemptId);
    if (attempt && attempt.status === 'in_progress') {
      attempt.incidents.push({
        timestamp: new Date().toISOString(),
        type,
        details
      });
      await tx.store.put(attempt);
    }
    await tx.done;
  }
}

export class ApiAttemptRepository {
  static async startExam(username: string, candidateName: string, mode: string): Promise<LocalAttempt | null> {
    const res = await fetch('/api/exam/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: username, mode })
    });
    const data = await res.json();
    if (!data.success) return null;
    
    // Convert API format to LocalAttempt format for the UI
    const attempt = data; // data contains the fields directly
    const questions = (attempt.questions || []).map((q: any, i: number) => {
      let options = q.options || []; // The API already returns formatted options, so we can just map them directly
      
      return {
        questionId: q.id, // API returns id instead of questionId
        displayNumber: q.position,
        isScored: q.isScored ?? true, // Default to true if not provided by API
        selectedAnswers: q.selectedOptions || [],
        flagged: q.isFlagged || false,
        displayedOptions: options.map((o: any) => ({
          id: o.id,
          label: o.label,
          text: o.text,
          isCorrect: o.isCorrect // Might be undefined depending on API, which is fine for candidate view
        })),
        correctAnswers: options.filter((o: any) => o.isCorrect).map((o: any) => o.id)
      };
    });

    return {
      attemptId: attempt.attemptId || attempt.id,
      username,
      candidateName,
      mode: attempt.mode,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      status: attempt.status === 'READY' || attempt.status === 'IN_PROGRESS' ? 'in_progress' : 'completed',
      durationSeconds: 5400,
      questionCount: attempt.totalQuestions,
      scoredQuestionCount: attempt.scoredQuestions,
      unscoredQuestionCount: attempt.unscoredQuestions,
      questions,
      incidents: attempt.proctorEvents?.map((e: any) => ({
        timestamp: e.timestamp,
        type: e.eventType,
        details: e.metadata
      })) || [],
      score: attempt.scoredCorrect,
      totalScored: attempt.scoredQuestions,
      percentage: attempt.scorePercentage,
      passed: attempt.passed,
      expiresAt: attempt.expiresAt
    };
  }

  static async getAttempt(attemptId: string): Promise<LocalAttempt | undefined> {
    const res = await fetch(`/api/exam/${attemptId}`);
    const data = await res.json();
    if (!data.success) return undefined;
    
    const attempt = data;
    const questions = (attempt.questions || []).map((q: any) => {
      let options = q.options || [];

      return {
        questionId: q.id,
        displayNumber: q.position,
        questionCode: q.questionCode || '',
        questionText: q.questionText || '',
        domain: q.domain || '',
        topic: q.topic || '',
        difficulty: q.difficulty || '',
        isScored: q.isScored ?? true,
        selectedAnswers: q.selectedOptions || [],
        flagged: q.isFlagged || false,
        displayedOptions: options.map((o: any) => ({
          id: o.id,
          label: o.label,
          text: o.text,
          isCorrect: o.isCorrect
        })),
        correctAnswers: options.filter((o: any) => o.isCorrect).map((o: any) => o.id)
      };
    });

    return {
      attemptId: attempt.id,
      username: attempt.userId,
      candidateName: attempt.userId, // We used username=userId
      mode: attempt.mode,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      status: attempt.status === 'IN_PROGRESS' ? 'in_progress' : 'completed',
      durationSeconds: 5400,
      questionCount: attempt.totalQuestions,
      scoredQuestionCount: attempt.scoredQuestions,
      unscoredQuestionCount: attempt.unscoredQuestions,
      questions,
      incidents: attempt.proctorEvents?.map((e: any) => ({
        timestamp: e.timestamp,
        type: e.eventType,
        details: e.metadata
      })) || [],
      score: attempt.scoredCorrect,
      totalScored: attempt.scoredQuestions,
      percentage: attempt.scorePercentage,
      passed: attempt.passed,
      expiresAt: attempt.expiresAt
    };
  }

  static async updateQuestionResponse(attemptId: string, qIndex: number, selectedIds: string[], isFlagged: boolean) {
    await fetch('/api/exam/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attemptId,
        position: qIndex + 1,
        selectedOptions: selectedIds,
        isFlagged
      })
    });
  }

  static async submitExam(attemptId: string, autoSubmitted: boolean = false): Promise<LocalAttempt | null> {
    const res = await fetch('/api/exam/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attemptId, autoSubmitted })
    });
    const data = await res.json();
    if (!data.success) return null;
    return (await this.getAttempt(attemptId)) ?? null;
  }
}

export class ApiMonitoringRepository {
  static async persistLog(attemptId: string, eventType: string, metadata?: string) {
    await fetch('/api/exam/proctor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attemptId,
        eventType,
        severity: 'INFO',
        metadata
      })
    });
  }
}

export class LocalReportRepository {
  static async generateAttemptJSON(attemptId: string): Promise<Blob | null> {
    const db = await getDB();
    if (!db) return null;
    const attempt = await db.get('attempts', attemptId);
    if (!attempt) return null;
    const jsonStr = JSON.stringify(attempt, null, 2);
    return new Blob([jsonStr], { type: 'application/json' });
  }

  static async generateAttemptLog(attemptId: string): Promise<Blob | null> {
    const db = await getDB();
    if (!db) return null;
    const attempt = await db.get('attempts', attemptId);
    if (!attempt) return null;
    
    const lines = attempt.incidents.map(inc => 
      `${inc.timestamp} | ${inc.type}${inc.details ? ` | ${inc.details}` : ''}`
    );
    const logStr = lines.join('\n');
    return new Blob([logStr], { type: 'text/plain' });
  }

  static async generateAttemptPDF(attemptId: string): Promise<Blob | null> {
    const db = await getDB();
    if (!db) return null;
    const attempt = await db.get('attempts', attemptId);
    if (!attempt) return null;

    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('CloudPrep', 20, 20);
    doc.setFontSize(16);
    doc.text('Attempt Report', 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Candidate: ${attempt.candidateName}`, 20, 45);
    doc.text(`Attempt ID: ${attempt.attemptId}`, 20, 52);
    doc.text(`Date: ${new Date(attempt.startedAt).toLocaleString()}`, 20, 59);
    doc.text(`Score: ${attempt.score} / ${attempt.totalScored} (${attempt.percentage}%)`, 20, 66);
    doc.text(`Result: ${attempt.passed ? 'PASS' : 'FAIL'}`, 20, 73);

    const questionsData = attempt.questions.map(q => {
      const selected = new Set(q.selectedAnswers);
      const correct = new Set(q.correctAnswers);
      const isMatch = selected.size === correct.size && [...selected].every(val => correct.has(val));
      return [
        q.displayNumber.toString(),
        q.questionId,
        isMatch ? 'Correct' : 'Incorrect',
        q.isScored ? 'Yes' : 'No'
      ];
    });

    autoTable(doc, {
      startY: 85,
      head: [['#', 'Question ID', 'Result', 'Scored']],
      body: questionsData,
    });

    return doc.output('blob');
  }

  static async generateCompletePackage(attemptId: string): Promise<Blob | null> {
    const jsonBlob = await this.generateAttemptJSON(attemptId);
    const logBlob = await this.generateAttemptLog(attemptId);
    const pdfBlob = await this.generateAttemptPDF(attemptId);

    if (!jsonBlob || !logBlob || !pdfBlob) return null;

    const zip = new JSZip();
    zip.file(`CloudPrep_${attemptId}_attempt.json`, jsonBlob);
    zip.file(`CloudPrep_${attemptId}_monitoring.log`, logBlob);
    zip.file(`CloudPrep_${attemptId}_report.pdf`, pdfBlob);

    return await zip.generateAsync({ type: 'blob' });
  }
}
