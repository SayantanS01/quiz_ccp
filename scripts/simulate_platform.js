const BASE = 'https://quiz-ccp-seven.vercel.app';

async function report(label, fn) {
  process.stdout.write(`\n${'─'.repeat(60)}\n[TEST] ${label}\n${'─'.repeat(60)}\n`);
  try {
    const result = await fn();
    console.log('✅ PASS:', JSON.stringify(result, null, 2));
    return result;
  } catch (e) {
    console.error('❌ FAIL:', e.message);
    return null;
  }
}

async function post(path, body, cookie) {
  const headers = { 'Content-Type': 'application/json' };
  if (cookie) headers['Cookie'] = cookie;
  const r = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });
  // Return both body and Set-Cookie header
  const json = await r.json();
  const setCookie = r.headers.get('set-cookie') || '';
  return { json, cookie: setCookie };
}

async function get(path, cookie) {
  const headers = { 'Content-Type': 'application/json' };
  if (cookie) headers['Cookie'] = cookie;
  const r = await fetch(`${BASE}${path}`, { headers });
  return r.json();
}

async function main() {
  console.log('\n🚀 CloudPrep Full Platform Simulation — Test User: "Test" / "0000"');
  console.log(`Target: ${BASE}\n`);

  // Step 1: Try register first
  let session = await report('REGISTER: Create Test user', async () => {
    const r = await post('/api/auth/register', { username: 'Test', passcode: '0000' });
    if (r.error) throw new Error(r.error);
    return { username: r.username, userId: r.id };
  });

  // Step 2: Login
  const loginData = await report('LOGIN: Test / 0000', async () => {
    const r = await post('/api/auth/login', { username: 'Test', passcode: '0000' });
    if (!r.token && !r.username) throw new Error(r.error || 'No token returned');
    return { token: r.token, username: r.username, id: r.id };
  });

  const token = loginData?.token;
  const userId = loginData?.id;

  if (!token) {
    console.error('\n❌ Cannot continue without auth token. Login failed.');
    return;
  }

  // Step 3: Start a QUICK PRACTICE exam
  const examStart = await report('START EXAM: QUICK_PRACTICE (15 questions)', async () => {
    const r = await post('/api/exam/start', { mode: 'QUICK_PRACTICE', token });
    if (r.error) throw new Error(r.error);
    return { attemptId: r.attemptId, mode: r.mode, questions: r.questionCount };
  });

  const attemptId = examStart?.attemptId;
  if (!attemptId) { console.error('\n❌ Cannot continue without attemptId.'); return; }

  // Step 4: Load exam session questions
  const examSession = await report(`LOAD EXAM SESSION: /api/exam/${attemptId}`, async () => {
    const r = await get(`/api/exam/${attemptId}`, token);
    if (!r.success) throw new Error(r.error || 'Failed to load session');
    const first = r.questions?.[0];
    return {
      totalQuestions: r.questions?.length,
      firstQuestionText: first?.questionText?.substring(0, 80) + '...',
      firstQuestionCode: first?.questionCode,
      firstOptions: first?.options?.map(o => `${o.label}: ${o.text?.substring(0, 30)}`),
    };
  });

  // Step 5: Answer 5 questions
  const questions = (await get(`/api/exam/${attemptId}`, token)).questions || [];
  for (let i = 0; i < Math.min(5, questions.length); i++) {
    const q = questions[i];
    const firstOption = q.options?.[0];
    if (!firstOption) continue;
    await report(`ANSWER Q${q.position}: "${q.questionText?.substring(0, 40)}..."`, async () => {
      const r = await post('/api/exam/answer', {
        token,
        attemptId,
        position: q.position,
        selectedOptions: [firstOption.label],
        isFlagged: i === 2  // Flag question 3
      });
      if (r.error) throw new Error(r.error);
      return { saved: true, flagged: i === 2 };
    });
  }

  // Step 6: Submit Exam
  const submitResult = await report('SUBMIT EXAM', async () => {
    const r = await post('/api/exam/submit', { token, attemptId });
    if (r.error) throw new Error(r.error);
    return { status: r.status, attemptId: r.attemptId };
  });

  // Step 7: Load Result
  await report(`RESULT PAGE: /api/exam/result/${attemptId}`, async () => {
    const r = await get(`/api/exam/result/${attemptId}`, token);
    if (!r.attempt) throw new Error('No attempt data');
    return {
      score: `${r.summary?.scoredCorrect}/${r.summary?.scoredQuestions}`,
      percentage: r.summary?.scoredAccuracyPercent + '%',
      passed: r.summary?.passed,
      totalQuestions: r.summary?.totalQuestions,
      domainBreakdown: r.summary?.domainBreakdown ? Object.keys(r.summary.domainBreakdown) : [],
      firstQuestionText: r.questions?.[0]?.questionText?.substring(0, 60) + '...',
      firstOptionText: r.questions?.[0]?.options?.[0]?.text?.substring(0, 40),
      pdfButtonShouldExist: 'PDFReportView component restored — check UI',
    };
  });

  // Step 8: History
  await report('HISTORY: /api/history', async () => {
    const r = await get(`/api/history?token=${token}`, token);
    if (r.error) throw new Error(r.error);
    const latest = Array.isArray(r) ? r[0] : r.history?.[0];
    return { totalAttempts: Array.isArray(r) ? r.length : r.history?.length, latestAttemptId: latest?.id || latest?.attemptId };
  });

  // Step 9: Study Mode
  await report('STUDY MODE: /api/study', async () => {
    const r = await get('/api/study?limit=5', token);
    if (r.error) throw new Error(r.error);
    const sample = r.questions?.[0] || r[0];
    return {
      questionCount: r.questions?.length || r.length,
      sampleQuestionText: sample?.questionText?.substring(0, 60) + '...',
    };
  });

  // Step 10: Weak Areas
  await report('WEAK AREAS: /api/weak-areas', async () => {
    const r = await get(`/api/weak-areas?token=${token}`, token);
    if (r.error) throw new Error(r.error);
    return { result: JSON.stringify(r).substring(0, 200) };
  });

  // Step 11: Daily Quiz
  await report('DAILY QUIZ: /api/daily', async () => {
    const r = await get('/api/daily', token);
    if (r.error) throw new Error(r.error);
    return { questionText: r.question?.questionText?.substring(0, 60) + '...', options: r.question?.options?.length };
  });

  console.log('\n\n🎉 SIMULATION COMPLETE!\n');
}

main().catch(console.error);
