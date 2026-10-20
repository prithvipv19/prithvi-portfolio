// Injected into the mockup page during recording. Draws a cursor, highlight rings,
// click ripples, a settle marker, and applies CSS-transform camera zoom to .app.
// Everything is pointer-events:none and position:fixed, so the mockup's layout and events are untouched.
(() => {
  if (window.__ov) return;
  const MUSTARD = '240,162,2';
  const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const st = { x: 420, y: 900, from: null, sel: null, t0: 0, dur: 0, rings: [] };
  let root, cursor, marker;

  function mount() {
    const css = document.createElement('style');
    css.textContent = `
      #__ov{position:fixed;inset:0;pointer-events:none;z-index:2147483600;}
      #__ov *{pointer-events:none;}
      #__mark{position:fixed;inset:0;background:#ff00ff;z-index:2147483647;pointer-events:none;}
      .__cur{position:absolute;left:0;top:0;width:26px;height:32px;will-change:transform;filter:drop-shadow(0 2px 3px rgba(30,26,51,.35));transition:scale 120ms ease-out;transform-origin:2px 2px;}
      .__cur.press{scale:.82;}
      .__ring{position:absolute;border:3px solid rgb(${MUSTARD});box-shadow:0 0 0 6px rgba(${MUSTARD},.22),0 0 28px 4px rgba(${MUSTARD},.45);opacity:0;transition:opacity 220ms ease-out;}
      .__ring.on{opacity:1;}
      .__rip{position:absolute;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(240,162,2,.35);border:2px solid rgba(240,162,2,.85);animation:__rip 520ms ease-out forwards;}
      @keyframes __rip{from{transform:scale(.2);opacity:1}to{transform:scale(1.25);opacity:0}}`;
    document.head.appendChild(css);
    marker = document.createElement('div'); marker.id = '__mark'; document.body.appendChild(marker);
    root = document.createElement('div'); root.id = '__ov'; document.body.appendChild(root);
    cursor = document.createElement('div'); cursor.className = '__cur';
    cursor.innerHTML = '<svg width="26" height="32" viewBox="0 0 26 32"><path d="M2 2 L2 25 L8 19.5 L12.2 29 L16.4 27.2 L12.3 18 L20.5 18 Z" fill="#fff" stroke="#1e1a33" stroke-width="2" stroke-linejoin="round"/></svg>';
    root.appendChild(cursor);
    requestAnimationFrame(tick);
  }

  const el = (sel) => document.querySelector(sel);
  const center = (sel) => { const e = el(sel); if (!e) return null; const r = e.getBoundingClientRect(); if (!r.width) return null; return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };

  function tick(now) {
    if (st.sel) {
      const c = center(st.sel);
      if (c) {
        const p = st.dur > 0 ? Math.min(1, (now - st.t0) / st.dur) : 1;
        const k = ease(Math.max(0, p));
        st.x = st.from.x + (c.x - st.from.x) * k; st.y = st.from.y + (c.y - st.from.y) * k;
      }
    }
    cursor.style.transform = `translate(${st.x - 2}px, ${st.y - 2}px)`;
    for (const r of st.rings) {
      const e = el(r.sel); if (!e) continue;
      const b = e.getBoundingClientRect(); const pad = 6;
      const rad = parseFloat(getComputedStyle(e).borderTopLeftRadius) || 8;
      const sc = b.width / (e.offsetWidth || b.width) || 1;
      Object.assign(r.d.style, { left: b.left - pad + 'px', top: b.top - pad + 'px', width: b.width + pad * 2 + 'px', height: b.height + pad * 2 + 'px', borderRadius: Math.min(rad * sc + pad, 999) + 'px' });
    }
    requestAnimationFrame(tick);
  }

  window.__ov = {
    settle() { if (marker) marker.remove(); marker = null; },
    setPos(x, y) { st.sel = null; st.x = x; st.y = y; },
    pos() { return { x: st.x, y: st.y }; },
    moveTo(sel, ms) { st.from = { x: st.x, y: st.y }; st.sel = sel; st.t0 = performance.now(); st.dur = ms; },
    press() {
      cursor.classList.add('press'); setTimeout(() => cursor.classList.remove('press'), 140);
      const d = document.createElement('div'); d.className = '__rip'; d.style.left = st.x + 'px'; d.style.top = st.y + 'px';
      root.insertBefore(d, cursor); setTimeout(() => d.remove(), 600);
    },
    ring(sel, ms) {
      const d = document.createElement('div'); d.className = '__ring'; root.insertBefore(d, cursor);
      const r = { sel, d }; st.rings.push(r);
      requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('on')));
      setTimeout(() => { d.classList.remove('on'); setTimeout(() => { d.remove(); st.rings.splice(st.rings.indexOf(r), 1); }, 260); }, Math.max(0, ms - 240));
    },
    reset(ms) {
      const app = document.querySelector('.app');
      app.style.transition = `transform ${ms}ms cubic-bezier(.45,0,.25,1)`; app.style.transform = 'translate(0px, 0px) scale(1)';
    },
    camera(sel, scale, ms, curve) {
      const app = document.querySelector('.app'); const W = innerWidth, H = innerHeight;
      const prev = app.style.transform; app.style.transition = 'none'; app.style.transform = 'none';
      const e = el(sel); const b = e.getBoundingClientRect();
      app.style.transform = prev; void app.offsetWidth;
      const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
      const tx = Math.min(0, Math.max(W - scale * W, W / 2 - scale * cx));
      const ty = Math.min(0, Math.max(H - scale * H, H / 2 - scale * cy));
      app.style.transformOrigin = '0 0';
      app.style.transition = ms > 0 ? `transform ${ms}ms ${curve || 'cubic-bezier(.45,0,.25,1)'}` : 'none';
      app.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    },
  };
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
