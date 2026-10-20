// Screenshots every screen, clicks through F1, checks console errors, overflow, contrast and the element registry.
// Run from project-pipeline/: node runs/confirmation/03-mockup/tools/verify.js
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const dir = path.resolve(__dirname, '..');
const url = 'file://' + path.join(dir, 'index.html');
const flows = JSON.parse(fs.readFileSync(path.join(dir, '..', '02-spec', 'flows.json'), 'utf8'));

(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })).newPage();
  const errors = [], fail = [], overflow = [], contrast = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  const visible = (id) => page.locator(`[data-screen="${id}"]:not([hidden])`).count();
  const expectScreen = async (id, label, wait = 350) => {
    await page.waitForTimeout(wait);
    if (!(await visible(id))) fail.push(`${label}: expected ${id}, got ${await page.evaluate(() => window.__confirmation.screen)}`);
    else console.log('  ok', label, '->', id);
  };
  const click = (el) => page.locator(`[data-el="${el}"]`).click();

  for (const s of flows.screens) for (const st of s.states) {
    await page.goto(`${url}#${s.id}?state=${st}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    const ds = await page.evaluate(() => document.body.dataset.state);
    if (!(await visible(s.id)) || ds !== st) fail.push(`deep link ${s.id}?state=${st}`);
    await page.screenshot({ path: path.join(dir, 'screenshots', `${s.id}--${st}.png`) });
    const o = await page.evaluate(() => {
      const m = document.querySelector('[data-screen]:not([hidden])');
      const r = m.getBoundingClientRect(); let worst = 0;
      m.querySelectorAll('*').forEach((el) => { const b = el.getBoundingClientRect(); if (b.width && b.bottom > r.bottom + 1) worst = Math.max(worst, b.bottom - r.bottom); if (b.width && b.right > r.right + 1) worst = Math.max(worst, b.right - r.right); });
      return Math.round(worst);
    });
    if (o > 0) overflow.push(`${s.id}: ${o}px`);
    const c = await page.evaluate(() => {
      const lum = (c) => { const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
      const parse = (s) => { const m = s.match(/[\d.]+/g); return m ? m.map(Number) : null; };
      const bgOf = (el) => { while (el) { const c = parse(getComputedStyle(el).backgroundColor); if (c && (c.length < 4 || c[3] > 0.5)) return c.slice(0, 3); el = el.parentElement; } return [255, 255, 255]; };
      const out = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
      while ((n = w.nextNode())) {
        if (!n.textContent.trim()) continue;
        const el = n.parentElement; if (!el || el.closest('[hidden]')) continue;
        if (!el.getBoundingClientRect().width) continue;
        const cs = getComputedStyle(el); const fg = parse(cs.color).slice(0, 3), bg = bgOf(el);
        const L1 = lum(fg), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
        const size = parseFloat(cs.fontSize), bold = Number(cs.fontWeight) >= 700;
        const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
        const t = n.textContent.trim().slice(0, 30);
        if (ratio < need) out.push(`${ratio.toFixed(2)} "${t}"`);
        if (size < 12 && !el.closest('.mini')) out.push(`small ${size}px "${t}"`);
      }
      return out;
    });
    if (c.length) contrast.push(`${s.id}: ${[...new Set(c)].join('; ')}`);
  }

  console.log('F1');
  await page.goto(`${url}#SCR-policy?state=default`);
  await expectScreen('SCR-policy', 'start');
  await click('activate-policy-btn'); await expectScreen('SCR-tracker', 'F1.S1');
  await click('meera-card'); await expectScreen('SCR-review', 'F1.S2');
  await click('rec-extend');
  if ((await page.locator('[data-el="rec-extend"]').getAttribute('aria-pressed')) !== 'true') fail.push('F1.S3 toggle');
  await click('rec-confirm');
  await click('submit-review-btn'); await expectScreen('SCR-decision', 'F1.S3');
  await click('confirm-btn'); await expectScreen('SCR-confirmed', 'F1.S4');
  await page.waitForTimeout(2400);
  const on = await page.locator('.auto-list li.on').count();
  if (on !== 5) fail.push('F1.S5 ticked ' + on);
  await page.screenshot({ path: path.join(dir, 'tools', 'f1-s5-ticked.png') });
  await click('see-employee-btn'); await expectScreen('SCR-employee', 'F1.S5');
  await click('acknowledge-btn'); await page.waitForTimeout(300);
  if (!(await page.locator('#emp-ask.done').count())) fail.push('F1.S6 not acknowledged');
  await expectScreen('SCR-employee', 'F1.S6', 0);
  await page.screenshot({ path: path.join(dir, 'tools', 'f1-end.png') });

  const reg = JSON.parse(fs.readFileSync(path.join(dir, 'screens.json'), 'utf8'));
  const missing = [];
  for (const s of reg.screens) for (const e of s.elements) {
    await page.goto(`file://${dir}/${s.url}?state=default`); await page.waitForTimeout(100);
    if (!(await page.locator(e.selector).isVisible())) missing.push(`${s.id} ${e.id}`);
  }
  const ids = flows.screens.map((s) => s.id).sort().join();
  if (reg.screens.map((s) => s.id).sort().join() !== ids) fail.push('screens.json screen ids differ from flows.json');
  const covered = new Set(reg.screens.flatMap((s) => s.elements.map((e) => e.step)));
  const uncovered = flows.flows.flatMap((f) => f.steps.map((x) => x.id)).filter((x) => !covered.has(x));

  console.log('\nFAILURES:', fail.length ? fail : 'none');
  console.log('CONSOLE ERRORS:', errors.length ? errors : 'none');
  console.log('OVERFLOW:', overflow.length ? overflow : 'none');
  console.log('CONTRAST/SIZE:', contrast.length ? contrast : 'none');
  console.log('REGISTRY MISSING/HIDDEN:', missing.length ? missing : 'none');
  console.log('STEPS WITHOUT ELEMENT:', uncovered.length ? uncovered : 'none');
  await browser.close();
})();
