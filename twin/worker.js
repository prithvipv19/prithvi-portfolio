// Cloudflare Worker for the digital twin (free tier). Routes:
//   POST   /api/chat               the chat itself (called by the site)
//   GET    /api/unanswered         questions it couldn't answer   (Authorization: Bearer ADMIN_TOKEN)
//   DELETE /api/unanswered?key=…   remove one once you've answered it in qa.md
import { createChatHandler } from './src/chat.js';

let chat;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') ?? '';
    const allowed = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());
    const cors = allowed.includes(origin) ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {};

    if (url.pathname === '/api/chat') {
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: { ...cors, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400' } });
      }
      // Only the portfolio site may use the twin (stops others spending your API credit).
      if (!cors['Access-Control-Allow-Origin']) return new Response('Forbidden', { status: 403 });
      const provider = env.PROVIDER === 'claude' ? 'claude' : 'gemini';
      chat ??= createChatHandler({
        provider,
        model: env.MODEL,
        apiKey: provider === 'claude' ? env.ANTHROPIC_API_KEY : env.GEMINI_API_KEY,
        logUnanswered: (entry) => env.UNANSWERED.put(`q:${entry.at}:${crypto.randomUUID().slice(0, 8)}`, JSON.stringify(entry)),
      });
      return chat(request, { ip: request.headers.get('CF-Connecting-IP') ?? '', headers: cors, waitUntil: (p) => ctx.waitUntil(p) });
    }

    if (url.pathname === '/api/unanswered') {
      if (!env.ADMIN_TOKEN || request.headers.get('Authorization') !== `Bearer ${env.ADMIN_TOKEN}`) return new Response('Unauthorized', { status: 401 });
      if (request.method === 'DELETE') {
        await env.UNANSWERED.delete(url.searchParams.get('key') ?? '');
        return new Response(null, { status: 204 });
      }
      const { keys } = await env.UNANSWERED.list({ prefix: 'q:', limit: 200 });
      const items = await Promise.all(keys.map(async ({ name }) => ({ key: name, ...JSON.parse((await env.UNANSWERED.get(name)) ?? '{}') })));
      return Response.json(items.reverse());
    }

    return new Response('Not found', { status: 404 });
  },
};
