// Generates voiceover/SC-##.wav with macOS say (Samantha, 180 wpm) for scenes with narration.
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ffmpeg = require('ffmpeg-static');
const V = path.resolve(__dirname, '..'); const src = JSON.parse(fs.readFileSync(path.join(V, '../04-script/scenes.json'), 'utf8'));
for (const s of src.scenes) {
  if (!s.narration.trim()) continue;
  const aiff = path.join(V, 'voiceover', s.id + '.aiff');
  cp.execFileSync('say', ['-v', 'Samantha', '-r', '180', '-o', aiff, s.narration]);
  cp.execFileSync(ffmpeg, ['-y', '-v', 'error', '-i', aiff, '-ar', '48000', '-ac', '1', path.join(V, 'voiceover', s.id + '.wav')]);
  fs.unlinkSync(aiff);
}
