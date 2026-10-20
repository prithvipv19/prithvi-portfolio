// Prints questions the twin couldn't answer.
//   TWIN_URL=https://prithvi-twin.<you>.workers.dev TWIN_ADMIN_TOKEN=... npm run unanswered
// Add --delete <key> to remove one after you've answered it in src/data/twin/qa.md.
const base = process.env.TWIN_URL?.replace(/\/$/, '');
const token = process.env.TWIN_ADMIN_TOKEN;
if (!base || !token) throw new Error('Set TWIN_URL (your worker URL) and TWIN_ADMIN_TOKEN.');
const auth = { Authorization: `Bearer ${token}` };

const del = process.argv.indexOf('--delete');
if (del > 0) {
  const res = await fetch(`${base}/api/unanswered?key=${encodeURIComponent(process.argv[del + 1])}`, { method: 'DELETE', headers: auth });
  console.log(res.ok ? 'Deleted.' : `Failed: ${res.status}`);
} else {
  const res = await fetch(`${base}/api/unanswered`, { headers: auth });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const items = await res.json();
  if (!items.length) console.log('No unanswered questions.');
  for (const q of items) console.log(`${q.at?.slice(0, 16)}  [${q.kind}]  ${q.question}${q.page ? `  (on ${q.page})` : ''}\n    key: ${q.key}`);
}
