// Screenshots every screen/state, clicks through F1/F2/F3, checks console errors and text contrast.
// Run from project-pipeline/: node runs/overtime/03-mockup/tools/verify.js
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const dir = path.resolve(__dirname, '..');
const url = 'file://' + path.join(dir, 'index.html');
const flows = JSON.parse(fs.readFileSync(path.join(dir, '..', '02-spec', 'flows.json'), 'utf8'));

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  const fail = [];
  const expectScreen = async (id, label) => {
    await page.waitForTimeout(350);
    const ok = await page.locator(`[data-screen="${id}"]:not([hidden])`).count();
    if (!ok) fail.push(`${label}: expected ${id}, got ${await page.evaluate(() => window.__ot.screen)}`);
    else console.log('  ok', label, '->', id);
  };
  const click = async (el) => { await page.locator(`[data-el="${el}"]`).first().click(); };

  // 1. Screenshots of every screen/state via deep link.
  const overflow = [];
  const contrast = [];
  for (const s of flows.screens) {
    for (const st of s.states) {
      await page.goto(`${url}#${s.id}?state=${st}`);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(400);
      const vis = await page.locator(`[data-screen="${s.id}"]:not([hidden])`).count();
      const ds = await page.evaluate(() => document.body.dataset.state);
      if (!vis || ds !== st) fail.push(`deep link ${s.id}?state=${st} -> visible=${vis} state=${ds}`);
      await page.screenshot({ path: path.join(dir, 'screenshots', `${s.id}--${st}.png`) });
      const o = await page.evaluate(() => { const m = document.querySelector('[data-screen]:not([hidden])'); return m.scrollHeight - m.clientHeight; });
      if (o > 2) overflow.push(`${s.id}--${st}: ${o}px`);
      const c = await page.evaluate(() => {
        const lum = (c) => { const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
        const parse = (s) => { const m = s.match(/[\d.]+/g); return m ? m.map(Number) : null; };
        const bgOf = (el) => { while (el) { const c = parse(getComputedStyle(el).backgroundColor); if (c && (c.length < 4 || c[3] > 0.5)) return c.slice(0, 3); el = el.parentElement; } return [255, 255, 255]; };
        const out = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let n;
        while ((n = walker.nextNode())) {
          if (!n.textContent.trim()) continue;
          const el = n.parentElement; if (!el || el.closest('[hidden]') || el.closest('#toast')) continue;
          const r = el.getBoundingClientRect(); if (!r.width) continue;
          const cs = getComputedStyle(el);
          const fg = parse(cs.color).slice(0, 3), bg = bgOf(el);
          const L1 = lum(fg), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
          const size = parseFloat(cs.fontSize), bold = Number(cs.fontWeight) >= 700;
          const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
          if (ratio < need) out.push(`${ratio.toFixed(2)} "${n.textContent.trim().slice(0, 30)}"`);
          if (size < 12) out.push(`small ${size}px "${n.textContent.trim().slice(0, 30)}"`);
        }
        return out;
      });
      if (c.length) contrast.push(`${s.id}--${st}: ${[...new Set(c)].join('; ')}`);
    }
  }

  // 2. F1 hero flow from a cold start.
  console.log('F1');
  await page.goto(`${url}#SCR-policy?state=default`);
  await expectScreen('SCR-policy', 'F1.S1 start');
  await click('start-employee-btn'); await expectScreen('SCR-ot-apply', 'F1.S1');
  await click('day-check-2026-10-03'); await click('day-check-2026-10-04');
  const sel = await page.locator('[data-el="selected-total"] b').innerText();
  if (!sel.includes('6:15')) fail.push('F1.S2 selected total is ' + sel);
  await expectScreen('SCR-ot-apply', 'F1.S2');
  await page.locator('[data-el="remarks-input"]').fill('Covered the Line 2 backlog');
  await click('submit-btn'); await expectScreen('SCR-my-requests', 'F1.S3');
  if ((await page.locator('[data-el^="withdraw-"]').count()) !== 2) fail.push('F1.S3 expected 2 pending');
  await click('switch-to-manager'); await expectScreen('SCR-review', 'F1.S4');
  const before = await page.locator('[data-el^="request-card-"]').count();
  await click('approve-asha-2026-10-03'); await page.waitForTimeout(500);
  const after = await page.locator('[data-el^="request-card-"]').count();
  if (after !== before - 1) fail.push(`F1.S5 queue ${before} -> ${after}`);
  await expectScreen('SCR-review', 'F1.S5');
  await click('continue-payroll-btn'); await expectScreen('SCR-finalize', 'F1.S6');
  const persona = await page.evaluate(() => window.__ot.state.persona);
  if (persona !== 'admin') fail.push('F1.S6 persona ' + persona);
  await click('fin-select-all');
  const pm = await page.locator('[data-el="pay-month-select"]').inputValue();
  if (pm !== '2026-10') fail.push('F1.S7 pay month ' + pm);
  await click('consider-btn'); await expectScreen('SCR-register', 'F1.S7');
  for (const el of ['register-totals', 'arrear-line', 'reversal-line']) if (!(await page.locator(`[data-el="${el}"]`).count())) fail.push('F1.S8 missing ' + el);
  await expectScreen('SCR-register', 'F1.S8');
  await page.screenshot({ path: path.join(dir, 'tools', 'f1-end.png') });

  // 3. F2 from the review queue.
  console.log('F2');
  await page.goto(`${url}#SCR-review?state=default`);
  await click('tab-apply-team'); await expectScreen('SCR-team-apply', 'F2.S1');
  const overDisabled = await page.locator('[data-el="team-check-joseph-2026-10-18"] input').isDisabled();
  if (!overDisabled) fail.push('F2.S2 over-cap row not disabled');
  await click('team-select-all');
  const checked = await page.locator('input[data-team]:checked').count();
  console.log('  team rows ticked', checked);
  await expectScreen('SCR-team-apply', 'F2.S2');
  await click('team-apply-btn'); await expectScreen('SCR-review', 'F2.S3');

  // 4. F3 error then withdraw.
  console.log('F3');
  await page.goto(`${url}#SCR-ot-apply?state=default`);
  await click('day-check-2026-10-12'); await click('submit-btn');
  const err = await page.locator('[data-el="apply-error"]').innerText().catch(() => '');
  if (!err.includes('Remarks are required.')) fail.push('F3.S1 error text: ' + err);
  await expectScreen('SCR-ot-apply', 'F3.S1');
  await page.locator('[data-el="remarks-input"]').fill('Paint booth changeover ran long');
  await click('submit-btn'); await expectScreen('SCR-my-requests', 'F3.S1 resubmit');
  await click('withdraw-2026-10-12'); await page.waitForTimeout(300);
  const hist = await page.locator('[data-el="tab-history"]').getAttribute('aria-pressed');
  const wd = await page.locator('.st-withdrawn').count();
  if (hist !== 'true' || !wd) fail.push('F3.S2 not in History as Withdrawn');
  await expectScreen('SCR-my-requests', 'F3.S2');

  // 5. Element registry check.
  const reg = JSON.parse(fs.readFileSync(path.join(dir, 'screens.json'), 'utf8'));
  const missing = [];
  for (const s of reg.screens) {
    for (const e of s.elements) {
      await page.goto(`file://${dir}/${s.url}?state=${e.state || s.states[0]}`);
      await page.waitForTimeout(150);
      if (!(await page.locator(e.selector).count())) missing.push(`${s.id} ${e.id}`);
    }
  }
  const steps = flows.flows.flatMap((f) => f.steps.map((x) => x.id));
  const covered = new Set(reg.screens.flatMap((s) => s.elements.map((e) => e.step)).filter(Boolean));
  const uncovered = steps.filter((x) => !covered.has(x));

  console.log('\nFAILURES:', fail.length ? fail : 'none');
  console.log('CONSOLE ERRORS:', errors.length ? errors : 'none');
  console.log('OVERFLOW:', overflow.length ? overflow : 'none');
  console.log('CONTRAST/SIZE:', contrast.length ? contrast : 'none');
  console.log('REGISTRY MISSING:', missing.length ? missing : 'none');
  console.log('STEPS WITHOUT ELEMENT:', uncovered.length ? uncovered : 'none');
  await browser.close();
})();
