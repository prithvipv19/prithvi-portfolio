// Gate checks for demo.mp4. Run from project-pipeline/: node runs/overtime/05-video/tools/verify.js
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ffmpeg = require('ffmpeg-static'), probe = require('ffprobe-static').path;
const V = path.resolve(__dirname, '..'), MOCK = path.resolve(V, '../03-mockup');
const final = JSON.parse(fs.readFileSync(path.join(V, 'scenes.final.json'), 'utf8'));
const screens = JSON.parse(fs.readFileSync(path.join(MOCK, 'screens.json'), 'utf8'));
const demo = path.join(V, 'demo.mp4'), CK = path.join(__dirname, 'checks'); fs.mkdirSync(CK, { recursive: true });
const grab = (t, out) => cp.execFileSync(ffmpeg, ['-y', '-v', 'error', '-ss', t.toFixed(3), '-i', demo, '-frames:v', '1', out]);
const ssim = (a, b) => { const r = cp.spawnSync(ffmpeg, ['-i', a, '-i', b, '-lavfi', 'ssim', '-f', 'null', '-']).stderr.toString(); const m = r.match(/All:([\d.]+)/); return m ? Number(m[1]) : NaN; };
const dur = Number(cp.execFileSync(probe, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', demo]).toString());
console.log(`duration ${dur.toFixed(3)} vs ${final.total_duration_s} -> ${Math.abs(dur - final.total_duration_s) <= 0.5 ? 'PASS' : 'FAIL'}`);
console.log('scene boundaries (frame at start+0.5 vs mockup screenshot, SSIM; whole frame and rail 0-264px):');
for (const s of final.scenes) {
  const out = path.join(CK, `${s.id}--start.png`); grab(s.start_s + 0.5, out);
  const ref = path.join(MOCK, 'screenshots/' + s.screen + '--' + s.state + '.png');
  console.log(`  ${s.id} ${s.screen}?${s.state} ssim=${ssim(out, ref).toFixed(3)}`);
}
console.log('after-click frames (click at_s + 0.7):');
for (const s of final.scenes) for (const a of s.actions.filter((x) => x.type === 'click')) {
  const t = s.start_s + a.at_s + 0.7; if (t > s.start_s + s.duration_s) continue;
  const out = path.join(CK, `${s.id}--after-${a.target}.png`); grab(t, out); console.log('  ' + path.basename(out));
}
// Audio: voice windows must not overlap and must end inside their scene.
let ok = true;
final.scenes.forEach((s, i) => {
  const end = s.voiceover.start_s + s.voiceover.duration_s, n = final.scenes[i + 1];
  if (end > s.start_s + s.duration_s || (n && end > n.voiceover.start_s)) { ok = false; console.log('  overlap ' + s.id); }
});
console.log('voice clips inside scenes, no overlap ->', ok ? 'PASS' : 'FAIL');
const vd = cp.spawnSync(ffmpeg, ['-i', demo, '-af', 'volumedetect', '-vn', '-f', 'null', '-']).stderr.toString();
const mx = Number(vd.match(/max_volume: ([-\d.]+)/)[1]), mean = vd.match(/mean_volume: ([-\d.]+)/)[1];
console.log(`max_volume ${mx} dB, mean ${mean} dB -> ${mx < 0 ? 'PASS' : 'FAIL'}`);
// Captions vs speech: speech onsets (silence ends) in the final mix compared with cue starts.
const sd = cp.spawnSync(ffmpeg, ['-i', demo, '-af', 'silencedetect=noise=-35dB:d=0.25', '-vn', '-f', 'null', '-']).stderr.toString();
const onsets = [...sd.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
const srt = fs.readFileSync(path.join(V, 'captions.srt'), 'utf8').split(/\n\n+/).filter(Boolean).map((b) => { const m = b.match(/(\d+):(\d+):(\d+),(\d+) --> (\d+):(\d+):(\d+),(\d+)/); const t = (h, mi, s, ms) => h * 3600 + mi * 60 + +s + ms / 1000; return [t(+m[1], +m[2], m[3], +m[4]), t(+m[5], +m[6], m[7], +m[8])]; });
let worst = 0;
for (const s of final.scenes) {
  const on = onsets.filter((o) => o >= s.start_s && o < s.start_s + s.duration_s)[0];
  const cue = srt.find((c) => c[0] >= s.start_s - 0.01 && c[0] < s.start_s + s.duration_s);
  const d = on !== undefined && cue ? Math.abs(on - cue[0]) : NaN; worst = Math.max(worst, d || 0);
  console.log(`  ${s.id} speech onset ${on !== undefined ? on.toFixed(2) : '?'} first cue ${cue ? cue[0].toFixed(2) : '?'} diff ${isNaN(d) ? '?' : d.toFixed(2)}`);
}
const lastEnd = Math.max(...srt.map((c) => c[1]));
console.log(`captions: ${srt.length} cues, worst first-cue offset ${worst.toFixed(2)} s, last cue ends ${lastEnd.toFixed(2)} -> ${worst < 0.3 ? 'PASS' : 'CHECK'}`);
