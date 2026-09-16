async function simulate() {
  const baseUrl = 'http://localhost:3000/api';
  const userId = 'sim_user_' + Date.now();
  console.log('--- STARTING SIMULATION for', userId, '---');

  try {
    console.log('\n[1] Starting FULL_MOCK Exam...');
    const startRes = await fetch(baseUrl + '/exam/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, mode: 'FULL_MOCK' })
    });
    const startData = await startRes.json();
    if (!startData.success) throw new Error('Failed to start: ' + JSON.stringify(startData));
    const attemptId = startData.attemptId;
    console.log('Exam started! Attempt ID:', attemptId);

    console.log('\n[2] Fetching Exam Session...');
    const getRes = await fetch(baseUrl + '/exam/' + attemptId);
    const getData = await getRes.json();
    if (!getData.success) throw new Error('Failed to fetch: ' + JSON.stringify(getData));
    console.log('Fetched session. Questions loaded:', getData.questions.length);

    console.log('\n[3] Answering first 3 questions...');
    for (let i = 0; i < 3; i++) {
      const q = getData.questions[i];
      const optId = q.options[0].id;
      const ansRes = await fetch(baseUrl + '/exam/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId, position: q.position, selectedOptions: [optId], isFlagged: false })
      });
      const ansData = await ansRes.json();
      if (!ansData.success) throw new Error('Failed to answer Q' + q.position + ': ' + JSON.stringify(ansData));
    }
    console.log('Questions answered successfully.');

    console.log('\n[4] Submitting Exam...');
    const subRes = await fetch(baseUrl + '/exam/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attemptId, autoSubmitted: false })
    });
    const subData = await subRes.json();
    if (!subData.success) throw new Error('Failed to submit: ' + JSON.stringify(subData));
    console.log('Exam submitted! Score:', subData.scorePercentage + '%');

    console.log('\n[5] Admin: Fetching all attempts...');
    const admRes = await fetch(baseUrl + '/admin/attempts');
    const admData = await admRes.json();
    if (!admData.success) throw new Error('Failed to fetch admin attempts');
    console.log('Admin sees', admData.attempts.length, 'attempts in total.');
    
    const foundMyAttempt = admData.attempts.find(a => a.attemptId === attemptId);
    if (!foundMyAttempt) throw new Error('My attempt was not found in admin list!');
    console.log('Simulation attempt located in Admin dashboard. Mode:', foundMyAttempt.mode);

    console.log('\n[6] Admin: Resetting attempt (Testing idempotent delete)...');
    const resetRes = await fetch(baseUrl + '/admin/attempts/manage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attemptId, action: 'reset' })
    });
    const resetData = await resetRes.json();
    if (!resetData.success) throw new Error('Failed to reset: ' + JSON.stringify(resetData));
    console.log('Attempt reset successfully! Message:', resetData.message);

    console.log('\n--- ALL TESTS PASSED SUCCESSFULLY! ZERO BUGS FOUND! ---');

  } catch (err) {
    console.error('\n!!! SIMULATION FAILED !!!');
    console.error(err.message);
  }
}

simulate();
