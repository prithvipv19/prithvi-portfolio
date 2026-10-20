# Digital twin backend

The "Ask my AI twin" chat on the site, running as a free Cloudflare Worker and answering
with Google Gemini's free tier (or Claude, by changing one setting). The site
itself is on GitHub Pages. The twin answers **only** from:

- `src/data/resume.yaml`
- published case studies in `src/content/work/`
- verified interview answers in `src/data/twin/qa.md`

`npm run knowledge` (run automatically by the site build and the Worker deploy) merges
these into `twin/knowledge.json`, which goes into the model's system prompt.

## Costs

- GitHub Pages and the Cloudflare Workers free plan (100k requests/day, KV storage): **$0**, no card.
- Gemini API free tier (Google AI Studio key, no card): **$0**, with per-minute and per-day
  request limits. When the limit is hit, visitors see "I'm getting a lot of questions right
  now, please try again in a minute". On the free tier Google may use prompts and answers
  (your public portfolio content and visitors' questions) to improve its products.
- To use Claude instead (paid, roughly 1–2 cents a question): set `PROVIDER = "claude"` in
  `wrangler.toml`, run `npx wrangler secret put ANTHROPIC_API_KEY`, and redeploy.
- The Worker only answers requests from the origins in `ALLOWED_ORIGINS`, and limits each
  visitor to 20 questions per 10 minutes.

## One-time setup

**1. Cloudflare Worker** (from `twin/`)

```bash
npm install
npx wrangler login                          # opens the browser; free account is fine
npx wrangler kv namespace create UNANSWERED # paste the printed id into wrangler.toml
npx wrangler secret put GEMINI_API_KEY      # free key: aistudio.google.com → Get API key
npx wrangler secret put ADMIN_TOKEN         # any long random string, for reading the log
npm run deploy                              # prints https://prithvi-twin.<you>.workers.dev
```

In `wrangler.toml`, set `ALLOWED_ORIGINS` to your GitHub Pages origin, e.g.
`https://<username>.github.io` (origin only, no repo path), then `npm run deploy` again.

**2. GitHub Pages** (repo settings)

- Push this project to a GitHub repository.
- Settings → Pages → Source: **GitHub Actions**.
- Settings → Secrets and variables → Actions → **Variables** → `TWIN_ENDPOINT` =
  `https://prithvi-twin.<you>.workers.dev/api/chat`
- Optional, to redeploy the Worker automatically when qa.md or case studies change:
  **Secrets** → `CLOUDFLARE_API_TOKEN` (Cloudflare → My Profile → API Tokens →
  "Edit Cloudflare Workers" template).

Every push to `main` then rebuilds and publishes the site (`.github/workflows/deploy-site.yml`).

## Answering questions the twin couldn't

When the twin can't answer from the knowledge (or a question is off topic), it says so
and logs the question to Cloudflare KV. To review them:

```bash
TWIN_URL=https://prithvi-twin.<you>.workers.dev TWIN_ADMIN_TOKEN=<token> npm run unanswered
```

(or browse the `UNANSWERED` namespace in the Cloudflare dashboard). Write an answer as a
new `## Q:` block in `src/data/twin/qa.md`, push, and remove the entry with
`npm run unanswered -- --delete <key>`.

## Local development

```bash
npm run dev                          # API on :8787 (mock answers without a key)
GEMINI_API_KEY=... npm run dev       # real answers (Gemini)
npm run eval                         # 30 in-bounds / must-refuse checks against :8787
npx wrangler dev                     # the real Worker runtime locally, if needed
```

Astro's dev server proxies `/api` to `:8787`.
