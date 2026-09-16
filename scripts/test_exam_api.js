const { POST } = require('./src/app/api/exam/start/route.ts');
const { GET } = require('./src/app/api/exam/[id]/route.ts');

async function main() {
  const startReq = { json: async () => ({ userId: 'sayantan', mode: 'FULL_MOCK' }) };
  const startRes = await POST(startReq);
  const startData = await startRes.json();
  console.log('StartData:', startData);
}
main().catch(console.error);
