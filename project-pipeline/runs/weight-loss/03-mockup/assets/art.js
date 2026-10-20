/* Inline SVG illustrations for the mockup. Deterministic (seeded), no external images. */
(function () {
  // Small seeded PRNG so the "photo" is identical on every load.
  function rng(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function mealPhoto() {
    const r = rng(20261020);
    const W = 320, H = 240, cx = 162, cy = 122, R = 98;
    let p = '';
    p += `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Photo of a chicken rice bowl">
<defs>
  <linearGradient id="wood" x1="0" y1="0" x2="1" y2="0.2">
    <stop offset="0" stop-color="#6b4528"/><stop offset="0.5" stop-color="#7d5332"/><stop offset="1" stop-color="#5e3b22"/>
  </linearGradient>
  <radialGradient id="bowl" cx="0.45" cy="0.4" r="0.7">
    <stop offset="0" stop-color="#3d4a52"/><stop offset="0.8" stop-color="#26313a"/><stop offset="1" stop-color="#1a2229"/>
  </radialGradient>
  <radialGradient id="inner" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0.85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.35"/>
  </radialGradient>
  <radialGradient id="rice" cx="0.4" cy="0.35" r="0.8">
    <stop offset="0" stop-color="#fbf8ef"/><stop offset="1" stop-color="#e3dccb"/>
  </radialGradient>
  <linearGradient id="chix" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#d79a55"/><stop offset="0.55" stop-color="#b8742f"/><stop offset="1" stop-color="#8a4f1e"/>
  </linearGradient>
  <radialGradient id="light" cx="0.25" cy="0.15" r="0.9">
    <stop offset="0" stop-color="#fff" stop-opacity="0.18"/><stop offset="1" stop-color="#000" stop-opacity="0.25"/>
  </radialGradient>
  <clipPath id="bowlClip"><circle cx="${cx}" cy="${cy}" r="${R - 9}"/></clipPath>
</defs>
<rect width="${W}" height="${H}" fill="url(#wood)"/>`;
    // wood grain
    for (let i = 0; i < 18; i++) {
      const y = 6 + i * 13.5 + r() * 4;
      p += `<path d="M0 ${y.toFixed(1)} C 80 ${(y + r() * 6 - 3).toFixed(1)}, 200 ${(y + r() * 6 - 3).toFixed(1)}, 320 ${(y + r() * 4 - 2).toFixed(1)}" stroke="#4a2e18" stroke-opacity="${(0.25 + r() * 0.25).toFixed(2)}" stroke-width="${(0.6 + r()).toFixed(1)}" fill="none"/>`;
    }
    // napkin + chopsticks
    p += `<rect x="-20" y="168" width="70" height="90" rx="4" fill="#d9d2c3" transform="rotate(-12 15 213)"/>
<rect x="-14" y="174" width="58" height="78" rx="3" fill="none" stroke="#bfb6a4" stroke-width="1" transform="rotate(-12 15 213)"/>
<rect x="262" y="20" width="6" height="190" rx="3" fill="#3b2a1d" transform="rotate(14 265 115)"/>
<rect x="276" y="22" width="6" height="190" rx="3" fill="#47331f" transform="rotate(10 279 117)"/>`;
    // bowl shadow + bowl
    p += `<ellipse cx="${cx + 6}" cy="${cy + 9}" rx="${R + 4}" ry="${R + 2}" fill="#000" opacity="0.35"/>
<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#bowl)"/>
<circle cx="${cx}" cy="${cy}" r="${R - 9}" fill="#2c353c"/>`;
    p += `<g clip-path="url(#bowlClip)">`;
    // rice (left / bottom half)
    p += `<path d="M ${cx - 92} ${cy - 40} C ${cx - 50} ${cy - 30}, ${cx - 10} ${cy - 5}, ${cx + 8} ${cy + 22} C ${cx + 22} ${cy + 46}, ${cx + 22} ${cy + 80}, ${cx + 10} ${cy + 100} L ${cx - 100} ${cy + 100} Z" fill="url(#rice)"/>`;
    for (let i = 0; i < 420; i++) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r()) * (R - 10);
      const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
      // keep grains in the rice region (roughly below/left of the diagonal)
      const dx = x - cx, dy = y - cy;
      if (!(dy > 0.62 * (dx + 92) - 40 + 6 && dx < 6)) continue;
      const rot = Math.floor(r() * 180);
      p += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="3.2" ry="1.3" fill="${r() > 0.5 ? '#ffffff' : '#ece5d4'}" stroke="#d6cdb8" stroke-width="0.3" transform="rotate(${rot} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    }
    // chicken slices (fanned across the upper right)
    for (let i = 0; i < 6; i++) {
      const x = cx - 18 + i * 17, y = cy - 52 + i * 9;
      p += `<g transform="rotate(${38 + i * 3} ${x} ${y})">
  <rect x="${x - 9}" y="${y - 24}" width="18" height="52" rx="7" fill="url(#chix)" stroke="#8a5424" stroke-width="0.8"/>
  <rect x="${x - 9}" y="${y - 24}" width="4" height="52" rx="2" fill="#f3e2c4" opacity="0.8"/>
  <path d="M ${x - 6} ${y - 14} l 12 4 M ${x - 6} ${y - 2} l 12 4 M ${x - 6} ${y + 10} l 12 4" stroke="#5b3416" stroke-width="2.2" stroke-linecap="round" opacity="0.75"/>
</g>`;
    }
    // broccoli florets (lower right)
    const florets = [[cx + 52, cy + 30], [cx + 30, cy + 58], [cx + 68, cy + 2], [cx + 60, cy + 58]];
    florets.forEach(([fx, fy]) => {
      p += `<path d="M ${fx - 4} ${fy + 6} L ${fx - 3} ${fy + 22} L ${fx + 5} ${fy + 22} L ${fx + 4} ${fy + 6} Z" fill="#9fc46a"/>`;
      for (let k = 0; k < 9; k++) {
        const a = r() * Math.PI * 2, d = r() * 11;
        const bx = fx + Math.cos(a) * d, by = fy + Math.sin(a) * d * 0.8;
        p += `<circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="${(6 + r() * 3).toFixed(1)}" fill="${['#2f6b2a', '#3b7d31', '#285c24'][k % 3]}"/>`;
      }
      for (let k = 0; k < 10; k++) {
        const a = r() * Math.PI * 2, d = r() * 13;
        p += `<circle cx="${(fx + Math.cos(a) * d).toFixed(1)}" cy="${(fy + Math.sin(a) * d * 0.8).toFixed(1)}" r="1.4" fill="#5c9a46"/>`;
      }
    });
    // sauce drizzle over the chicken
    p += `<path d="M ${cx - 20} ${cy - 62} C ${cx + 10} ${cy - 50}, ${cx + 5} ${cy - 30}, ${cx + 40} ${cy - 22} S ${cx + 70} ${cy + 2}, ${cx + 88} ${cy + 4}" stroke="#5a2c10" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.85"/>`;
    // sesame seeds + scallions
    for (let i = 0; i < 40; i++) {
      const x = cx - 10 + r() * 90, y = cy - 70 + r() * 80;
      const rot = Math.floor(r() * 180);
      p += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="1.6" ry="0.9" fill="${r() > 0.3 ? '#f4ecd6' : '#2a2520'}" transform="rotate(${rot} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    }
    for (let i = 0; i < 12; i++) {
      const x = cx - 40 + r() * 110, y = cy - 50 + r() * 90;
      p += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="none" stroke="#6fb04a" stroke-width="1.4"/>`;
    }
    p += `</g><circle cx="${cx}" cy="${cy}" r="${R - 9}" fill="url(#inner)"/>
<circle cx="${cx}" cy="${cy}" r="${R - 4.5}" fill="none" stroke="#56636c" stroke-width="1.5" opacity="0.6"/>
<rect width="${W}" height="${H}" fill="url(#light)"/>
</svg>`;
    return p;
  }

  // Seven-segment digit drawn in local coords, then placed + slanted as a group.
  function seg(ch, x, y, w, h, t, on, off) {
    const map = { '0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc', '5': 'afgcd', '6': 'afgedc', '7': 'abc', '8': 'abcdefg', '9': 'abcfgd' };
    const lit = map[ch] || '';
    const hh = h / 2, g = 0.7, k = t / 2;
    // horizontal bar centred on y=cy from x=0..w ; vertical bar centred on x=cx from y0..y0+hh
    const Hb = (cy) => `M${k + g} ${cy} l${k} ${-k} h${w - 4 * k - 2 * g} l${k} ${k} l${-k} ${k} h${-(w - 4 * k - 2 * g)} Z`;
    const Vb = (cx, y0) => `M${cx} ${y0 + k + g} l${k} ${k} v${hh - 4 * k - 2 * g} l${-k} ${k} l${-k} ${-k} v${-(hh - 4 * k - 2 * g)} Z`;
    const segs = { a: Hb(0), g: Hb(hh), d: Hb(h), f: Vb(0, 0), b: Vb(w, 0), e: Vb(0, hh), c: Vb(w, hh) };
    let out = `<g transform="translate(${x} ${y}) skewX(-7)">`;
    for (const key of 'abcdefg') {
      const isOn = lit.includes(key);
      if (!isOn && off === 'none') continue;
      out += `<path d="${segs[key]}" fill="${isOn ? on : off}"${isOn ? ' filter="url(#lcdGlow)"' : ''}/>`;
    }
    return out + '</g>';
  }

  function scalePhoto() {
    const W = 320, H = 200;
    const on = '#e9fbff', off = 'rgba(160,220,235,0.06)';
    let p = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Photo of a bathroom scale display reading 85.7 kg">
<defs>
  <linearGradient id="floor" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9c968c"/><stop offset="1" stop-color="#77716a"/></linearGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b2f33"/><stop offset="0.55" stop-color="#121417"/><stop offset="1" stop-color="#1d2024"/></linearGradient>
  <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.16"/><stop offset="0.4" stop-color="#fff" stop-opacity="0.02"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <linearGradient id="lcd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f3a4a"/><stop offset="1" stop-color="#0a2633"/></linearGradient>
  <filter id="lcdGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <radialGradient id="glow" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stop-color="#5fd4f0" stop-opacity="0.35"/><stop offset="1" stop-color="#5fd4f0" stop-opacity="0"/></radialGradient>
  <radialGradient id="vig" cx="0.5" cy="0.45" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.4"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#floor)"/>
<path d="M0 66 H320 M0 134 H320 M106 0 V200 M213 0 V200" stroke="#5f5a54" stroke-width="2" opacity="0.6"/>
<rect x="22" y="14" width="276" height="200" rx="26" fill="#000" opacity="0.35" transform="translate(5 6)"/>
<rect x="22" y="14" width="276" height="200" rx="26" fill="url(#glass)" stroke="#3b4046" stroke-width="2"/>
<rect x="22" y="14" width="276" height="200" rx="26" fill="url(#sheen)"/>
<rect x="88" y="44" width="144" height="70" rx="8" fill="url(#lcd)" stroke="#071820" stroke-width="2"/>
<rect x="88" y="44" width="144" height="70" rx="8" fill="url(#glow)"/>`;
    // digits 8 5 . 7
    const dx = 108, dy = 58, w = 24, h = 42, t = 5.5;
    // Each position: a faint unlit "8" ghost, then the lit digit on top. Reads 85.7
    [['8', dx], ['5', dx + 34], ['7', dx + 78]].forEach(([ch, x]) => {
      p += seg('8', x, dy, w, h, t, off, off);
      p += seg(ch, x, dy, w, h, t, on, 'none');
    });
    p += `<rect x="${dx + 64}" y="${dy + h - 3}" width="5.5" height="5.5" rx="1" fill="${on}" filter="url(#lcdGlow)"/>`;
    p += `<text x="${dx + 108}" y="${dy + 42}" font-family="Karla, sans-serif" font-size="12" font-weight="700" fill="${on}">kg</text>
<circle cx="160" cy="176" r="5" fill="#2a2e33" stroke="#444a50"/>
<rect x="0" y="0" width="${W}" height="${H}" fill="url(#vig)"/>
</svg>`;
    return p;
  }

  window.MockArt = { mealPhoto: mealPhoto(), scalePhoto: scalePhoto() };
})();
