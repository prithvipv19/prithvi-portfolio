// Stitches captures with transitions, lays voiceover, writes captions.srt and exports demo.mp4.
// Run from project-pipeline/: node runs/overtime/05-video/tools/build.js
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ffmpeg = require('ffmpeg-static');
const V = path.resolve(__dirname, '..');
const final = JSON.parse(fs.readFileSync(path.join(V, 'scenes.final.json'), 'utf8'));
const S = final.scenes, FPS = final.fps, TOTAL = final.total_duration_s, LEAD = final.lead_in_s;
const W = final.viewport.width, H = final.viewport.height;
// zoom-in is realised as a camera push in the outgoing clip's tail (see record.js) plus a cross-fade;
// ffmpeg's xfade 'zoomin' washed the frame out to near-white mid-transition.
const XF = { fade: 'fade', 'zoom-in': 'fade', 'zoom-out': 'fade', 'slide-left': 'slideleft', 'slide-right': 'slideright', 'slide-up': 'slideup', 'slide-down': 'slidedown' };

// ---------- video + audio filtergraph ----------
const args = ['-y', '-v', 'error'];
S.forEach((s) => args.push('-i', path.join(V, 'captures', s.id + '.webm')));
S.forEach((s) => args.push('-i', path.join(V, s.voiceover.file)));
const f = [];
S.forEach((s, i) => f.push(`[${i}:v]fps=${FPS},settb=AVTB,setpts=PTS-STARTPTS,format=yuv420p,setsar=1[v${i}]`));
let acc = 'v0';
if (S[0].transition_in.type !== 'cut') { f.push(`[v0]fade=t=in:st=0:d=${S[0].transition_in.duration_s}[a0v]`); acc = 'a0v'; }
for (let i = 1; i < S.length; i++) {
  const t = S[i].transition_in; const out = `x${i}`;
  if (t.type === 'cut' || !t.duration_s) f.push(`[${acc}][v${i}]concat=n=2:v=1:a=0[${out}]`);
  else f.push(`[${acc}][v${i}]xfade=transition=${XF[t.type] || 'fade'}:duration=${t.duration_s}:offset=${S[i].start_s.toFixed(3)}[${out}]`);
  acc = out;
}
f.push(`[${acc}]fade=t=out:st=${(TOTAL - 0.5).toFixed(3)}:d=0.5,trim=duration=${TOTAL},setpts=PTS-STARTPTS[vout]`);
S.forEach((s, i) => { const ms = Math.round(s.voiceover.start_s * 1000); f.push(`[${S.length + i}:a]aresample=48000,aformat=channel_layouts=mono,adelay=${ms}:all=1[a${i}]`); });
f.push(`${S.map((_, i) => `[a${i}]`).join('')}amix=inputs=${S.length}:normalize=0:dropout_transition=0,apad,atrim=duration=${TOTAL},aformat=sample_rates=48000:channel_layouts=stereo[aout]`);
fs.writeFileSync(path.join(__dirname, 'filtergraph.txt'), f.join(';\n'));
args.push('-filter_complex_script', path.join(__dirname, 'filtergraph.txt'), '-map', '[vout]', '-map', '[aout]',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-s', `${W}x${H}`,
  '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-t', String(TOTAL), path.join(V, 'demo.mp4'));
console.log('encoding demo.mp4 ...');
cp.execFileSync(ffmpeg, args, { stdio: 'inherit' });

// ---------- captions ----------
function silences(file) {
  const r = cp.spawnSync(ffmpeg, ['-v', 'info', '-i', file, '-af', 'silencedetect=noise=-35dB:d=0.12', '-f', 'null', '-']).stderr.toString();
  const out = []; let st = null;
  for (const l of r.split('\n')) {
    let m = l.match(/silence_start: ([\d.]+)/); if (m) st = Number(m[1]);
    m = l.match(/silence_end: ([\d.]+)/); if (m && st !== null) { out.push((st + Number(m[1])) / 2); st = null; }
  }
  return out;
}
function cues(text) {
  // One cue per sentence; merge short neighbours so each cue is at most ~84 chars (two lines).
  const sent = text.match(/[^.!?]+[.!?]+/g).map((x) => x.trim());
  const out = [];
  for (const s of sent) { if (out.length && (out[out.length - 1] + ' ' + s).length <= 60) out[out.length - 1] += ' ' + s; else out.push(s); }
  return out;
}
function wrap(t, n = 44) {
  if (t.length <= n) return t;
  const words = t.split(' '); let best = null;
  for (let i = 1; i < words.length; i++) { const a = words.slice(0, i).join(' '), b = words.slice(i).join(' '); const sc = Math.max(a.length, b.length); if (!best || sc < best.sc) best = { sc, s: a + '\n' + b }; }
  return best.s;
}
const ts = (x) => { const ms = Math.round(x * 1000); const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
let n = 0; const srt = [];
for (const s of S) {
  const parts = cues(s.narration); const vo = s.voiceover; const sil = parts.length > 1 ? silences(path.join(V, vo.file)) : [];
  const total = parts.reduce((a, p) => a + p.length, 0);
  let acc0 = 0, prev = 0;
  parts.forEach((p, k) => {
    acc0 += p.length;
    let end = k === parts.length - 1 ? vo.duration_s : vo.duration_s * (acc0 / total);
    if (k < parts.length - 1 && sil.length) { const near = sil.reduce((a, b) => (Math.abs(b - end) < Math.abs(a - end) ? b : a)); if (Math.abs(near - end) < 1.0) end = near; }
    const a = vo.start_s + prev, b = vo.start_s + end + (k === parts.length - 1 ? 0.15 : 0);
    srt.push(`${++n}\n${ts(a)} --> ${ts(b)}\n${wrap(p)}\n`); prev = end;
  });
}
fs.writeFileSync(path.join(V, 'captions.srt'), srt.join('\n'));
console.log('captions:', n, 'cues');
