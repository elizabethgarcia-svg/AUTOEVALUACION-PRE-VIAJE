// Muestra v2 del video del jurado: Catrina que se deshace en brasas, logo con chispas, lotería de misiones,
// puntos de control en orden Trabajo en Equipo → Resultados → Pasión, puente emotivo y fragmento del 877.
const W = 1280, H = 720, TOTAL = 163.3; window.TOTAL = TOTAL;
const EXC_END = 146.9, DT = 20.5; // el fragmento del 877 dura 59.7 s; lo que sigue se recorre DT
const $ = id => document.getElementById(id);
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const eo = k => 1 - Math.pow(1 - cl(k), 3), ei = k => Math.pow(cl(k), 3);
const eio = k => { k = cl(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
const back = k => { k = cl(k); const c = 1.7; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
const pr = (t, a, b) => cl((t - a) / (b - a));
const fade = (t, a, b, fi = .3, fo = .3) => Math.min(pr(t, a, a + fi), 1 - pr(t, b - fo, b));
const rnd = (i, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const show = (el, on) => { el.style.visibility = on ? 'inherit' : 'hidden'; return on; };
const PP = ['#7B2FF7', '#FF6A00', '#E6007E', '#1C1620', '#FFB300'];
const tw = (s, k) => s.slice(0, Math.floor(s.length * cl(k)));
function escribir(txt, k) { return tw(txt, k) + (k < 1 ? '<span style="opacity:.6">▌</span>' : ''); }

// ---------- radio (aud/r0..r5) ----------
const RADIO = [
  [1.0, 3.92, 'Base Centinela a todas las unidades… ¿me copian?'],
  [26.7, 31.5, 'Unidad Blindaje Centinela, salida 19 de octubre. Destino: LOMAween.'],
  [53.6, 56.35, 'Base Centinela a Trabajo en Equipo, ¿me copias?'],
  [61.6, 64.67, 'Base Centinela a Enfoque a Resultados, ¿me copias?'],
  [69.4, 71.58, 'Base Centinela a Pasión, ¿me copias?'],
  [126.8, 129.6, 'Unidad Blindaje Centinela: llegó a destino.'],
  [134.3, 135.45, 'Cambio y fuera.'],
];

// ---------- A · globo ----------
const ret = (svg, x, y, s, col, a) => {
  const d = s / 2, l = s * .28;
  svg.innerHTML = `<g stroke="${col}" stroke-width="3" fill="none" opacity="${a}">
    <path d="M${x - d},${y - d + l}V${y - d}H${x - d + l}M${x + d - l},${y - d}H${x + d}V${y - d + l}M${x + d},${y + d - l}V${y + d}H${x + d - l}M${x - d + l},${y + d}H${x - d}V${y + d - l}"/>
    <circle cx="${x}" cy="${y}" r="4" fill="${col}"/><path d="M${x - d - 30},${y}H${x - d - 8}M${x + d + 8},${y}H${x + d + 30}M${x},${y - d - 30}V${y - d - 8}M${x},${y + d + 8}V${y + d + 30}" stroke-width="2"/></g>`;
};
function escenaA(t) {
  $('aDot').style.opacity = (Math.floor(t * 2) % 2) ? .25 : 1;
  const k = eio(pr(t, 0, 3.4));
  const lat = lerp(8, 21.9895, k), lon = lerp(-62, -102.2471, k);
  const alt = t < 3 ? 20200 - t * 2600 : 12400 * Math.exp(-(Math.min(t, 8.4) - 3) * 1.6);
  $('aDat').innerHTML = `LAT ${lat.toFixed(4)}° N<br>LON ${Math.abs(lon).toFixed(4)}° O<br>ALT ${alt >= 10 ? Math.round(alt).toLocaleString('es-MX') + ' km' : (alt * 1000).toFixed(0) + ' m'}`;
  const r = pr(t, 3.2, 4.2), ra = fade(t, 3.2, 8.4, .2, .4);
  ret($('aRet'), 640, 360, lerp(320, 120, eo(r)), r < 1 ? '#FFFFFF' : '#FF8A3D', ra);
  const o = fade(t, 3.9, 8.3, .4, .4); $('aObj').style.opacity = o; $('aObj').style.transform = `translateX(${(1 - eo(pr(t, 3.9, 4.5))) * 30}px)`;
  $('aMapa').style.opacity = fade(t, 4.4, 8.3, .4, .4);
  const z = lerp(.62, 1.25, eio(pr(t, 4.4, 8.3))), px = 549, py = 45;
  $('aMapaI').style.transform = `translate(${140 - px * z}px,${70 - py * z}px) scale(${z})`;
  $('aPin').style.left = '132px'; $('aPin').style.top = '62px';
  const pp = (t * 1.3) % 1; Object.assign($('aPinR').style, { left: '132px', top: '62px', transform: `scale(${1 + pp * 3})`, opacity: 1 - pp });
}

// ---------- B1 · vista aérea / B2 · entrada de noche ----------
const FX = 1080, FY = 640;
const retBox = (svg, x, y, w, h, col, a) => {
  const l = 26;
  svg.innerHTML = `<g stroke="${col}" stroke-width="3" fill="none" opacity="${a}"><path d="M${x - w / 2},${y - h / 2 + l}V${y - h / 2}H${x - w / 2 + l}M${x + w / 2 - l},${y - h / 2}H${x + w / 2}V${y - h / 2 + l}M${x + w / 2},${y + h / 2 - l}V${y + h / 2}H${x + w / 2 - l}M${x - w / 2 + l},${y + h / 2}H${x - w / 2}V${y + h / 2 - l}"/></g>`;
};
function escenaB1(t) {
  const lt = t - 8.6, k = eo(pr(lt, 0, 2.6));
  const s = lerp(.93, 1.35, k) + ei(pr(lt, 2.35, 2.7)) * 1.4;
  const want = (c, f, S, Wd) => cl(c - f * S, Wd - (f === FX ? 1404 : 1061) * S, 0);
  const tx = want(lerp(340, 640, k), FX, s, W), ty = want(lerp(240, 360, k), FY, s, H);
  $('aer').style.transform = `translate(${tx}px,${ty}px) scale(${s})`;
  $('aer').style.filter = `blur(${lerp(10, 0, eo(pr(lt, 0, .8))) + ei(pr(lt, 2.4, 2.7)) * 8}px) saturate(.85) contrast(1.08) brightness(.92)`;
  $('bNube').style.opacity = 1 - eo(pr(lt, 0, .7));
  const rx = tx + FX * s, ry = ty + FY * s, lk = pr(lt, 1.0, 1.5), pw = 470 * s, ph = 60 * s;
  Object.assign($('bPill').style, { left: (rx - pw / 2) + 'px', top: (ry - ph / 2) + 'px', width: pw + 'px', height: ph + 'px' });
  const pt = eo(pr(lt, .3, .7)); $('bPillT').style.opacity = pt; $('bPillT').style.transform = `scale(${s / 1.35 * lerp(1.25, 1, pt)})`; $('bPillT').style.letterSpacing = lerp(10, 1, pt) + 'px';
  retBox($('bRet'), rx, ry, lerp(pw + 260, pw + 30, eo(lk)), lerp(ph + 200, ph + 26, eo(lk)), lk < 1 ? '#FFFFFF' : '#7CFFB2', fade(lt, .6, 2.55, .2, .2));
  const ob = $('bObj'); ob.style.left = (rx - pw / 2) + 'px'; ob.style.top = (ry + ph / 2 + 22) + 'px'; ob.style.opacity = fade(lt, 1.6, 2.45, .3, .2);
}
function escenaB2(t) {
  const lt = t - 11.3, s = lerp(.82, .9, lt / 1.3) + ei(pr(lt, 1.05, 1.3)) * .5;
  const tx = cl(640 - 520 * s, W - 1599 * s, 0), ty = cl(360 - 420 * s, H - 899 * s, 0);
  const n = $('noc'); n.style.transform = `translate(${tx}px,${ty}px) scale(${s})`;
  n.style.filter = `brightness(${.95 + Math.sin(t * 40) * .04 + (rnd(Math.floor(t * 12)) > .85 ? -.12 : 0)}) contrast(1.12) saturate(1.1) blur(${ei(pr(lt, 1.05, 1.3)) * 6}px)`;
  $('niebla').style.transform = `translateX(${Math.sin(t) * 30}px)`;
  $('bHora').textContent = `23:5${7 + Math.min(Math.floor(pr(lt, .1, 1.0) * 3), 2)} h`;
}

// ---------- C1 · cabina ----------
function escenaC1(t) {
  const lt = t - 12.6, s = lerp(1.45, 1.52, lt / 2.0);
  $('cab').style.transform = `translate(${(W - 900 * s) / 2}px,${lerp(-1000, -180, eio(pr(lt, 0, 2.0)))}px) scale(${s})`;
  $('cab').style.filter = `brightness(${.75 * eo(pr(lt, 0, .4)) + .05}) contrast(1.1) saturate(1.15) blur(${(1 - eo(pr(lt, 0, .35))) * 8 + ei(pr(lt, 1.8, 2.0)) * 10}px)`;
  const o = fade(lt, .45, 1.95, .35, .3); $('cPres').style.opacity = o;
  $('cPres').style.transform = `scale(${lerp(.96, 1.03, pr(lt, .45, 2.0))})`; $('cPres').style.filter = `blur(${(1 - o) * 6}px)`;
}

// ---------- C2 · Catrina que se deshace en brasas (14.6–19.6) ----------
const CAT = { ok: false }, TS = 8, CX = W / TS, CY = H / TS;
function prepCat() {
  const img = $('catImg'); if (!img.complete || !img.naturalWidth) return;
  const off = document.createElement('canvas'); off.width = W; off.height = H;
  const o = off.getContext('2d'); o.fillStyle = '#000'; o.fillRect(0, 0, W, H);
  const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
  o.drawImage(img, (W - img.naturalWidth * s) / 2, (H - img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s);
  const real = !img.src.endsWith('catrina.png');
  // umbral de quemado: ruido suave + de abajo hacia arriba
  const G = []; for (let j = 0; j < 12; j++) { G.push([]); for (let i = 0; i < 20; i++) G[j].push(rnd(i + j * 31, 4)); }
  const vn = (x, y) => { const gx = x * 19, gy = y * 11, i = Math.floor(gx), j = Math.floor(gy), fx = gx - i, fy = gy - j, sm = v => v * v * (3 - 2 * v);
    const a = G[j][i], b = G[j][i + 1], c = G[j + 1][i], d = G[j + 1][i + 1]; return lerp(lerp(a, b, sm(fx)), lerp(c, d, sm(fx)), sm(fy)); };
  const th = new Float32Array(CX * CY);
  for (let y = 0; y < CY; y++) for (let x = 0; x < CX; x++) th[y * CX + x] = cl(.5 * vn(x / CX, y / CY) + .5 * (1 - y / CY) + (rnd(x, y) - .5) * .08, 0, 1);
  const MW = 320, MH = 180, thm = new Float32Array(MW * MH);
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) thm[y * MW + x] = cl(.46 * vn(x / MW, y / MH) + .08 * vn((x * 3.7 % MW) / MW, (y * 3.7 % MH) / MH) + .46 * (1 - y / MH), 0, 1);
  const mk = document.createElement('canvas'); mk.width = MW; mk.height = MH;
  const bo = document.createElement('canvas'); bo.width = MW; bo.height = MH;
  Object.assign(CAT, { ok: true, off, th, thm, MW, MH, mk, bo, mkd: mk.getContext('2d').createImageData(MW, MH), bod: bo.getContext('2d').createImageData(MW, MH), real,
    ojos: real ? [[564, 343], [725, 343]] : [[574, 375], [706, 375]] });
}
function escenaCat(t) {
  if (!CAT.ok) prepCat();
  const lt = t - 14.6, c = $('catC').getContext('2d');
  if (!CAT.ok) { c.fillStyle = '#000'; c.fillRect(0, 0, W, H); return; }
  const s = lerp(1.16, 1.0, eo(pr(lt, 0, 1.8))) * lerp(1, 1.05, pr(lt, 1.8, 5));
  const b = eo(pr(lt, 0, .45));
  const p = pr(t, 17.0, 19.2) * 1.1 - .02;
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1; c.fillStyle = '#020103'; c.fillRect(0, 0, W, H);
  c.setTransform(s, 0, 0, s, 640 - 640 * s, 330 - 330 * s);
  c.filter = `brightness(${.15 + .85 * b}) contrast(1.08)`;
  if (p <= 0) c.drawImage(CAT.off, 0, 0);
  else {
    // máscara suave: lo que aún no se quema; borde incandescente aparte
    const { thm, mkd, bod, MW, MH } = CAT, A = mkd.data, B = bod.data;
    for (let i = 0; i < MW * MH; i++) {
      const v = thm[i], vis = cl((v - p) / .025 + .5), e = cl(1 - Math.abs(p - v) / .03);
      A[i * 4 + 3] = vis * 255;
      B[i * 4] = 255; B[i * 4 + 1] = 90 + e * 130; B[i * 4 + 2] = 20 + e * 40; B[i * 4 + 3] = e * e * 255;
    }
    CAT.mk.getContext('2d').putImageData(mkd, 0, 0); CAT.bo.getContext('2d').putImageData(bod, 0, 0);
    const tmp = CAT.tmp || (CAT.tmp = Object.assign(document.createElement('canvas'), { width: W, height: H })), tc = tmp.getContext('2d');
    tc.globalCompositeOperation = 'source-over'; tc.clearRect(0, 0, W, H); tc.drawImage(CAT.off, 0, 0);
    tc.globalCompositeOperation = 'destination-in'; tc.imageSmoothingEnabled = true; tc.drawImage(CAT.mk, 0, 0, W, H);
    c.drawImage(tmp, 0, 0);
    c.filter = 'none'; c.globalCompositeOperation = 'lighter'; c.drawImage(CAT.bo, 0, 0, W, H); c.filter = 'blur(6px)'; c.drawImage(CAT.bo, 0, 0, W, H);
  }
  c.filter = 'none'; c.globalCompositeOperation = 'lighter';
  if (p > 0) {
    const th = CAT.th;
    for (let y = 0; y < CY; y++) for (let x = 0; x < CX; x++) {
      const v = th[y * CX + x], q = p - v;
      if (q < .03) continue;
      if ((x + y) % 2) continue;
      const u = (q - .06) / .55; if (u > 1) continue;
      const r1 = rnd(x, y + 7), px = x * TS + (r1 - .5) * u * 220 + Math.sin(u * 7 + r1 * 9) * 18, py = y * TS - u * u * 300 - r1 * u * 90;
      const sz = 3.2 * (1 - u) + .6, g = 200 - u * 150 | 0;
      c.fillStyle = `rgba(255,${g},${40 - u * 30 | 0},${1 - u})`; c.fillRect(px, py, sz, sz);
    }
  }
  // ojos que se encienden
  const oj = eo(pr(lt, .9, 1.4)) * (1 - pr(t, 19.0, 19.5)) * (.85 + .15 * Math.sin(t * 9));
  if (oj > 0) for (const [x, y] of CAT.ojos) {
    const R0 = CAT.real ? 58 : 70, g = c.createRadialGradient(x, y, 0, x, y, R0); g.addColorStop(0, `rgba(255,170,60,${(CAT.real ? .5 : .85) * oj})`); g.addColorStop(.35, `rgba(255,90,0,${(CAT.real ? .22 : .35) * oj})`); g.addColorStop(1, 'rgba(255,60,0,0)');
    c.fillStyle = g; c.fillRect(x - R0, y - R0, R0 * 2, R0 * 2);
  }
  // brasas que flotan todo el tiempo
  c.setTransform(1, 0, 0, 1, 0, 0);
  for (let i = 0; i < 70; i++) {
    const v = 30 + rnd(i, 3) * 60, y = H + 20 - ((rnd(i, 2) * 800 + lt * v) % 800), x = rnd(i, 1) * W + Math.sin(lt * 1.3 + i) * 20, a = .35 + .5 * rnd(i, 5);
    c.fillStyle = `rgba(255,${120 + rnd(i, 6) * 90 | 0},30,${a * b})`; c.fillRect(x, y, 2.2, 2.2);
  }
  c.globalCompositeOperation = 'source-over';
  $('catHumo').style.opacity = .12 + .45 * pr(t, 17.0, 19.0); $('catHumo').style.transform = `translate(${-lt * 14}px,${-lt * 8}px) scale(1.2)`;
  $('sCat').style.opacity = 1 - pr(t, 19.35, 19.6);
}

// ---------- C3 · logo Centinela con chispas (19.6–23.4) y título (23.4–26.4) ----------
const LX = 640, LY = 290, LS = .7, LG = {};
function prepLogo() {
  const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg'); document.body.appendChild(svg);
  const pts = [];
  for (const [d, n] of [[LOGO_C, 230], [LOGO_D, 90]]) {
    const p = document.createElementNS(ns, 'path'); p.setAttribute('d', d); svg.appendChild(p);
    const L = p.getTotalLength();
    for (let i = 0; i < n; i++) { const q = p.getPointAtLength(L * i / n); pts.push([LX + q.x * LS, LY + q.y * LS, 0]); }
  }
  const bx = [430, 430, 420, 48]; // chispas que dibujan el contorno de CENTINELA
  for (let i = 0; i < 90; i++) pts.push([bx[0] + rnd(i, 21) * bx[2], bx[1] + rnd(i, 22) * bx[3], 1]);
  LG.ch = pts.map(([x, y, m], k) => {
    const a = rnd(k, 11) * Math.PI * 2, dist = 260 + rnd(k, 12) * 520, t0 = (m ? 20.15 : 19.62) + rnd(k, 13) * (m ? .75 : .95), dur = .32 + rnd(k, 14) * .26;
    const sx = x + Math.cos(a) * dist, sy = y + Math.sin(a) * dist, mx = (sx + x) / 2 + Math.cos(a + 1.6) * dist * .35, my = (sy + y) / 2 + Math.sin(a + 1.6) * dist * .35;
    return { x, y, sx, sy, mx, my, t0, dur, m };
  });
  LG.pC = new Path2D(LOGO_C); LG.pD = new Path2D(LOGO_D);
  $('lgSolG').innerHTML = logoSVG('lgIntro');
}
function neon(c, col, glow, lw, relleno) {
  c.save(); c.translate(LX, LY); c.scale(LS, LS);
  c.shadowColor = glow; c.shadowBlur = 22; c.lineJoin = 'round';
  if (relleno) { c.fillStyle = relleno; c.fill(LG.pC); c.fill(LG.pD); }
  c.strokeStyle = col; c.lineWidth = lw / LS; c.stroke(LG.pC); c.stroke(LG.pD); c.stroke(LG.pC);
  c.restore();
}
function marcaNeon(c, col, glow, k, relleno) {
  c.save(); c.beginPath(); c.rect(410, 410, 460 * k, 90); c.clip();
  c.shadowColor = glow; c.shadowBlur = 18; c.strokeStyle = col;
  c.font = '800 50px M'; c.letterSpacing = '6px'; c.textAlign = 'center'; c.textBaseline = 'middle';
  if (relleno) { c.fillStyle = relleno; c.fillText('CENTINELA', 643, 454); }
  c.lineWidth = 1.8; c.strokeText('CENTINELA', 643, 454); c.restore();
}
function escenaLogo(t) {
  if (!LG.ch) prepLogo();
  const c = $('logoC').getContext('2d'); c.clearRect(0, 0, W, H);
  c.globalCompositeOperation = 'lighter';
  // polvo y brasas en el aire
  for (let i = 0; i < 90; i++) {
    const x = (rnd(i, 1) * W + t * (8 + rnd(i, 2) * 14)) % W, y = (rnd(i, 3) * H - t * (6 + rnd(i, 4) * 10) % H + H) % H, r = rnd(i, 5);
    c.fillStyle = r > .8 ? `rgba(255,90,40,${.5 + .4 * Math.sin(t * 3 + i)})` : `rgba(220,230,255,${.15 + .2 * r})`; c.fillRect(x, y, r > .8 ? 2.4 : 1.6, r > .8 ? 2.4 : 1.6);
  }
  if (t < 22.3) {
    const bz = (u, p) => { const v = 1 - u; return [v * v * p.sx + 2 * v * u * p.mx + u * u * p.x, v * v * p.sy + 2 * v * u * p.my + u * u * p.y]; };
    let lit = 0;
    for (const p of LG.ch) {
      if (t < p.t0) continue;
      const u = (t - p.t0) / p.dur;
      if (u < 1) {
        const [x1, y1] = bz(u, p), [x0, y0] = bz(Math.max(0, u - .12), p);
        c.strokeStyle = 'rgba(255,150,70,.85)'; c.lineWidth = 1.8; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
        c.fillStyle = '#FFE0B0'; c.fillRect(x1 - 1.5, y1 - 1.5, 3, 3);
      } else if (t < 21.2 && !p.m) { lit++; c.fillStyle = 'rgba(255,70,30,.9)'; c.beginPath(); c.arc(p.x, p.y, 2.2, 0, 7); c.fill(); }
    }
    c.globalCompositeOperation = 'source-over';
    const nk = eo(pr(t, 20.8, 21.2)) * (1 - pr(t, 21.65, 22.3));
    if (nk > 0) { c.globalAlpha = nk * (.85 + .15 * Math.sin(t * 30)); neon(c, '#FF3A1A', '#FF2000', 3, 'rgba(255,40,10,.14)'); marcaNeon(c, '#FF3A1A', '#FF2000', 1); c.globalAlpha = 1; }
    const mk = pr(t, 20.3, 21.1); if (mk > 0 && t < 20.8) marcaNeon(c, '#FF3A1A', '#FF2000', eo(mk));
    const fl = pr(t, 21.6, 21.75) * (1 - pr(t, 21.8, 22.3));
    if (fl > 0) { c.globalAlpha = fl; neon(c, '#FFFFFF', '#FFF2D8', 5, '#FFF6EA'); marcaNeon(c, '#FFFFFF', '#FFF2D8', 1, '#FFFFFF'); c.globalAlpha = 1; }
  }
  c.globalCompositeOperation = 'source-over';
  const so = pr(t, 21.7, 21.9); $('lgSol').style.opacity = so; $('lgMarca').style.opacity = so;
  $('lgSol').style.filter = `drop-shadow(0 0 ${lerp(30, 8, pr(t, 21.8, 23)) + 3 * Math.sin(t * 4)}px rgba(255,110,30,.75))`;
  // el logo sube y entra el título
  const k = eo(pr(t, 23.4, 24.0));
  $('lgGrupo').style.transform = `translateY(${-140 * k}px) scale(${lerp(1, .62, k)})`;
  const ti = $('tit'); if (show(ti, t >= 23.45)) {
    const q = eo(pr(t, 23.45, 23.7)); $('titA').style.transform = `scale(${lerp(1.8, 1, q)})`; $('titA').style.opacity = q;
    $('titB').style.opacity = eo(pr(t, 23.9, 24.4)); $('titB').style.letterSpacing = lerp(22, 10, eo(pr(t, 23.9, 24.8))) + 'px';
  }
  $('humo1').style.transform = `translate(${-(t - 19.6) * 18}px,0) scale(1.3)`; $('humo2').style.transform = `translate(${(t - 19.6) * 12}px,${-(t - 19.6) * 6}px) scale(1.6) rotate(180deg)`;
  $('sLogo').style.opacity = Math.min(pr(t, 19.6, 19.9), 1 - pr(t, 26.1, 26.4));
}

// ---------- mapa de la bitácora ----------
const PCS = [[150, 560], [420, 300], [690, 500], [930, 250], [1140, 450]];
const NOMBRES = [['SALIDA', '19 OCT · INICIO DEL MONTAJE'], ['PC1', 'TRABAJO EN EQUIPO'], ['PC2', 'ENFOQUE A RESULTADOS'], ['PC3', 'PASIÓN'], ['META', '30 OCT · 16:00 · LOMAWEEN']];
let RUTA = [], LARGO = [], UPC = [];
function prepMapa() {
  const P = [PCS[0], ...PCS, PCS[PCS.length - 1]];
  for (let i = 1; i < P.length - 2; i++) for (let j = 0; j < 40; j++) {
    const u = j / 40, [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]];
    const f = (a, b, c, d) => .5 * ((2 * b) + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
    if (j === 0) UPC.push(RUTA.length);
    RUTA.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
  }
  RUTA.push(PCS[PCS.length - 1]); UPC.push(RUTA.length - 1);
  LARGO = [0]; for (let i = 1; i < RUTA.length; i++) LARGO.push(LARGO[i - 1] + Math.hypot(RUTA[i][0] - RUTA[i - 1][0], RUTA[i][1] - RUTA[i - 1][1]));
  const L = LARGO[LARGO.length - 1]; UPC = UPC.map(i => LARGO[i] / L);
  const d = 'M' + RUTA.map(p => p.map(v => v.toFixed(1)).join(',')).join('L');
  ['rutaBase', 'rutaDash', 'rutaHecha'].forEach(id => $(id).setAttribute('d', d));
  $('rutaHecha').setAttribute('stroke-dasharray', `${L} ${L}`);
  let rel = ''; for (let k = 0; k < 14; k++) { let s = `M-300,${k * 70 - 80}`; for (let x = -300; x <= 1600; x += 60) s += ` L${x},${(k * 70 - 80 + 26 * Math.sin(x / 140 + k) + 14 * Math.sin(x / 47 + k * 3)).toFixed(1)}`; rel += `<path d="${s}"/>`; }
  $('relieve').innerHTML = rel;
  $('pcs').innerHTML = PCS.map(([x, y], i) => `<g id="pc${i}"><circle cx="${x}" cy="${y}" r="70" fill="url(#gPC)" class="halo"/>
    <circle cx="${x}" cy="${y}" r="17" fill="#061127" stroke="#FF8A3D" stroke-width="4" class="aro"/><text x="${x}" y="${y + 6}" text-anchor="middle" font-family="M" font-weight="900" font-size="15" fill="#fff" class="ic">${i === 0 ? '▶' : i === 4 ? '★' : i}</text>
    <text x="${x}" y="${y + (i === 1 || i === 3 ? -36 : 46)}" text-anchor="middle" font-family="M" font-weight="900" font-size="15" letter-spacing="2" fill="#FFD2B8">${NOMBRES[i][0]}</text>
    <text x="${x}" y="${y + (i === 1 || i === 3 ? -18 : 64)}" text-anchor="middle" font-family="M" font-weight="800" font-size="12" letter-spacing="1.5" fill="#9FB0D0">${NOMBRES[i][1]}</text></g>`).join('');
  $('troca').innerHTML = `<circle r="30" fill="#FF5A00" opacity=".25" id="trR"/><g id="trB"><rect x="-26" y="-9" width="34" height="18" rx="3" fill="#F4F6F9"/><rect x="9" y="-8" width="16" height="16" rx="4" fill="#FF5A00"/><rect x="19" y="-6" width="5" height="12" rx="2" fill="#9FD3FF"/></g>`;
}
function enRuta(u) {
  const L = LARGO[LARGO.length - 1] * cl(u); let i = 1; while (i < LARGO.length - 1 && LARGO[i] < L) i++;
  const k = (L - LARGO[i - 1]) / (LARGO[i] - LARGO[i - 1] || 1), a = RUTA[i - 1], b = RUTA[i];
  return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI];
}
function uTroca(t) {
  const tramos = [[28.9, 29.6, 0, .06], [52.9, 54.1, .06, UPC[1]], [60.9, 62.1, UPC[1], UPC[2]], [68.7, 69.9, UPC[2], UPC[3]], [126.4, 128.0, UPC[3], 1]];
  let u = 0; for (const [a, b, u0, u1] of tramos) { if (t >= b) u = u1; else if (t >= a) { u = lerp(u0, u1, eio(pr(t, a, b))); break; } else break; }
  return u;
}
function vista(cx, cy, s, ox = 640, oy = 360) { return [ox - cx * s, oy - cy * s, s]; }
function camara(t) {
  const full = vista(645, 400, 1, 640, 380), pcV = i => vista(PCS[i][0], PCS[i][1], 1.7, 1010, 560);
  const key = [[26.4, vista(150, 560, 2.3)], [28.9, full], [53.2, full], [54.0, pcV(1)], [61.2, pcV(1)], [62.0, pcV(2)], [69.0, pcV(2)], [69.8, pcV(3)], [126.4, pcV(3)], [128.2, full]];
  for (let i = 0; i < key.length - 1; i++) {
    const [a, A] = key[i], [b, B] = key[i + 1];
    if (t < b || i === key.length - 2) { const k = eio(pr(t, a, b)); return A.map((v, j) => lerp(v, B[j], k)); }
  }
}
const PCTXT = [
  ['PUNTO DE CONTROL 1', 'TRABAJO EN EQUIPO', 'Todos necesitamos de todos: cada proceso está enlazado. Si algo falla, falla todo el sistema.', 53.2, 56.2, 2],
  ['PUNTO DE CONTROL 2', 'ENFOQUE A RESULTADOS', 'Organizarnos para la misma meta: ideas, trabajo y colaboración, como en cada turno.', 61.2, 64.2, 3],
  ['PUNTO DE CONTROL 3', 'PASIÓN', 'Llegar al corazón del operador: cuidarse es cuidar a su familia y a la sociedad.', 69.0, 71.8, 4],
];
const MAPA_ON = t => (t >= 26.4 && t < 33.6) || PCTXT.some(p => t >= p[3] && t < p[4]) || (t >= 126.4 && t < 130.0);
function escenaMapa(t) {
  const [tx, ty, s] = camara(t); $('cam').setAttribute('transform', `translate(${tx},${ty}) scale(${s})`);
  const L = LARGO[LARGO.length - 1], dib = eio(pr(t, 26.9, 29.0));
  $('rutaBase').setAttribute('opacity', dib); $('rutaDash').setAttribute('opacity', dib);
  const u = uTroca(t); $('rutaHecha').setAttribute('stroke-dashoffset', L * (1 - u));
  const [x, y, a] = enRuta(u), pp = (t * 1.2) % 1;
  $('troca').setAttribute('transform', `translate(${x},${y})`); $('trB').setAttribute('transform', `rotate(${a})`);
  $('trR').setAttribute('r', 14 + pp * 30); $('trR').setAttribute('opacity', .4 * (1 - pp));
  PCS.forEach((p, i) => {
    const g = $('pc' + i); g.setAttribute('opacity', eo(pr(t, 26.9 + i * .4, 27.3 + i * .4)));
    const hecho = i > 0 && u >= UPC[i] - .001;
    g.querySelector('.aro').setAttribute('stroke', hecho ? '#2ED573' : '#FF8A3D'); g.querySelector('.ic').textContent = hecho ? '✓' : (i === 0 ? '▶' : i === 4 ? '★' : i);
    g.querySelector('.halo').setAttribute('opacity', .6 + .4 * Math.sin(t * 4 + i));
    g.querySelectorAll('text:not(.ic)').forEach(e => e.setAttribute('opacity', s > 1.2 ? 0 : 1));
  });
  $('mapa').style.filter = t > 29.6 && t < 33.5 ? `brightness(${1 - .45 * eo(pr(t, 29.6, 30.0)) * (1 - pr(t, 33.0, 33.5))})` : '';
  const ex = $('exp');
  if (show(ex, t >= 29.6 && t < 33.5)) {
    const k = eo(pr(t, 29.6, 30.0)), out = ei(pr(t, 33.0, 33.5));
    ex.style.transform = `translateY(${(1 - k) * 500 - out * 700}px) rotate(${-2 + out * 8}deg)`;
    $('e1').innerHTML = '<b>UNIDAD:</b> ' + tw('Área de Blindaje Centinela · Equipo 2', pr(t, 29.9, 30.3));
    $('e2').innerHTML = '<b>SALIDA:</b> ' + tw('19 OCT · inicio del montaje', pr(t, 30.2, 30.6));
    $('e3').innerHTML = '<b>MISIÓN:</b> ' + tw('Cultivar y celebrar nuestras tradiciones', pr(t, 30.5, 31.1));
    $('e4').innerHTML = '<b>PUNTOS DE CONTROL:</b> ' + tw('Trabajo en Equipo · Enfoque a Resultados · Pasión', pr(t, 30.9, 31.5));
    const st = pr(t, 31.6, 31.8), se = $('eSello'); se.style.opacity = st > 0 ? 1 : 0; se.style.transform = `rotate(-12deg) scale(${lerp(2.4, 1, eo(st))})`;
    ex.style.marginLeft = (t > 31.75 && t < 32.05 ? (rnd(Math.floor(t * 60)) - .5) * 12 : 0) + 'px';
  }
  const d4 = $('e104'); if (show(d4, t >= 32.2 && t < 33.3)) { const k = back(pr(t, 32.2, 32.5)); d4.style.transform = `scale(${k}) rotate(${lerp(-18, -6, k)}deg)`; d4.style.opacity = 1 - pr(t, 33.0, 33.3); }
  const act = PCTXT.find(p => t >= p[3] && t < p[4]), r = $('radio'), pc = $('pc');
  show(r, !!act); show(pc, !!act);
  if (act) {
    const [k1, k2, k3, a, b, ri] = act, R = RADIO[ri];
    r.style.opacity = fade(t, a, b, .35, .3); r.style.transform = `translateX(${(1 - eo(pr(t, a, a + .4))) * -60}px)`;
    $('rq').innerHTML = escribir('«' + R[2] + '»', pr(t, R[0], R[1] - .2));
    const bars = $('wave').children, on = t >= R[0] && t < R[1];
    for (let i = 0; i < bars.length; i++) bars[i].style.height = (on ? 8 + 58 * Math.abs(Math.sin(t * 19 + i * 1.7) * .6 + Math.sin(t * 31 + i * .6) * .4) * (.6 + .4 * Math.sin(i / 3)) : 4 + 2 * Math.sin(t * 3 + i)) + 'px';
    $('pcK').textContent = k1; $('pcN').textContent = k2; $('pcD').textContent = k3;
    const tk = eo(pr(t, a + .9, a + 1.25)); pc.style.opacity = Math.min(tk, 1 - pr(t, b - .3, b));
    $('pcN').style.transform = `scale(${lerp(1.5, 1, tk)})`; $('pcN').style.transformOrigin = '0 50%'; $('pcD').style.opacity = eo(pr(t, a + 1.6, a + 2.0));
  }
  const ll = $('lleg'); if (show(ll, t >= 128.0 && t < 130.0)) { const k = eo(pr(t, 128.0, 128.25)); ll.style.transform = `scale(${lerp(1.6, 1, k)})`; ll.style.opacity = k * (1 - pr(t, 129.7, 130.0)); }
  $('mHud').style.opacity = t < 34 || t > 126 ? .9 : 0;
  $('sMap').style.opacity = Math.min(1, pr(t, 26.4, 26.8) + (t > 27 ? 1 : 0), t >= 129.7 ? 1 - pr(t, 129.7, 130.0) : 1);
}

// ---------- E · lotería: la Base reparte las misiones (33.6–53.2) ----------
const DECK = [800, 735], SLOT = k => [800 + (k % 5 - 2) * 232, k < 5 ? 235 : 500];
const TD = [39.0, 43.2, 47.4];
function prepLot() {
  const rev = reversoSVG(logoSVG('lrev'));
  $('cartas').innerHTML = CARTAS.map((c, k) => `<div class="carta3d" id="c3${k}"><div class="f dorso">${rev.replace(/id="rev"/g, `id="rev${k}"`).replace(/url\(#rev\)/g, `url(#rev${k})`).replace(/lrev/g, 'lrev' + k)}</div><div class="f cara">${cartaSVG(c).replace(/papel(\d+)/g, `papel$1_${k}`).replace(/cBand/g, 'cBand' + k)}</div></div>`).join('')
    + CARTAS.map((c, k) => { const [x, y] = SLOT(k); return `<div class="tag" id="tg${k}" style="left:${x - 105}px;top:${y + 122}px">${c.quien}</div>`; }).join('');
}
function poseCarta(k, t) {
  let x = DECK[0] + k * .4, y = DECK[1] - k * .5, z = k * .7, rz = (rnd(k, 3) - .5) * 4, ry = 0, op = 1;
  if (t >= 34.4 && t < 36.2) {
    const side = k % 2 ? 1 : -1, a = eo(pr(t, 34.4, 34.85)), tr = 34.9 + k * .05, b = eo(pr(t, tr, tr + .14));
    x += side * 130 * a * (1 - b); rz += side * 10 * a * (1 - b); z += Math.sin(Math.PI * b) * 18;
    const f = Math.sin(Math.PI * pr(t, 35.55, 36.15)), ang = (k - 4.5) * 9 * f;
    rz += ang; x += ang * 5; y += -Math.abs(ang) * 1.2;
  }
  const td = 36.2 + k * .2, u = pr(t, td, td + .36);
  if (u > 0) { const [sx, sy] = SLOT(k), e = eo(u); x = lerp(x, sx, e); y = lerp(y, sy, e); z = z * (1 - e) + Math.sin(Math.PI * u) * 90; rz = lerp(rz, 360 + (rnd(k, 9) - .5) * 10, e); }
  if (k < 3) {
    const T0 = TD[k], f = pr(t, T0, T0 + .4);
    if (t >= T0) { ry = 180 * eo(f); z += Math.sin(Math.PI * f) * 60; }
    if (t >= T0 + .4 && t < T0 + 2.2) op = 0;
  } else { const tf = 51.7 + (k - 3) * .13, f = pr(t, tf, tf + .3); ry = 180 * eo(f); z += Math.sin(Math.PI * f) * 40; }
  return { x, y, z, rz, ry, op };
}
function escenaLot(t) {
  if (!$('c30')) prepLot();
  const cam = eo(pr(t, 33.6, 34.6)), fin = eio(pr(t, 51.6, 52.2));
  const rx = lerp(62, 38, cam) - 4 * fin, sc = lerp(1.3, 1.0, cam) * lerp(1, .97, fin);
  $('mesa').style.transform = `rotateX(${rx}deg) scale(${sc}) translateY(${lerp(-60, 0, cam)}px)`;
  for (let k = 0; k < 10; k++) {
    const p = poseCarta(k, t), el = $('c3' + k);
    el.style.left = (p.x - 75) + 'px'; el.style.top = (p.y - 110) + 'px';
    el.style.transform = `translateZ(${p.z}px) rotateZ(${p.rz}deg) rotateY(${p.ry}deg)`; el.style.opacity = p.op;
    $('tg' + k).style.opacity = eo(pr(t, k < 3 ? 51.7 : 51.95 + (k - 3) * .13, (k < 3 ? 51.7 : 51.95 + (k - 3) * .13) + .25));
  }
  $('lotT').style.opacity = fade(t, 33.8, 36.0, .35, .3);
  $('cantor').style.opacity = fade(t, 36.0, 53.2, .3, .3);
  const co = $('corre'); if (show(co, t >= 38.4 && t < 39.05)) { const k = back(pr(t, 38.4, 38.65)); co.style.transform = `scale(${k}) rotate(-4deg)`; co.style.opacity = 1 - pr(t, 38.85, 39.05); }
  // la carta cantada: sube, se canta y vuela hacia su Centinela
  const j = TD.findIndex(v => t >= v + .4 && t < v + 2.2), big = $('big'), cn = $('canto');
  show(big, j >= 0); show(cn, j >= 0); $('lotDim').style.opacity = j >= 0 ? eo(pr(t, TD[j] + .3, TD[j] + .6)) * (1 - pr(t, TD[j] + 2.0, TD[j] + 2.2)) : 0;
  if (j >= 0) {
    const T0 = TD[j], c = CARTAS[j];
    if (big.dataset.k !== String(j)) { big.innerHTML = cartaSVG(c).replace(/papel(\d+)/g, 'papelB$1').replace(/cBand/g, 'cBandB'); big.dataset.k = j; }
    const zin = eo(pr(t, T0 + .4, T0 + .75)), out = ei(pr(t, T0 + 2.0, T0 + 2.2));
    const bx = lerp(SLOT(j)[0] * .8 - 160, 260, zin) + out * 1200, by = lerp(260, 140, zin) - out * 120;
    big.style.transform = `translate(${bx}px,${by}px) scale(${lerp(.4, 1.12, zin)}) rotate(${lerp(-20, -4, zin) + out * 30 + Math.sin(t * 2) * 1.5}deg) rotateY(${Math.sin(t * 1.6) * 6}deg)`;
    $('cantoQ').innerHTML = escribir('«' + c.canto + '»', pr(t, T0 + .65, T0 + 1.3));
    const nk = eo(pr(t, T0 + 1.3, T0 + 1.5)); $('cantoN').textContent = '¡' + c.nom + '!'; $('cantoN').style.opacity = nk; $('cantoN').style.transform = `scale(${lerp(1.5, 1, nk)})`; $('cantoN').style.transformOrigin = '0 50%';
    $('cantoP').textContent = 'PARA: ' + c.quien; $('cantoP').style.opacity = eo(pr(t, T0 + 1.55, T0 + 1.75));
    cn.style.opacity = 1 - out; cn.style.transform = `translateX(${(1 - eo(pr(t, T0 + .5, T0 + .8))) * 40}px)`;
  }
  $('lotFin').style.opacity = fade(t, 52.1, 53.2, .3, .3);
  $('sLot').style.opacity = Math.min(pr(t, 33.6, 33.9), 1 - pr(t, 52.95, 53.2));
}

// ---------- tarjetas de Centinela: reciben su misión o la explican ----------
const KS = [
  [41.2, 43.2, '../material/armado_01.jpg', 'CENTINELA 02 / 10', 'OJO DE HALCÓN', '[Nombre real] · Monitorea las unidades en el mapa', 'LE TOCÓ: EL TRABAJO EN EQUIPO', '«¡Me tocó el Trabajo en Equipo… y también el papel picado!»', '▶ <b>AQUÍ ENTRA SU VIDEO</b> · recibe su tarjeta y la lee en voz alta', 0, '50% 30%'],
  [45.4, 47.4, '../material/armado_11.jpg', 'CENTINELA 10 / 10', 'EL TURNO DE LA NOCHE', '[Nombre real] · Monitorea en el turno nocturno', 'LE TOCÓ: EL RESULTADO', '«Me tocó el Resultado: aquí se llega a tiempo.»', '▶ <b>AQUÍ ENTRA SU VIDEO</b> · recibe su tarjeta y la lee en voz alta', 1, '45% 40%'],
  [49.6, 51.6, '../material/armado_07.jpg', 'CENTINELA 07 / 10', 'EL DE LA LLAMADA', '[Nombre real] · Llama a los operadores', 'LE TOCÓ: LA PASIÓN', '«¿Cómo vas, compañero? A mí me tocó la Pasión.»', '▶ <b>AQUÍ ENTRA SU VIDEO</b> · recibe su tarjeta y la lee en voz alta', 2, '45% 35%'],
  [56.2, 58.4, '../material/armado_01.jpg', 'PUNTO DE CONTROL 1', 'OJO DE HALCÓN', '[Nombre real] · explica su tarjeta', 'SU TARJETA: EL TRABAJO EN EQUIPO', '«En la cabina cada proceso está enlazado: si falla uno, falla todo el sistema.»', '▶ <b>AQUÍ ENTRA SU VIDEO</b> · explica su tarjeta (6–8 s)', 0, '50% 30%'],
  [77.6, 81.2, '../material/armado_07.jpg', 'PUNTO DE CONTROL 3', 'EL DE LA LLAMADA', '[Nombre real] · explica su tarjeta', 'SU TARJETA: LA PASIÓN', '«Lo que se hace con el corazón se nota en los detalles. Por eso hicimos al 877: para llegar al corazón del operador… desde su casa.»', '▶ <b>AQUÍ ENTRA SU VIDEO</b> · explica su tarjeta y el objetivo del 877 (8–10 s)', 2, '45% 35%'],
];
function escenaCard(t) {
  const c = KS.find(c => t >= c[0] && t < c[1]); if (!show($('sCard'), !!c)) return;
  const [a, b, src, num, alias, rol, toco, q, ph, ci, pos] = c, lt = t - a, dur = b - a;
  if ($('kFoto').dataset.s !== src + ci) {
    $('kFoto').src = src; $('kBg').src = src; $('kFoto').dataset.s = src + ci; $('kFoto').style.objectPosition = pos;
    $('kCarta').innerHTML = cartaSVG(CARTAS[ci]).replace(/papel(\d+)/g, 'papelK$1').replace(/cBand/g, 'cBandK');
  }
  $('kNum').textContent = num; $('kAlias').textContent = alias; $('kRol').textContent = rol; $('kToco').textContent = toco; $('kQ').textContent = q; $('kPh').innerHTML = ph;
  const k = eo(pr(lt, 0, .4)); $('kMarco').style.transform = `translateX(${(1 - k) * -120}px) rotate(${lerp(-9, -3, k)}deg)`;
  $('kFoto').style.transform = `scale(${lerp(1.12, 1.02, pr(lt, 0, dur))})`;
  const kc = back(pr(lt, .15, .5)); $('kCarta').style.transform = `translate(${(1 - eo(pr(lt, .15, .5))) * 500}px,${(1 - eo(pr(lt, .15, .5))) * -200}px) rotate(${lerp(40, 8, kc) + Math.sin(t * 2) * 2}deg)`;
  const fz = dur >= 3 && lt > dur - .7; $('kFoto').style.filter = fz ? 'saturate(.25) contrast(1.2)' : '';
  $('kFreeze').style.opacity = fz ? .85 * (1 - pr(lt, dur - .7, dur - .4)) : 0;
  $('kRec').style.opacity = (Math.floor(t * 2) % 2) ? .2 : 1;
  const al = eo(pr(lt, .2, .4)); $('kAlias').style.transform = `scale(${lerp(1.5, 1, al)})`; $('kAlias').style.transformOrigin = '0 50%'; $('kAlias').style.opacity = al;
  $('kNum').style.opacity = eo(pr(lt, .1, .25)); $('kRol').style.opacity = eo(pr(lt, .35, .55)); $('kToco').style.opacity = eo(pr(lt, .45, .65));
  $('kQ').style.opacity = eo(pr(lt, .6, .9)); $('kPh').style.opacity = eo(pr(lt, .8, 1.1));
  $('sCard').style.opacity = Math.min(1, pr(lt, 0, .15), 1 - pr(t, b - .15, b));
}

// ---------- montaje, piezas y el resto del recorrido ----------
const MONT = ['05', '06', '02', '10'];
function prepMont() {
  $('tiles').innerHTML = MONT.map((n, i) => `<div class="marco" id="ti${i}" style="left:${i % 2 ? 650 : 30}px;top:${i < 2 ? 30 : 372}px;width:600px;height:318px;border-radius:12px"><img class="foto" src="../material/armado_${n}.jpg" style="width:100%;height:100%;object-position:50% ${[35, 40, 40, 30][i]}%"></div>`).join('');
}
function engranes(t) {
  const g = (cx, cy, r, n, ang, c) => { let d = ''; for (let i = 0; i < n * 2; i++) { const a0 = (i / (n * 2)) * Math.PI * 2, a1 = ((i + 1) / (n * 2)) * Math.PI * 2, R = i % 2 ? r : r + 14; d += (i ? 'L' : 'M') + (cx + Math.cos(a0) * R).toFixed(1) + ',' + (cy + Math.sin(a0) * R).toFixed(1) + 'L' + (cx + Math.cos(a1) * R).toFixed(1) + ',' + (cy + Math.sin(a1) * R).toFixed(1); }
    return `<g transform="rotate(${ang} ${cx} ${cy})"><path d="${d}Z" fill="${c}" opacity=".9"/><circle cx="${cx}" cy="${cy}" r="${r * .35}" fill="#0B0716"/></g>`; };
  return g(470, 360, 70, 10, t * 60, '#7B2FF7') + g(640, 360, 70, 10, -t * 60 + 18, '#E6007E') + g(810, 360, 70, 10, t * 60, '#FF6A00');
}
function escenaMont(t) {
  if (!show($('sMont'), t >= 58.4 && t < 61.2)) return;
  const lt = t - 58.4;
  MONT.forEach((n, i) => { const k = eo(pr(lt, i * .15, i * .15 + .3)), el = $('ti' + i); el.style.opacity = k * (lt > .85 ? .32 : 1); el.style.transform = `scale(${lerp(.8, 1, k)}) rotate(${(1 - k) * (i % 2 ? 6 : -6)}deg)`; el.querySelector('img').style.transform = `scale(${1.05 + lt * .03})`; });
  const ge = $('engr'); ge.innerHTML = engranes(t); ge.style.opacity = .55 * eo(pr(lt, .8, 1.1)); ge.style.transform = `scale(${lerp(.6, 1, eo(pr(lt, .8, 1.1)))})`; ge.style.transformOrigin = '640px 360px';
  $('mT1').textContent = 'NINGÚN VIAJE SE HACE SOLO'; $('mT2').textContent = '«Aquí todos jalamos parejo.» — La de las Alertas';
  const k = eo(pr(lt, .9, 1.15)); $('mTxt').style.opacity = k; $('mT1').style.transform = `scale(${lerp(1.3, 1, k)})`;
  $('mEq').style.opacity = eo(pr(lt, 1.4, 1.7)); $('mEq').style.transform = `translateY(${(1 - eo(pr(lt, 1.4, 1.7))) * 30}px)`;
  $('sMont').style.opacity = 1 - pr(t, 61.0, 61.2);
}
const PIEZAS = [
  [71.8, 74.0, '../material/armado_08.jpg', 'RECORRIDO · PIEZA 1 DE 7', 'EL PAPEL PICADO EN EL TECHO', 'SU TARJETA LA TIENE: OJO DE HALCÓN', '«El papel picado cruza el techo como las rutas que seguimos en el mapa.»', 1200, 1600, -300, -650, 3],
  [74.0, 76.2, '../material/armado_13.jpg', 'RECORRIDO · PIEZA 2 DE 7', 'EL ALTAR EN FORMA DE TRACTO', 'SU TARJETA LA TIENE: LA ARQUITECTA', '«Nuestro altar es un tracto, porque eso es lo que cuidamos: cada unidad que sale y cada operador que regresa.»', 1600, 900, -60, -30, 4],
];
function escenaPieza(t) {
  const p = PIEZAS.find(p => t >= p[0] && t < p[1]); if (!show($('sPieza'), !!p)) return;
  const [a, b, src, num, nom, quien, q, w, h, y0, y1, ci] = p, lt = t - a;
  const f = $('pFoto'); if (f.dataset.s !== src) { f.src = src; f.dataset.s = src; f.style.width = w + 'px'; f.style.height = h + 'px'; $('pCarta').innerHTML = cartaSVG(CARTAS[ci]).replace(/papel(\d+)/g, 'papelP$1').replace(/cBand/g, 'cBandP'); }
  const s = Math.max(W / w, H / h) * lerp(1.04, 1.12, pr(lt, 0, 2.2));
  f.style.transform = `translate(${(W - w * s) / 2}px,${lerp(y0, y1, eio(pr(lt, 0, 2.2)))}px) scale(${s})`;
  $('pNum').textContent = num; $('pNom').textContent = nom; $('pQuien').textContent = quien; $('pQ').textContent = q;
  const k = eo(pr(lt, .15, .45)); $('pNom').style.opacity = k; $('pNom').style.transform = `translateX(${(1 - k) * -40}px)`;
  $('pQuien').style.opacity = eo(pr(lt, .4, .7)); $('pQ').style.opacity = eo(pr(lt, .6, 1.0)); $('pPh').style.opacity = eo(pr(lt, .8, 1.1));
  const kc = back(pr(lt, .2, .55)); $('pCarta').style.transform = `rotate(${lerp(30, 6, kc)}deg) scale(${kc})`;
  $('sPieza').style.opacity = Math.min(1, pr(lt, 0, .15), 1 - pr(t, b - .15, b));
}
const RESTO = [5, 6, 8, 9];
function escenaResto(t) {
  if (!show($('sResto'), t >= 76.2 && t < 77.6)) return;
  const lt = t - 76.2;
  if (!$('rs0')) $('restoC').innerHTML = RESTO.map((ci, i) => `<div class="mini" id="rs${i}" style="left:${190 + i * 240}px;top:210px">${cartaSVG(CARTAS[ci]).replace(/papel(\d+)/g, 'papelR$1').replace(/cBand/g, 'cBandR')}</div><div class="tag" id="rt${i}" style="left:${160 + i * 240}px;top:452px">${CARTAS[ci].quien}</div>`).join('');
  RESTO.forEach((ci, i) => { const k = back(pr(lt, .1 + i * .12, .4 + i * .12)); $('rs' + i).style.transform = `translateY(${(1 - eo(pr(lt, .1 + i * .12, .4 + i * .12))) * 300}px) rotate(${(i - 1.5) * 3}deg) scale(${k})`; $('rt' + i).style.opacity = eo(pr(lt, .5 + i * .1, .7 + i * .1)); });
  $('sResto').style.opacity = Math.min(pr(lt, 0, .15), 1 - pr(t, 77.45, 77.6));
}
function escenaAD(t) {
  if (!show($('sAD'), t >= 64.2 && t < 66.4)) return;
  const lt = t - 64.2, k = eio(pr(lt, .4, 1.5)), x = lerp(W + 10, -10, k);
  $('adD').style.clipPath = `inset(0 0 0 ${x}px)`; $('adL').style.left = (x - 3) + 'px'; $('adL').style.opacity = k > 0 && k < 1 ? 1 : 0;
  $('adA').style.transform = $('adD').style.transform = `scale(${lerp(1.02, 1.1, lt / 2.2)})`;
  $('adT1').style.opacity = 1 - k; $('adT2').style.opacity = eo(pr(lt, 1.1, 1.4));
  $('sAD').style.opacity = Math.min(pr(lt, 0, .2), 1 - pr(t, 66.2, 66.4));
}
function escenaChk(t) {
  if (!show($('sChk'), t >= 66.4 && t < 69.0)) return;
  const lt = t - 66.4;
  [1, 2, 3, 4].forEach(i => { const k = pr(lt, .2 + i * .3, .35 + i * .3), el = $('ck' + i); el.style.opacity = eo(pr(lt, i * .3, .15 + i * .3)); const bx = el.firstElementChild; bx.textContent = k > 0 ? '✓' : ''; bx.style.background = k > 0 ? '#2ED573' : 'transparent'; bx.style.transform = `scale(${k > 0 ? back(k) : 1})`; });
  $('reloj').textContent = lt < 1.5 ? '11:58' : '11:59'; $('reloj').style.color = lt > 1.9 ? '#2ED573' : '#fff';
  const ls = pr(lt, 1.9, 2.05); $('listo').style.opacity = ls > 0 ? 1 : 0; $('listo').style.transform = `rotate(-10deg) scale(${lerp(2.4, 1, eo(ls))})`;
  $('sChk').style.opacity = Math.min(pr(lt, 0, .2), 1 - pr(t, 68.8, 69.0));
}

// ---------- el puente y el fragmento del 877 ----------
function escenaPuente(t) {
  if (!show($('sPuente'), t >= 81.2 && t < 87.2)) return;
  const lt = t - 81.2, s = lerp(1.42, 1.5, lt / 6);
  $('pnFoto').style.transform = `translate(${(W - 900 * s) / 2}px,${lerp(-260, -380, lt / 6)}px) scale(${s})`;
  [[1, .3], [2, 1.7], [3, 3.1], [4, 4.0]].forEach(([i, a]) => { const k = eo(pr(lt, a, a + .6)); $('pn' + i).style.opacity = k; $('pn' + i).style.transform = `translateY(${(1 - k) * 14}px)`; $('pn' + i).style.filter = `blur(${(1 - k) * 4}px)`; });
  $('pnPh').style.opacity = eo(pr(lt, 4.6, 5.0));
  $('sPuente').style.opacity = Math.min(pr(lt, 0, .5), 1 - pr(t, 86.8, 87.2));
}
const SEGS = [[87.2, 's0', 369], [99.0, 't1', 234], [106.3, 't2', 399], [119.1, 's2', 438], [133.2, 'u1', 411]]; // bienvenida, casita, rescate, razón y recuerdo, regreso a casa
function segFrame(t, [a, i, n]) { return `e877/${i}_${String(cl(Math.floor((t - a) * 30) + 1, 1, n)).padStart(4, '0')}.jpg`; }
function escenaExc(t) {
  if (!show($('sExc'), t >= 87.2 && t < EXC_END)) return null;
  const act = SEGS.filter(([a, i, n]) => t >= a && t < a + n / 30);
  const e0 = $('ex0'), e1 = $('ex1'), want = [];
  if (act.length) { want.push([e0, segFrame(t, act[0])]); e0.style.opacity = 1; }
  if (act.length > 1) { want.push([e1, segFrame(t, act[1])]); e1.style.opacity = pr(t, act[1][0], act[1][0] + .5); show(e1, true); } else show(e1, false);
  $('exTag').style.opacity = fade(t, 87.6, 91.2, .4, .5);
  $('sExc').style.opacity = Math.min(pr(t, 87.2, 87.6), 1 - pr(t, EXC_END - .5, EXC_END));
  return want;
}
// ---------- cierre: cambio y fuera (133.8–139.8) ----------
const CLAX = [[135.4, .35], [135.9, 1.15]];
function escenaCierre(t) {
  if (!show($('sCierre'), t >= 133.8 && t < 139.8)) return;
  const lt = t - 133.8, s = lerp(.71, .76, lt / 6);
  if (!$('ciLogoG').innerHTML) $('ciLogoG').innerHTML = logoSVG('lgCi');
  const cl0 = CLAX.reduce((m, [a, d]) => Math.max(m, t >= a && t < a + d + .25 ? Math.min(1, (t - a) / .05) * (1 - pr(t, a + d, a + d + .25)) : 0), 0);
  $('ciFoto').style.transform = `translate(${-40 - lt * 6}px,${(H - 1040 * s) / 2 + 10}px) scale(${s})`;
  $('ciFoto').style.filter = `brightness(${.98 + .4 * cl0}) saturate(1.1) contrast(1.05)`;
  const c = $('ciC').getContext('2d'); c.clearRect(0, 0, W, H); c.globalCompositeOperation = 'lighter';
  // faros del tracto que destellan con el claxon
  for (const [x, y] of [[300, 712], [140, 718]]) {
    if (cl0 <= 0) continue;
    const g = c.createRadialGradient(x, y, 0, x, y, 260); g.addColorStop(0, `rgba(255,244,220,${.9 * cl0})`); g.addColorStop(.15, `rgba(255,220,160,${.45 * cl0})`); g.addColorStop(1, 'rgba(255,200,120,0)');
    c.fillStyle = g; c.fillRect(x - 260, y - 260, 520, 520);
    const r = c.createLinearGradient(x - 700, y, x + 700, y); r.addColorStop(0, 'rgba(180,210,255,0)'); r.addColorStop(.5, `rgba(220,235,255,${.55 * cl0})`); r.addColorStop(1, 'rgba(180,210,255,0)');
    c.fillStyle = r; c.fillRect(x - 700, y - 3, 1400, 6);
  }
  // ondas de radio que salen del logo
  for (let i = 0; i < 4; i++) {
    const k = ((lt - .6) * .55 + i / 4) % 1; if (lt < .6) break;
    c.strokeStyle = `rgba(255,110,30,${(1 - k) * .75})`; c.lineWidth = 5; c.lineCap = 'round';
    c.beginPath(); c.arc(320, 108, 56 + k * 150, -Math.PI * .5, -Math.PI * .05); c.stroke();
  }
  c.globalCompositeOperation = 'source-over';
  const kl = back(pr(lt, .2, .75)); $('ciLogo').style.opacity = pr(lt, .2, .3);
  $('ciLogo').style.transform = `scale(${kl})`; $('ciLogo').style.transformOrigin = '300px 130px';
  $('ciLogo').style.filter = `drop-shadow(0 0 ${14 + 16 * cl0}px rgba(255,110,30,.7))`;
  const k1 = eo(pr(lt, .7, .95)); $('ciT1').style.opacity = k1; $('ciT1').style.transform = `scale(${lerp(1.6, 1, k1)})`;
  $('ciT2').style.opacity = eo(pr(lt, 1.2, 1.5)); $('ciT3').style.opacity = eo(pr(lt, 1.5, 1.8)); $('ciT4').style.opacity = eo(pr(lt, 1.8, 2.1));
  $('sCierre').style.opacity = Math.min(pr(lt, 0, .5), 1 - pr(t, 139.2, 139.8));
}
function escenaFin(t) {
  if (!show($('sFin'), t >= 130.0 && t < 133.8)) return;
  const lt = t - 130.0, s = lerp(.82, .9, lt / 3.8);
  $('fFoto').style.transform = `translate(${(W - 1600 * s) / 2}px,${(H - 1200 * s) / 2 - 40}px) scale(${s})`;
  $('fQ').style.opacity = 0;
  const k = eo(pr(lt, 1.5, 1.75)); $('fS').style.opacity = k; $('fS').style.transform = `scale(${lerp(1.5, 1, k)})`;
  $('fLogo').style.opacity = 0;
  $('sFin').style.opacity = Math.min(pr(lt, 0, .25), 1 - pr(t, 133.5, 133.8));
}

// ---------- partículas ----------
const ctx = $('part').getContext('2d');
function lluvia(t, t0, t1, n, dens = 1) {
  const a = fade(t, t0, t1, .4, .5) * dens; if (a <= 0) return;
  for (let i = 0; i < n; i++) {
    const v = 90 + rnd(i, 1) * 140, y = ((rnd(i, 2) * 900 + (t - t0) * v) % 900) - 80, x = rnd(i, 3) * 1360 - 40 + Math.sin(t * 1.4 + i) * 34;
    const flip = Math.cos(t * (2 + rnd(i, 4) * 3) + i), rot = t * (rnd(i, 5) - .5) * 3 + i;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(1, flip); ctx.globalAlpha = a * .9;
    if (i % 3 === 0) { ctx.fillStyle = ['#FF8A00', '#FFB300', '#FF6A00'][(i >> 2) % 3]; ctx.beginPath(); ctx.ellipse(0, 0, 7, 4, 0, 0, 7); ctx.fill(); }
    else { ctx.fillStyle = PP[i % 4 === 3 ? 4 : i % 4]; ctx.fillRect(-9, -6, 18, 12); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(-3, -2, 6, 4); }
    ctx.restore();
  }
}
function confeti(t, t0, cx, cy, n) {
  const lt = t - t0; if (lt < 0 || lt > 1.6) return;
  for (let i = 0; i < n; i++) {
    const a = rnd(i, 7) * Math.PI * 2, v = 260 + rnd(i, 8) * 520, x = cx + Math.cos(a) * v * lt, y = cy + Math.sin(a) * v * lt + 420 * lt * lt;
    ctx.save(); ctx.translate(x, y); ctx.rotate(lt * 8 + i); ctx.globalAlpha = 1 - lt / 1.6; ctx.fillStyle = PP[i % 5 === 3 ? 4 : i % 5]; ctx.fillRect(-6, -4, 12, 8); ctx.restore();
  }
}
function particulas(t) {
  ctx.clearRect(0, 0, W, H);
  lluvia(t, 12.6, 14.6, 70); lluvia(t, 23.4, 26.4, 90); lluvia(t, 130.0, 133.8, 70); lluvia(t, 139.8, 142.8, 40, .6);
  confeti(t, 23.47, 640, 400, 90); confeti(t, 32.2, 1030, 160, 70); confeti(t, 68.3, 900, 400, 60); confeti(t, 128.0, 640, 140, 80); confeti(t, 131.5, 640, 560, 90);
}
function subs(t) {
  const r = RADIO.find(([a, b]) => t >= a && t < b + .25), s = $('sub');
  if (!show(s, !!r)) return;
  $('subT').innerHTML = `<i>📻 BASE CENTINELA</i>${r[2]}`; s.style.bottom = (t < 26.4 ? 66 : 22) + 'px';
}
function flashes(t) {
  const ev = [[8.6, .9, .25], [11.3, .7, .18], [12.6, .8, .2], [14.6, 1, .45], [21.62, .3, .25], [23.45, .9, .3], [33.6, .3, .2], [53.2, .25, .15], [61.2, .25, .15], [69.0, .25, .15], [128.0, .5, .25], [131.5, .6, .3]];
  let o = 0; for (const [a, m, d] of ev) if (t >= a && t < a + d) o = Math.max(o, m * (1 - (t - a) / d));
  $('flash').style.opacity = o;
}

function render(t0) {
  const t = t0 < 87.2 ? t0 : t0 < EXC_END ? 100 : t0 - DT; // durante el 877 solo se ve el fragmento
  show($('sA'), t < 8.6) && escenaA(t);
  show($('sB1'), t >= 8.6 && t < 11.3) && escenaB1(t);
  show($('sB2'), t >= 11.3 && t < 12.6) && escenaB2(t);
  show($('sC1'), t >= 12.6 && t < 14.6) && escenaC1(t);
  show($('sCat'), t >= 14.6 && t < 19.6) && escenaCat(t);
  show($('sLogo'), t >= 19.6 && t < 26.4) && escenaLogo(t);
  show($('sMap'), MAPA_ON(t)) && escenaMapa(t);
  show($('sLot'), t >= 33.6 && t < 53.2) && escenaLot(t);
  escenaCard(t); escenaMont(t); escenaPieza(t); escenaResto(t); escenaAD(t); escenaChk(t); escenaPuente(t);
  const ex = escenaExc(t0);
  escenaFin(t);
  escenaCierre(t);
  if (show($('sEnd'), t >= 139.8)) $('sEnd').style.opacity = Math.min(pr(t, 139.8, 140.2), 1 - pr(t, 142.3, 142.8));
  const bar = t < 26.4 ? 0 : eo(pr(t, 26.4, 26.9)) * 56; $('barT').style.transform = `translateY(${-bar}px)`; $('barB').style.transform = `translateY(${bar}px)`;
  $('grano').style.backgroundPosition = `${Math.floor(rnd(Math.floor(t0 * 30), 9) * 640)}px ${Math.floor(rnd(Math.floor(t0 * 30), 10) * 360)}px`;
  particulas(t); subs(t); flashes(t);
  return ex;
}
window.render = render;
window.renderAsync = async t => {
  const im = [];
  if (t < 8.6) { const g = $('gl'), src = `globo/g_${String(Math.min(257, Math.floor(t * 30))).padStart(4, '0')}.jpg`; if (!g.src.endsWith(src)) { g.src = src; im.push(g); } }
  if (t >= 87.2 && t < EXC_END) {
    for (const [el, src] of escenaExc(t) || []) if (!el.src.endsWith(src)) { el.src = src; im.push(el); }
  }
  render(t);
  await Promise.all([...document.images].filter(i => !i.complete || im.includes(i)).map(i => i.decode().catch(() => {})));
};
prepMapa(); prepMont();
$('wave').innerHTML = Array.from({ length: 44 }, () => '<i></i>').join('');
$('fLogo').innerHTML = logoSVG('lgFin');
