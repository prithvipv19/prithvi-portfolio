// Records each scene of scenes.final.json from the mockup with Playwright and trims it so t=0 is the first settled frame.
// Run from project-pipeline/: node runs/overtime/05-video/tools/record.js [SC-01 SC-02 ...]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ffmpeg = require('ffmpeg-static');
const V = path.resolve(__dirname, '..'); const RUN = path.resolve(V, '..');
const MOCK = path.join(RUN, '03-mockup');
const final = JSON.parse(fs.readFileSync(path.join(V, 'scenes.final.json'), 'utf8'));
const screens = JSON.parse(fs.readFileSync(path.join(MOCK, 'screens.json'), 'utf8'));
const OVERLAY = fs.readFileSync(path.join(__dirname, 'overlay.js'), 'utf8');
const W = final.viewport.width, H = final.viewport.height, FPS = final.fps;
const RAW = path.join(__dirname, 'raw'); fs.mkdirSync(RAW, { recursive: true });
const STATE_FILE = path.join(RAW, 'cursor.json');

const selectorOf = (screen, id) => {
  const s = screens.screens.find((x) => x.id === screen);
  const e = (s && s.elements.find((x) => x.id === id));
  if (e) return e.selector;
  // Clicks can navigate; look the target up on any screen.
  for (const sc of screens.screens) { const f = sc.elements.find((x) => x.id === id); if (f) return f.selector; }
  throw new Error(`target ${id} not in screens.json`);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, Math.max(0, ms)));

// Actions done behind the settle marker (restore state the deep link can't express); see issues.md.
const PRE_SETTLE = {};
// Camera moves applied instantly before the first frame (scene "opens zoomed").
const PRE_CAMERA = {};

function buildEvents(sc, idx) {
  const ev = []; let cursorAt = null, busy = 0;
  const pre = PRE_SETTLE[sc.id];
  for (const a of sc.actions) {
    if (pre && pre(a)) continue;
    const sel = a.target ? selectorOf(sc.screen, a.target) : null;
    const t = a.at_s;
    if (a.type === 'move') {
      ev.push({ t, k: 'move', sel, ms: 520 });
      ev.push({ t: t + 0.55, k: 'mouse', sel });
      cursorAt = sel; busy = t + 0.55;
    } else if (a.type === 'click') {
      if (cursorAt !== sel) { const s = Math.max(busy, t - 0.45); ev.push({ t: s, k: 'move', sel, ms: Math.max(0, (t - s) * 1000 - 30) }); }
      ev.push({ t, k: 'click', sel }); cursorAt = sel; busy = t + 0.15;
    } else if (a.type === 'hover') {
      ev.push({ t, k: 'move', sel, ms: 450 }); ev.push({ t: t + 0.46, k: 'hover', sel });
      cursorAt = sel; busy = t + (a.duration_s || 0.5);
    } else if (a.type === 'type') {
      if (cursorAt !== sel) { ev.push({ t: Math.max(busy, t - 0.45), k: 'move', sel, ms: 420 }); ev.push({ t, k: 'click', sel }); }
      ev.push({ t, k: 'type', sel, text: a.text, ms: (a.duration_s || 1.5) * 1000 }); cursorAt = sel; busy = t + (a.duration_s || 1.5);
    } else if (a.type === 'highlight') {
      ev.push({ t, k: 'ring', sel, ms: (a.duration_s || 1.5) * 1000 });
    } else if (a.type === 'scroll') {
      ev.push({ t, k: 'scroll', sel: selectorOf(sc.screen, a.to || a.target) });
    } else if (a.type === 'wait') { /* nothing */ } else throw new Error('unknown action ' + a.type);
  }
  if (sc.camera && !PRE_CAMERA[sc.id]) ev.push({ t: sc.camera.at_s, k: 'camera', sel: selectorOf(sc.screen, sc.camera.target), scale: sc.camera.scale, ms: sc.camera.duration_s * 1000 });
  // Transition tails (footage recorded past duration_s, only seen under the next scene's transition):
  const next = final.scenes[idx + 1], tr = next && next.transition_in;
  if (tr && tr.type === 'zoom-in' && next.camera && next.screen === sc.screen) {
    // zoom-in: push into the next scene's camera framing while the fade runs, so the cross-fade lands on matching framing.
    ev.push({ t: sc.duration_s, k: 'camera', sel: selectorOf(sc.screen, next.camera.target), scale: next.camera.scale, ms: tr.duration_s * 1000, curve: 'cubic-bezier(.2,.7,.3,1)' });
  } else if (tr && tr.type === 'fade' && sc.camera && next.screen === sc.screen && !next.camera) {
    // Same screen next, unzoomed: ease back out so the fade does not double-expose two framings.
    // Finish by duration_s, so both sides of the fade share the same framing.
    const from = Math.max(sc.camera.at_s + sc.camera.duration_s + 0.1, sc.duration_s - 0.9);
    ev.push({ t: from, k: 'reset', ms: (sc.duration_s - from) * 1000 - 40 });
  }
  return ev.map((e, i) => ({ ...e, i })).sort((a, b) => a.t - b.t || a.i - b.i);
}

function findSettleOffset(raw) {
  // Sample one pixel per frame (passthrough timing) and find the first non-magenta frame after the marker.
  const info = cp.execFileSync(require('ffprobe-static').path, ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'frame=best_effort_timestamp_time', '-of', 'csv=p=0', raw]).toString().trim().split('\n').map(Number);
  const px = cp.execFileSync(ffmpeg, ['-v', 'error', '-i', raw, '-vf', 'crop=4:4:in_w/4:in_h/4,scale=1:1', '-fps_mode', 'passthrough', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { maxBuffer: 1 << 26 });
  // Early frames can flicker (blank page before the marker mounts), so use the last magenta frame.
  let last = -1; const n = Math.min(info.length, px.length / 3);
  for (let i = 0; i < n; i++) { const r = px[i * 3], g = px[i * 3 + 1], b = px[i * 3 + 2]; if (r > 200 && g < 80 && b > 200) last = i; }
  if (last < 0 || last + 1 >= n) throw new Error('settle marker not found in ' + raw);
  return info[last + 1];
}

async function recordScene(browser, sc, idx, cursor) {
  const next = final.scenes[idx + 1];
  const pad = next && next.transition_in.type !== 'cut' ? next.transition_in.duration_s : 0;
  const len = sc.duration_s + pad;
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, recordVideo: { dir: RAW, size: { width: W, height: H } } });
  await ctx.addInitScript(OVERLAY);
  const page = await ctx.newPage();
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  const url = 'file://' + path.join(MOCK, 'index.html') + '#' + sc.screen + '?state=' + sc.state + (sc.id === 'SC-15' ? '&range=month' : ''); // SC-15 continues SC-14 after its Month click
  await page.goto(url);
  await page.waitForFunction(() => window.__ov && document.querySelector('#__mark'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector('html[data-ready="1"]', { state: 'attached' });
  await page.waitForSelector(`[data-screen="${sc.screen}"].active`);
  await page.evaluate(([x, y]) => window.__ov.setPos(x, y), [cursor.x, cursor.y]);
  const pre = PRE_SETTLE[sc.id];
  if (pre) for (const a of sc.actions.filter(pre)) await page.locator(selectorOf(sc.screen, a.target)).first().click();
  if (PRE_CAMERA[sc.id] && sc.camera) await page.evaluate(([s, k]) => window.__ov.camera(s, k, 0), [selectorOf(sc.screen, sc.camera.target), sc.camera.scale]);
  // Settle: entry animation (260 ms) and any other finite animations done, then a short hold.
  await page.waitForTimeout(320);
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== 'running' || a.effect.getTiming().iterations === Infinity), null, { timeout: 3000 }).catch(() => {});
  await page.waitForTimeout(150);
  await page.evaluate(() => window.__ov.settle());
  const t0 = Date.now();
  const log = [];
  for (const e of buildEvents(sc, idx)) {
    await sleep(t0 + e.t * 1000 - Date.now());
    const late = (Date.now() - t0) / 1000 - e.t; log.push(`${e.t.toFixed(2)} ${e.k} ${e.sel || ''} late=${late.toFixed(3)}`);
    const loc = e.sel ? page.locator(e.sel).first() : null;
    if (e.k === 'move') await page.evaluate(([s, ms]) => window.__ov.moveTo(s, ms), [e.sel, e.ms]);
    else if (e.k === 'mouse') { const b = await loc.boundingBox({ timeout: 300 }).catch(() => null); if (b) await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); }
    else if (e.k === 'hover') await loc.hover({ force: true, timeout: 1500 });
    else if (e.k === 'click') {
      await page.evaluate(() => window.__ov.press()); await loc.click({ timeout: 1500 });
      if (sc.camera) { // A click that leaves the zoomed screen eases the camera back out.
        await page.waitForTimeout(40);
        if ((await page.evaluate(() => document.querySelector('.screen.active').dataset.screen)) !== sc.screen) { await page.evaluate(() => window.__ov.reset(600)); log.push('      camera reset after navigation'); }
      }
    }
    else if (e.k === 'scroll') await page.evaluate((s) => document.querySelector(s).scrollIntoView({ behavior: 'smooth', block: 'center' }), e.sel);
    else if (e.k === 'type' && e.text === '\n') await page.keyboard.press('Enter');
    else if (e.k === 'type') { await loc.focus(); await page.keyboard.press('Meta+A'); await loc.pressSequentially(e.text, { delay: Math.max(10, e.ms / e.text.length - 8) }); }
    else if (e.k === 'ring') await page.evaluate(([s, ms]) => window.__ov.ring(s, ms), [e.sel, e.ms]);
    else if (e.k === 'reset') await page.evaluate((ms) => window.__ov.reset(ms), e.ms);
    else if (e.k === 'camera') await page.evaluate(([s, k, ms, c]) => window.__ov.camera(s, k, ms, c), [e.sel, e.scale, e.ms, e.curve]);
  }
  await sleep(t0 + (len + 0.4) * 1000 - Date.now());
  const endScreen = await page.evaluate(() => document.querySelector('.screen.active').dataset.screen);
  const endCursor = await page.evaluate(() => window.__ov.pos());
  const video = page.video();
  await ctx.close();
  const raw = path.join(RAW, sc.id + '.raw.webm');
  await video.saveAs(raw); await video.delete();
  const off = findSettleOffset(raw);
  const out = path.join(V, 'captures', sc.id + '.webm');
  cp.execFileSync(ffmpeg, ['-y', '-v', 'error', '-ss', off.toFixed(3), '-i', raw, '-t', len.toFixed(3), '-vf', `fps=${FPS},setpts=PTS-STARTPTS`, '-an',
    '-c:v', 'libvpx-vp9', '-crf', '12', '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', out]);
  console.log(`${sc.id}: settle offset ${off.toFixed(3)}s, captured ${len}s, end screen ${endScreen}${errors.length ? ' ERRORS ' + errors.join('; ') : ''}`);
  log.forEach((l) => console.log('   ' + l));
  return { endCursor, endScreen };
}

(async () => {
  const only = process.argv.slice(2);
  const browser = await chromium.launch();
  let cursor = { x: 420, y: 900 };
  const saved = fs.existsSync(STATE_FILE) ? JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')) : {};
  const results = saved;
  for (let i = 0; i < final.scenes.length; i++) {
    const sc = final.scenes[i];
    if (only.length && !only.includes(sc.id)) { if (results[sc.id]) cursor = results[sc.id].endCursor; continue; }
    if (i > 0 && results[final.scenes[i - 1].id]) cursor = results[final.scenes[i - 1].id].endCursor;
    results[sc.id] = await recordScene(browser, sc, i, cursor);
    cursor = results[sc.id].endCursor;
    fs.writeFileSync(STATE_FILE, JSON.stringify(results, null, 2));
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
