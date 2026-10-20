// Screenshots every screen (default state) + clicks through hero flow F1 headlessly.
// Run from project-pipeline/: node runs/weight-loss/03-mockup/tools/verify.js
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const URL = 'file://' + path.join(ROOT, 'index.html');
const OUT = path.join(ROOT, 'screenshots');
const screens = JSON.parse(fs.readFileSync(path.join(ROOT, 'screens.json'), 'utf8'));

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errors = [];
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  const results = [];
  const ok = (name, pass, info = '') => { results.push({ name, pass, info }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${info ? '  ' + info : ''}`); };

  // 1. every screen/state deep link
  for (const s of screens.screens) {
    if (s.mocked === false) continue;
    for (const st of s.states) {
      await page.goto(`${URL}#${s.id}?state=${st}`);
      await page.waitForSelector('html[data-ready="1"]');
      await page.waitForTimeout(1300); // let CSS entry animations settle
      const vis = await page.isVisible(`[data-screen="${s.id}"]`);
      ok(`deep link ${s.id}?state=${st}`, vis);
      await page.screenshot({ path: path.join(OUT, `${s.id}--${st}.png`) });
      // overflow check: nothing wider than the viewport
      const over = await page.evaluate((id) => {
        const sec = document.querySelector(`[data-screen="${id}"]`);
        return sec.scrollWidth > sec.clientWidth + 1 ? sec.scrollWidth : 0;
      }, s.id);
      ok(`no horizontal overflow ${s.id}`, !over, over ? `scrollWidth ${over}` : '');
      // every listed element exists on its screen
      for (const el of s.elements) {
        const n = await page.locator(el.selector).count();
        ok(`  element ${el.id} on ${s.id}`, n === 1, `count=${n}`);
      }
    }
  }
  // extra: reports in month range (end of hero flow)
  await page.goto(`${URL}#SCR-reports-graph?state=default&range=month`);
  await page.waitForSelector('html[data-ready="1"]');
  await page.waitForTimeout(1300);
  await page.evaluate(() => { const s = document.querySelector('.screen.active'); s.scrollTop = s.scrollHeight; });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(OUT, 'SCR-reports-graph--default-month-range.png') });

  // 2. hero flow click-through
  const flowDir = path.join(OUT, 'flow');
  fs.mkdirSync(flowDir, { recursive: true });
  await page.goto(`${URL}#SCR-onboarding`);
  await page.waitForSelector('html[data-ready="1"]');
  const expectScreen = async (step, id) => {
    try {
      await page.waitForSelector(`[data-screen="${id}"].active`, { timeout: 4000 });
      ok(`${step} -> ${id}`, true);
    } catch { ok(`${step} -> ${id}`, false, 'active=' + (await page.getAttribute('.screen.active', 'data-screen'))); }
  };
  const shot = (name) => page.screenshot({ path: path.join(flowDir, name + '.png') });
  const click = (el) => page.locator(`.screen.active [data-el="${el}"]`).click();

  await shot('F1.S1-before');
  await click('continue-btn'); await expectScreen('F1.S1', 'SCR-dashboard');
  await click('tile-log-meal'); await expectScreen('F1.S2', 'SCR-log-meal-upload');
  await click('select-photo-btn'); await expectScreen('F1.S3', 'SCR-log-meal-photo');
  await page.waitForTimeout(300); await shot('F1.S4-before');
  await click('extract-btn'); await expectScreen('F1.S4', 'SCR-log-meal-review');
  await page.waitForTimeout(700); await shot('F1.S5-before');
  const kcalBefore = await page.textContent('.screen.active [data-total="calories"]');
  const rice = page.locator('.screen.active [data-el="item-weight-rice"]');
  await rice.fill('150');
  const kcalAfter = await page.textContent('.screen.active [data-total="calories"]');
  ok('F1.S5 totals recalc', kcalBefore !== kcalAfter, `${kcalBefore} -> ${kcalAfter}`);
  await shot('F1.S5-edited');
  await rice.press('Enter'); await expectScreen('F1.S5', 'SCR-log-meal-details');
  await page.waitForTimeout(900); await shot('F1.S6-before');
  await click('meal-time-select');
  await page.waitForTimeout(250); await shot('F1.S6-menu-open');
  await click('meal-time-option-lunch');
  await click('save-meal-btn'); await expectScreen('F1.S6', 'SCR-log-meal-saved');
  await page.waitForTimeout(700); await shot('F1.S7-before');
  const consumed = await page.textContent('.screen.active [data-el="budget-consumed"]');
  const remaining = await page.textContent('.screen.active [data-el="budget-remaining"]');
  ok('F1.S7 budget numbers', consumed === '800' && remaining === '1000', `consumed=${consumed} remaining=${remaining}`);
  await click('meal-back-btn'); await expectScreen('F1.S7', 'SCR-dashboard');
  await click('tile-capture-weight'); await expectScreen('F1.S8', 'SCR-capture-weight');
  await click('take-photo-btn');
  await page.waitForTimeout(400); await shot('F1.S9-reading');
  await expectScreen('F1.S9', 'SCR-capture-weight-confirm');
  await page.waitForTimeout(300); await shot('F1.S10-before');
  await click('save-weight-btn'); await expectScreen('F1.S10', 'SCR-capture-weight-saved');
  await page.waitForTimeout(300); await shot('F1.S11-before');
  await click('weight-back-btn'); await expectScreen('F1.S11', 'SCR-dashboard');
  await click('tile-reports'); await expectScreen('F1.S12', 'SCR-reports-graph');
  await page.waitForTimeout(1300); await shot('F1.S13-before');
  await click('range-month');
  await page.waitForTimeout(1500);
  const active = await page.textContent('.screen.active .range-btn.active');
  ok('F1.S13 month active', active.trim() === 'Month', active);
  await shot('F1.S13-after');

  ok('no console errors', errors.length === 0, errors.join(' | '));
  await browser.close();
  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  process.exit(failed.length ? 1 : 0);
})();
