// Builds scenes.final.json from 04-script/scenes.json + measured voiceover durations.
// Run from project-pipeline/: node runs/overtime/05-video/tools/timeline.js
const fs = require('fs'), path = require('path'), cp = require('child_process');
const V = path.resolve(__dirname, '..'); const RUN = path.resolve(V, '..');
const probe = require('ffprobe-static').path;
const src = JSON.parse(fs.readFileSync(path.join(RUN, '04-script/scenes.json'), 'utf8'));
const LEAD = 0.3, TAIL = 0.3, r = (x) => Math.round(x * 10) / 10;
let t = 0; const changes = [];
const scenes = src.scenes.map((sc) => {
  const f = fs.readdirSync(path.join(V, 'voiceover')).find((n) => n.startsWith(sc.id + '.'));
  const vo = f ? Number(cp.execFileSync(probe, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path.join(V, 'voiceover', f)]).toString()) : 0;
  let dur = sc.duration_s; const need = f ? vo + LEAD + TAIL : 0;
  if (need > dur) { const nd = Math.ceil(need * 10) / 10; changes.push(`${sc.id}: ${dur}s -> ${nd}s`); dur = nd; }
  const out = { ...sc, start_s: Math.round(t * 1000) / 1000, duration_s: dur, original_start_s: sc.start_s, original_duration_s: sc.duration_s,
    voiceover: f ? { file: 'voiceover/' + f, start_s: Math.round((t + LEAD) * 1000) / 1000, duration_s: Math.round(vo * 1000) / 1000 } : null };
  t += dur; t = Math.round(t * 1000) / 1000; return out;
});
const final = { fps: src.fps, viewport: src.viewport, total_duration_s: r(t), voice: 'macOS say, Samantha (en_US), rate 180 wpm',
  lead_in_s: LEAD, timing_changes: changes.length ? changes : ['none: every voiceover clip fits its scene with 0.3 s lead-in and 0.3 s tail'],
  notes: src.notes, scenes };
fs.writeFileSync(path.join(V, 'scenes.final.json'), JSON.stringify(final, null, 2));
console.log('total', final.total_duration_s, final.timing_changes);
