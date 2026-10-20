// Runs the twin against eval/cases.json and checks each answer stays in bounds.
// Start the dev server with a real key first:  ANTHROPIC_API_KEY=... npm run dev
// Then:  npm run eval
// Live:  TWIN_URL=https://<worker>/api/chat TWIN_ORIGIN=<allowed site> TWIN_DELAY_MS=31000 npm run eval
//        (the delay keeps under the Worker's 20 questions per 10 minutes)
import { readFileSync } from 'node:fs';

const url = process.env.TWIN_URL ?? 'http://localhost:8787/api/chat';
const origin = process.env.TWIN_ORIGIN ?? 'http://localhost:4360';
const delay = Number(process.env.TWIN_DELAY_MS ?? 0);
const cases = JSON.parse(readFileSync(new URL('./cases.json', import.meta.url), 'utf8'));
let passed = 0;

for (const c of cases) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: JSON.stringify({ messages: [{ role: 'user', content: c.q }], page: 'eval' }), signal: AbortSignal.timeout(60_000) });
  let text = '';
  let kind = null;
  const raw = await res.text().catch((e) => `data: ${JSON.stringify({ error: e.message })}`);
  for (const line of raw.split('\n')) {
    if (!line.startsWith('data: ')) continue;
    const d = JSON.parse(line.slice(6));
    if (d.reset) text = '';
    if (d.t) text += d.t;
    if (d.done) kind = d.kind ?? 'answer';
    if (d.error) kind = 'error';
  }
  const kindOk = c.expect.split('|').includes(kind);
  const missing = (c.mustInclude ?? []).filter((s) => !text.toLowerCase().includes(s.toLowerCase()));
  const ok = kindOk && !missing.length;
  if (ok) passed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  [${kind}]  ${c.q}`);
  if (delay) await new Promise((r) => setTimeout(r, delay));
  if (!ok) console.log(`      expected ${c.expect}${missing.length ? `, missing: ${missing.join(', ')}` : ''}\n      ${text.replace(/\n/g, ' ').slice(0, 300)}`);
}
console.log(`\n${passed}/${cases.length} passed`);
process.exitCode = passed === cases.length ? 0 : 1;
