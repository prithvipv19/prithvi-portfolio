// Local stand-in for the Cloudflare Worker: `npm run dev` in twin/ (port 8787).
// Astro's dev server proxies /api/chat here. Set GEMINI_API_KEY (or ANTHROPIC_API_KEY
// for Claude) for real answers; with neither, it runs a mock.
import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { appendFile } from 'node:fs/promises';
import { createChatHandler } from './src/chat.js';

const provider = process.env.GEMINI_API_KEY || !process.env.ANTHROPIC_API_KEY ? 'gemini' : 'claude';
const apiKey = provider === 'gemini' ? process.env.GEMINI_API_KEY : process.env.ANTHROPIC_API_KEY;
const handle = createChatHandler({
  provider,
  model: process.env.MODEL,
  apiKey,
  mock: !apiKey,
  rateLimit: false, // so `npm run eval` can run every case
  logUnanswered: (entry) => appendFile(new URL('./unanswered.local.jsonl', import.meta.url), JSON.stringify(entry) + '\n'),
});

createServer(async (req, res) => {
  if (!req.url.startsWith('/api/chat')) return void res.writeHead(404).end();
  const request = new Request(`http://localhost${req.url}`, { method: req.method, headers: req.headers, body: req.method === 'POST' ? Readable.toWeb(req) : undefined, duplex: 'half' });
  const response = await handle(request, { ip: req.socket.remoteAddress ?? '' });
  res.writeHead(response.status, Object.fromEntries(response.headers));
  if (response.body) Readable.fromWeb(response.body).pipe(res);
  else res.end();
}).listen(8787, () => console.log(`Twin dev server on http://localhost:8787 (${apiKey ? provider : 'mock mode: set GEMINI_API_KEY for real answers'})`));
